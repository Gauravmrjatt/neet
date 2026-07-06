#!/usr/bin/env python3
"""
Scraper for AYUSH and Veterinary NEET UG allotment data.
Downloads and parses result PDFs from AACCC and VCI official websites,
aggregates individual allotments into cutoff records (opening/closing rank
per institute+course+quota+category+round), enriches with state and collegeType,
and merges with existing data files.
"""

import json
import os
import re
import sys
import tempfile
from collections import defaultdict

import pdfplumber
import requests

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'data')

VCI_RESULTS_URL = "https://vci.admissions.nic.in/results/"
AACCC_URL = "https://aaccc.gov.in/ug-counselling/"
AACCC_ARCHIVE_URL = "https://aaccc.gov.in/archive-ug/"
VCI_ARCHIVE_URL = "https://vci.admissions.nic.in/archive/"

COURSE_MAP = {
    'Bachelor of Ayurvedic Medicine and Surgery': 'BAMS',
    'Bachelor of Homoeopathic Medicine and Surgery': 'BHMS',
    'Bachelor of Siddha Medicine and Surgery': 'BSMS',
    'Bachelor of Unani Medicine and Surgery': 'BUMS',
    'B.V.Sc and A.H': 'BVSc & AH',
}

CATEGORY_MAP = {
    'Open': 'GN', 'GN': 'GN', 'General': 'GN',
    'Open PwD': 'GN-PH', 'GN PwD': 'GN-PH', 'GN PH': 'GN-PH',
    'OBC': 'OBC', 'BC': 'OBC',
    'OBC PwD': 'OBC-PH', 'BC PwD': 'OBC-PH',
    'EWS': 'EWS', 'EW': 'EWS',
    'EWS PwD': 'EWS-PH', 'EW PwD': 'EWS-PH',
    'SC': 'SC', 'ST': 'ST',
    'SC PwD': 'SC-PH', 'ST PwD': 'ST-PH',
}

ALLOWED_QUOTAS = {'AIQ', 'CU'}

COLLEGE_TYPE_KEYWORDS = {
    'deemed': 'Deemed',
    'private': 'Private',
    'pvt.': 'Private',
    'self finance': 'Private',
    'management': 'Private',
}

USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'

STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Jammu and Kashmir', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
    'Delhi', 'Chandigarh', 'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli',
    'Daman and Diu', 'Lakshadweep',
]

CITY_TO_STATE = {
    'Bangalore': 'Karnataka', 'Bengaluru': 'Karnataka', 'Mysore': 'Karnataka',
    'Hubli': 'Karnataka', 'Gadag': 'Karnataka', 'Shivamogga': 'Karnataka',
    'Bidar': 'Karnataka', 'Hassan': 'Karnataka', 'Belagavi': 'Karnataka',
    'Chennai': 'Tamil Nadu', 'Madras': 'Tamil Nadu', 'Coimbatore': 'Tamil Nadu',
    'Namakkal': 'Tamil Nadu', 'Tirunelveli': 'Tamil Nadu', 'Thanjavur': 'Tamil Nadu',
    'Hyderabad': 'Telangana', 'Warangal': 'Telangana',
    'Mumbai': 'Maharashtra', 'Bombay': 'Maharashtra', 'Nagpur': 'Maharashtra',
    'Pune': 'Maharashtra', 'Satara': 'Maharashtra', 'Parbhani': 'Maharashtra',
    'Jaipur': 'Rajasthan', 'Jodhpur': 'Rajasthan', 'Bikaner': 'Rajasthan',
    'Tonk': 'Rajasthan', 'Sikar': 'Rajasthan', 'Udaipur': 'Rajasthan',
    'Lucknow': 'Uttar Pradesh', 'Mathura': 'Uttar Pradesh', 'Bareilly': 'Uttar Pradesh',
    'Meerut': 'Uttar Pradesh',
    'Patna': 'Bihar', 'Begusarai': 'Bihar', 'Gaya': 'Bihar',
    'Ahmedabad': 'Gujarat', 'Anand': 'Gujarat',
    'Hisar': 'Haryana', 'Rohtak': 'Haryana',
    'Guwahati': 'Assam', 'Khanapara': 'Assam',
    'Kolkata': 'West Bengal', 'Nadia': 'West Bengal',
    'Thrissur': 'Kerala', 'Pookode': 'Kerala', 'Kannur': 'Kerala',
    'Bhubaneswar': 'Odisha',
    'Bhopal': 'Madhya Pradesh', 'Jabalpur': 'Madhya Pradesh', 'Indore': 'Madhya Pradesh',
    'Rewa': 'Madhya Pradesh', 'Mhow': 'Madhya Pradesh', 'Gwalior': 'Madhya Pradesh',
    'Chandigarh': 'Chandigarh',
    'Ludhiana': 'Punjab',
    'Dehradun': 'Uttarakhand', 'Pantnagar': 'Uttarakhand',
    'Srinagar': 'Jammu and Kashmir', 'Jammu': 'Jammu and Kashmir',
    'Aizawl': 'Mizoram',
    'Shillong': 'Meghalaya',
    'Imphal': 'Manipur',
    'Raipur': 'Chhattisgarh', 'Durg': 'Chhattisgarh',
    'Tirupati': 'Andhra Pradesh', 'Proddatur': 'Andhra Pradesh', 'Gannavaram': 'Andhra Pradesh',
    'Godavari': 'Andhra Pradesh',
    'Ranchi': 'Jharkhand', 'Godda': 'Jharkhand',
}


def fetch(uri):
    r = requests.get(uri, headers={'User-Agent': USER_AGENT}, timeout=120)
    r.raise_for_status()
    return r


def extract_state(text):
    for state in sorted(STATES, key=len, reverse=True):
        if state.lower() in text.lower():
            return state
    m = re.search(r'\b(?:Delhi|Puducherry|Chandigarh|Goa)\b', text)
    if m:
        return m.group()
    for city, state in CITY_TO_STATE.items():
        if city.lower() in text.lower():
            return state
    return ''


def determine_college_type(quota_raw, institute_text):
    lower = quota_raw.lower()
    inst_lower = institute_text.lower()
    for kw, ct in COLLEGE_TYPE_KEYWORDS.items():
        if kw in inst_lower or kw in lower:
            return ct
    if 'government' in lower or 'govt' in lower or 'aided' in lower:
        return 'Government'
    if any(kw in inst_lower for kw in ['government', 'govt', 'state', 'rajkiya', 'madras veterinary', 'bombay veterinary']):
        return 'Government'
    if 'central university' in inst_lower or 'national institute' in inst_lower:
        return 'Government'
    return 'Government'


def normalize_name(name):
    """Normalize an institute name for matching."""
    n = name.lower().strip()
    n = re.sub(r'\s*\([^)]*\)\s*', ' ', n)
    n = re.sub(r'\s+', ' ', n).strip()
    return n


def extract_institute_short(full_address):
    """Extract a short institute name from the full PDF address."""
    addr = full_address.strip()
    addr = re.sub(r'\s*\(The college is under the Pvt\. Sector\)', '', addr)
    parts = [p.strip() for p in addr.split(',') if p.strip()]
    if not parts:
        return addr
    name = parts[0]
    if len(name) < 10 and len(parts) > 1:
        name = name + ', ' + parts[1]
    name = name.strip().rstrip(',').strip()
    name = re.sub(r'\s+', ' ', name)
    return name


def match_existing_institute(pdf_address, short_name, existing_names):
    """Find the best matching existing institute name.
    Checks both: existing name in PDF address, and short name in existing name."""
    pdf_lower = pdf_address.lower()
    short_lower = normalize_name(short_name)
    matches = []
    for name in existing_names:
        name_lower = name.lower()
        name_norm = normalize_name(name)
        score = 0
        if name_lower in pdf_lower:
            score = len(name)
        elif short_lower and short_lower in name_norm:
            score = len(short_name)
        elif name_norm in pdf_lower:
            score = len(name) * 0.8
        if score > 0:
            matches.append((score, name))
    if matches:
        return max(matches, key=lambda x: x[0])[1]
    return None


def map_quota(quota_raw):
    lower = quota_raw.lower()
    if 'central' in lower or 'cu' in lower:
        return 'CU'
    return 'AIQ'


def parse_round_from_title(text):
    text_lower = text.lower()
    if 'ssvr' in text_lower or 'special stray vacancy round' in text_lower:
        return 7
    if any(p in text_lower for p in ['svr 2', 'svr ii', 'svr-2', 'svr-ii', 'stray round ii', 'stray vacancy round-2', 'round ii', 'round-ii']):
        return 6
    if any(p in text_lower for p in ['svr 1', 'svr i', 'svr-1', 'svr-i', 'stray vacancy round-1', 'stray round i', 'round i', 'round-i']):
        return 5
    if 'stray' in text_lower or 'svr' in text_lower:
        return 5
    if 'round 3' in text_lower or 'round iii' in text_lower:
        return 3
    if 'round 2' in text_lower or 'round ii' in text_lower:
        return 2
    if 'round 1' in text_lower or 'round i' in text_lower:
        return 1
    if 'mop-up' in text_lower or 'mopup' in text_lower:
        return 4
    return 0


def parse_pdf_simple(pdf_path, fallback_round=5, fallback_year=2025):
    records = []
    detected_round = fallback_round
    detected_year = fallback_year
    found_header = False
    try:
        with pdfplumber.open(pdf_path) as pdf:
            first_page = True
            for page in pdf.pages:
                text = page.extract_text() or ''
                if first_page:
                    r = parse_round_from_title(text[:500])
                    if r:
                        detected_round = r
                    lines = text.split('\n')
                    for line in lines[:10]:
                        m = re.search(r'(?:^|\s)(20\d{2})(?:\s|$)', line)
                        if m:
                            yr = int(m.group(1))
                            if 2023 <= yr <= 2030:
                                detected_year = yr
                                break
                    first_page = False
                tables = page.extract_tables()
                for table in tables:
                    if not table or len(table) < 2:
                        continue
                    if not found_header:
                        for idx, row in enumerate(table):
                            if not row:
                                continue
                            row_text = ' '.join(str(c or '').strip().lower() for c in row)
                            if 'sno' in row_text and 'rank' in row_text:
                                found_header = True
                                start_row = idx + 1
                                break
                        else:
                            start_row = 0
                    else:
                        start_row = 0
                    for row_idx, row in enumerate(table):
                        if not found_header and row_idx < start_row:
                            continue
                        if len(row) < 7:
                            continue
                        sno = str(row[0]).strip() if row[0] else ''
                        if not sno.isdigit():
                            continue
                        rank_str = str(row[1]).strip() if row[1] else ''
                        rank_str = re.sub(r'[^\d]', '', rank_str)
                        if not rank_str:
                            continue
                        rank = int(rank_str)
                        # Upgrade formats: col[5] is "Reporting Status" (Reported/Not Reported), NOT category
                        # 17-col R3 upgrade: data in cols 10-14
                        if len(row) >= 15 and str(row[10]).strip() not in ('-', '', 'None', None):
                            quota_raw = str(row[10]).strip()
                            institute_raw = str(row[11]).strip()
                            course_raw = str(row[12]).strip()
                            allotted_cat = str(row[13]).strip()
                            candidate_cat = str(row[14]).strip()
                        # 13-col VCI R2 upgrade: data in cols 6-10
                        elif len(row) >= 12 and str(row[6]).strip() not in ('-', '', 'None', None):
                            quota_raw = str(row[6]).strip()
                            institute_raw = str(row[7]).strip()
                            course_raw = str(row[8]).strip()
                            allotted_cat = str(row[9]).strip()
                            candidate_cat = str(row[10]).strip()
                        else:
                            quota_raw = str(row[2]).strip() if row[2] else ''
                            institute_raw = str(row[3]).strip() if row[3] else ''
                            course_raw = str(row[4]).strip() if row[4] else ''
                            allotted_cat = str(row[5]).strip() if row[5] else ''
                            candidate_cat = str(row[6]).strip() if row[6] else ''
                        records.append({
                            'rank': rank,
                            'quota_raw': quota_raw.replace('\n', ' ').strip(),
                            'institute': institute_raw.replace('\n', ' ').strip(),
                            'course_raw': course_raw.replace('\n', ' ').strip(),
                            'allotted_category': re.sub(r'\s+', ' ', allotted_cat).strip(),
                            'candidate_category': re.sub(r'\s+', ' ', candidate_cat).strip(),
                        })
    except Exception as e:
        print(f"  Error parsing PDF: {e}")
    return records, detected_round, detected_year


def map_course(raw):
    cleaned = re.sub(r'\s+', ' ', raw).strip()
    if cleaned in COURSE_MAP:
        return COURSE_MAP[cleaned]
    collapased = re.sub(r'\s+', '', cleaned).lower()
    for key, val in COURSE_MAP.items():
        if re.sub(r'\s+', '', key.lower()) == collapased:
            return val
    return cleaned


def is_valid_category(cat):
    if not cat or cat in ('-', '', 'None'):
        return False
    return cat in CATEGORY_MAP or cat in ('GN', 'GN-PH', 'OBC', 'OBC-PH', 'EWS', 'EWS-PH', 'SC', 'SC-PH', 'ST', 'ST-PH', 'Open', 'General', 'BC', 'EW', 'OP')


def aggregate_to_cutoffs(records, round_num, year):
    groups = defaultdict(list)
    for r in records:
        course = map_course(r['course_raw'])
        if course in ('B.Pharm', 'B.Pharma', '-', '', 'None'):
            continue
        category = CATEGORY_MAP.get(r['allotted_category'], r['allotted_category'])
        # Validate category; if allotted_category is invalid, try candidate_category
        if not is_valid_category(category):
            alt_cat = CATEGORY_MAP.get(r['candidate_category'], r['candidate_category'])
            if is_valid_category(alt_cat):
                category = alt_cat
            else:
                continue
        quota = map_quota(r['quota_raw'])
        if quota not in ALLOWED_QUOTAS:
            continue
        state = extract_state(r['institute'])
        college_type = determine_college_type(r['quota_raw'], r['institute'])
        key = (r['institute'], course, quota, category, round_num, year)
        groups[key].append({
            'rank': r['rank'],
            'state': state,
            'collegeType': college_type,
        })
    results = []
    for (institute, course, quota, category, rnd, yr), items in groups.items():
        ranks = sorted(it['rank'] for it in items)
        results.append({
            'institute': institute.strip().rstrip(','),
            'state': items[0]['state'],
            'course': course,
            'quota': quota,
            'category': category,
            'openingRank': ranks[0],
            'closingRank': ranks[-1],
            'round': rnd,
            'year': yr,
            'collegeType': items[0]['collegeType'],
            'fees': 0,
        })
    return results


def load_existing(filepath):
    if os.path.exists(filepath):
        with open(filepath) as f:
            return json.load(f)
    return []


def normalize_record(r):
    r = dict(r)
    r['category'] = CATEGORY_MAP.get(r.get('category', ''), r.get('category', ''))
    r['course'] = map_course(r.get('course', ''))
    r['quota'] = map_quota(r.get('quota', ''))
    return r


def merge_datasets(new_records, existing_records):
    """Merge new with existing.
    - Match by existing institute name appearing in new's full address
    - Matched: keep existing name+fees, update state/collegeType from new
    - Unmatched new: extract short name from full address, add
    - Add unmatched existing as-is
    """
    # Normalize existing records first
    existing_records = [normalize_record(r) for r in existing_records]
    existing_records = [r for r in existing_records if is_valid_category(r.get('category', '')) and r.get('quota', '') in ALLOWED_QUOTAS]

    existing_by_key = {}
    for r in existing_records:
        k = (r.get('institute', ''), r.get('course', ''), r.get('quota', ''),
             r.get('category', ''), r.get('round', 0), r.get('year', 0))
        existing_by_key[k] = r

    existing_names = sorted(set(r['institute'] for r in existing_records))

    seen = set()
    merged = []

    # Add all existing records first; dedup
    for r in existing_records:
        k = (r.get('institute', ''), r.get('course', ''), r.get('quota', ''),
             r.get('category', ''), r.get('round', 0), r.get('year', 0))
        if k not in seen:
            seen.add(k)
            merged.append(dict(r))

    # Process new records
    for r in new_records:
        full_addr = r.get('institute', '')
        short = extract_institute_short(full_addr)
        matched_name = match_existing_institute(full_addr, short, existing_names)
        r['institute'] = matched_name if matched_name else short

        k = (r.get('institute', ''), r.get('course', ''), r.get('quota', ''),
             r.get('category', ''), r.get('round', 0), r.get('year', 0))

        if k in seen:
            existing = existing_by_key.get(k)
            if existing:
                # Enrich existing with state/collegeType from new
                if not existing.get('state') and r.get('state'):
                    existing['state'] = r['state']
                if r.get('collegeType') and existing.get('collegeType') != r.get('collegeType'):
                    existing['collegeType'] = r['collegeType']
        else:
            seen.add(k)
            merged.append(r)

    merged.sort(key=lambda x: (x.get('year', 0), x.get('round', 0), x.get('institute', '')))
    return merged


def download_pdf(url, tmpdir):
    try:
        r = fetch(url)
        fname = re.sub(r'[^a-zA-Z0-9]', '_', url.split('/')[-1]) + '.pdf'
        path = os.path.join(tmpdir, fname)
        with open(path, 'wb') as f:
            f.write(r.content)
        return path
    except Exception as e:
        print(f"  Failed to download {url}: {e}")
        return None


def extract_pdf_links_vci(html, base_url=''):
    pdfs = []
    for href, text in re.findall(r'<a[^>]*href=[\"\']([^\"\']*\.pdf)[\"\'][^>]*>(.*?)</a>', html, re.DOTALL):
        text = re.sub(r'<[^>]+>', '', text).strip()
        if not text:
            continue
        lower = text.lower()
        if 'allotment result' not in lower and 'result' not in lower:
            continue
        if 'seat matrix' in lower or 'vacant seats' in lower:
            continue
        lower = text.lower()
        round_num = 0
        year = 2025
        if 'mop-up' in lower or 'mopup' in lower:
            round_num = 4
        elif 'stray' in lower:
            round_num = 5
        elif 'round 2' in lower or 'round ii' in lower:
            round_num = 2
        elif 'round 1' in lower or 'round i' in lower:
            round_num = 1
        m = re.search(r'20\d{2}', text)
        if m:
            year = int(m.group())
        full_url = href if href.startswith('http') else (base_url.rstrip('/') + '/' + href.lstrip('/'))
        if full_url:
            pdfs.append({'url': full_url, 'round': round_num if round_num else 5, 'year': year, 'label': text.strip()})
    return pdfs


def extract_pdf_links_aaccc(html, page_label=''):
    pdfs = []
    for href, text in re.findall(r'<a[^>]*href=[\"\']([^\"\']*\.pdf)[\"\'][^>]*>(.*?)</a>', html, re.DOTALL):
        text = re.sub(r'<[^>]+>', '', text).strip()
        if not text:
            continue
        lower = text.lower()
        if 'final result' not in lower and 'provisional result' not in lower:
            continue
        round_num = 0
        year = 2025
        if 'ssvr' in lower:
            round_num = 7
        elif any(p in lower for p in ['svr 2', 'svr ii', 'svr-2', 'svr-ii', 'stray round ii', 'round ii', 'round-ii']):
            round_num = 6
        elif any(p in lower for p in ['svr 1', 'svr i', 'svr-1', 'svr-i', 'stray vacancy round-1', 'stray round i', 'round i', 'round-i']):
            round_num = 5
        elif 'stray' in lower or 'svr' in lower:
            round_num = 5
        m = re.search(r'20\d{2}', text)
        if m:
            year = int(m.group())
        pdfs.append({'url': href, 'round': round_num, 'year': year, 'label': text.strip(), 'source': page_label})
    return pdfs


def process_vci(tmpdir):
    print("\n=== VCI (Veterinary) ===")
    all_records = []

    # Current year
    html = fetch(VCI_RESULTS_URL).text
    pdfs = extract_pdf_links_vci(html)
    print(f"Current page: {len(pdfs)} result PDFs")
    for info in pdfs:
        label = info['label']
        print(f"  Processing: {label[:70]} -> round={info['round']}, year={info['year']}")
        path = download_pdf(info['url'], tmpdir)
        if not path:
            continue
        records, rnd, yr = parse_pdf_simple(path, info['round'], info['year'])
        print(f"    Parsed {len(records)} allotments, round={rnd}, year={yr}")
        cutoffs = aggregate_to_cutoffs(records, rnd, yr)
        print(f"    Aggregated to {len(cutoffs)} cutoff records")
        all_records.extend(cutoffs)

    # Archive (older years)
    try:
        html = fetch(VCI_ARCHIVE_URL).text
        pdfs = extract_pdf_links_vci(html, VCI_ARCHIVE_URL)
        print(f"Archive page: {len(pdfs)} result PDFs")
        for info in pdfs:
            label = info['label']
            print(f"  Processing: {label[:70]} -> round={info['round']}, year={info['year']}")
            path = download_pdf(info['url'], tmpdir)
            if not path:
                continue
            records, rnd, yr = parse_pdf_simple(path, info['round'], info['year'])
            print(f"    Parsed {len(records)} allotments, round={rnd}, year={yr}")
            cutoffs = aggregate_to_cutoffs(records, rnd, yr)
            print(f"    Aggregated to {len(cutoffs)} cutoff records")
            all_records.extend(cutoffs)
    except Exception as e:
        print(f"  Archive failed: {e}")

    return all_records


def process_aaccc_page(url, tmpdir, label=''):
    html = fetch(url).text
    pdfs = extract_pdf_links_aaccc(html, label)
    print(f"  Found {len(pdfs)} result PDFs")
    all_records = []
    for info in pdfs:
        label_text = info['label']
        print(f"    Processing: {label_text[:70]} -> round={info['round']}, year={info['year']}")
        path = download_pdf(info['url'], tmpdir)
        if not path:
            continue
        records, rnd, yr = parse_pdf_simple(path, info['round'], info['year'])
        print(f"      Parsed {len(records)} allotments, round={rnd}, year={yr}")
        cutoffs = aggregate_to_cutoffs(records, rnd, yr)
        print(f"      Aggregated to {len(cutoffs)} cutoff records")
        all_records.extend(cutoffs)
    return all_records


def main():
    tmpdir = tempfile.mkdtemp(prefix='neet_scraper_')
    print(f"Working directory: {tmpdir}")

    all_ayush = []
    all_vet = []

    vet_records = process_vci(tmpdir)
    all_vet.extend(vet_records)

    print("\n=== AACCC (AYUSH) ===")
    ayush_records = process_aaccc_page(AACCC_URL, tmpdir, 'current')
    all_ayush.extend(ayush_records)

    ayush_archive = process_aaccc_page(AACCC_ARCHIVE_URL, tmpdir, 'archive')
    all_ayush.extend(ayush_archive)

    try:
        ayush_archive2 = process_aaccc_page(AACCC_ARCHIVE_URL + 'page/2/', tmpdir, 'archive_p2')
        all_ayush.extend(ayush_archive2)
    except Exception:
        pass

    for pg in range(3, 6):
        try:
            more = process_aaccc_page(f'{AACCC_ARCHIVE_URL}page/{pg}/', tmpdir, f'archive_p{pg}')
            all_ayush.extend(more)
        except Exception:
            pass

    print("\n=== Merging ===")

    ayush_existing = load_existing(os.path.join(DATA_DIR, 'ayush-cutoff-data.json'))
    print(f"Existing AYUSH records: {len(ayush_existing)}")
    print(f"New AYUSH records from PDFs: {len(all_ayush)}")
    ayush_merged = merge_datasets(all_ayush, ayush_existing)
    print(f"Merged AYUSH records: {len(ayush_merged)}")

    vet_existing = load_existing(os.path.join(DATA_DIR, 'vet-cutoff-data.json'))
    print(f"Existing VET records: {len(vet_existing)}")
    print(f"New VET records from PDFs: {len(all_vet)}")
    vet_merged = merge_datasets(all_vet, vet_existing)
    print(f"Merged VET records: {len(vet_merged)}")

    for name, records in [('AYUSH', ayush_merged), ('VET', vet_merged)]:
        years = set(r['year'] for r in records)
        rounds = set(r['round'] for r in records)
        courses = set(r['course'] for r in records)
        states = set(r['state'] for r in records if r['state'])
        empty_state = sum(1 for r in records if not r['state'])
        college_types = set(r['collegeType'] for r in records)
        print(f"\n{name} Summary:")
        print(f"  Records: {len(records)}")
        print(f"  Years: {sorted(years)}")
        print(f"  Rounds: {sorted(rounds)}")
        print(f"  Courses: {sorted(courses)}")
        print(f"  States: {len(states)} ({empty_state} empty)")
        print(f"  College types: {college_types}")

    # Sample records with state and without
    for name, records in [('AYUSH', ayush_merged), ('VET', vet_merged)]:
        with_state = [r for r in records if r.get('state')]
        without_state = [r for r in records if not r.get('state')]
        print(f"\n{name} - with state: {len(with_state)}, without: {len(without_state)}")
        if without_state:
            print(f"  Sample without state:")
            for r in without_state[:3]:
                print(f"    {r['institute'][:60]} course={r['course']} cat={r['category']}")
        if with_state:
            print(f"  Sample with state:")
            for r in with_state[:3]:
                print(f"    {r['institute'][:60]} -> {r['state']}")

    out_ayush = os.path.join(DATA_DIR, 'ayush-cutoff-data.json')
    out_vet = os.path.join(DATA_DIR, 'vet-cutoff-data.json')

    with open(out_ayush, 'w') as f:
        json.dump(ayush_merged, f, indent=2, ensure_ascii=False)
    with open(out_vet, 'w') as f:
        json.dump(vet_merged, f, indent=2, ensure_ascii=False)

    print(f"\nWritten AYUSH -> {out_ayush}")
    print(f"Written VET   -> {out_vet}")


if __name__ == '__main__':
    main()
