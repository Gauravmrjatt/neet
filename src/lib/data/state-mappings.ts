/**
 * Manual state mappings for AYUSH and VET colleges
 * Source data had empty state fields; these are determined from
 * college names, known locations, and research.
 *
 * Format: { collegeName: stateName }
 */
export const AYUSH_STATE_MAP: Record<string, string> = {
  // CONFIDENT MAPPINGS (identified by location in name or known data)

  // Delhi
  'All India Institute of Ayurveda': 'Delhi',
  'Ayurvedic and Unani Tibbia College-Ayurveda': 'Delhi',
  'Govt. Tibbia College': 'Delhi',

  // Maharashtra
  'Ashtang Ayurved Mahavidyalaya Pune': 'Maharashtra',
  'Ayurvidya Prasarak Mandals Ayurved Mahavidyalaya': 'Maharashtra',
  'Dr. D. Y. Patil College of Ayurved and Research Centre.': 'Maharashtra',
  'Padamshri Dr. DY Patil College of Ayurved and Research Institute': 'Maharashtra',
  'Pravara Rural Ayurveda College': 'Maharashtra',
  'Radhakisan Toshniwal Ayurved Mahavidyalaya': 'Maharashtra',
  'RJVS Bhaisaheb Sawant Ayurved Mahavidyalaya': 'Maharashtra',
  'Tilak Ayurved Mahavidyalaya': 'Maharashtra',
  'Vidarbha Ayurved Mahavidyalaya': 'Maharashtra',
  'Bharati Vidyapeeth Deemed University i.e. B.V.D.U.': 'Maharashtra',
  'Anjuman-I-Islams Dr. Ishaq Jam Khanawala Tibbia Unani Medical College and Haji Abdul Razak Kalsekar Tibbia Hospital': 'Maharashtra',

  // Gujarat
  'Institute of Teaching and Research in Ayurveda': 'Gujarat',
  'Dayabhai Maoji Majithiya Ayurved Mahavidyalaya': 'Gujarat',
  'Sumandeep Ayurvedic Medical college and Hospital Sumandeep Vidyapeeth An institute Deemed to be university': 'Gujarat',
  'Govt. Seth JP Ayurveda Medical College': 'Gujarat',
  'KATS Ayurved Medical College': 'Gujarat',

  // Karnataka
  'JSVV Samsthe\'s Danappa Gurushiddappa Melmalagi': 'Karnataka',
  'KLE University Shri.BM Kankanawadi Ayurveda Mahavidyalaya Post Graduate Studies and Research Centre': 'Karnataka',
  'Yenepoya Ayurveda Medical College': 'Karnataka',
  'Dr Abdul Haq Unani Medical College': 'Karnataka',
  'Zuleikhabai Valy Md. Unani Medical College and Hospital.': 'Karnataka',
  'Sri Jayendra Saraswati Ayurved College': 'Karnataka',

  // Goa
  'BHARTEEYA SANSKRIT PRABODHINI GOMANTAK AYURVEDA MAHAVIDYALAY AND RESEARCH CENTRE': 'Goa',

  // Madhya Pradesh
  'Pt. Khushilal Sharma (M.P.) India': 'Madhya Pradesh',
  'Pt. Shivnath Shastri Govt. Auto. Ayurved College and Hospital': 'Madhya Pradesh',
  'Hakim Syed Ziaul Hassan Govt. Unani Medical College and Hospital': 'Madhya Pradesh',
  'Mahatma Gandhi Ayurved College mgayurvedcollege[at]gmail[dot]com': 'Madhya Pradesh',

  // Rajasthan
  'National Institute of Ayurveda': 'Rajasthan',
  'Taranath Govt. Ayurved College': 'Rajasthan',
  'Rajkiya Ayodhya Shivkumar Ayurved College and Hospital': 'Uttar Pradesh',

  // Himachal Pradesh
  'Rajiv Gandhi Government Postgraduate Ayurvedic College': 'Himachal Pradesh',

  // Telangana
  'Government Nizamia Tibbia College': 'Telangana',
  'Sri Venkateswara Ayurvedic college': 'Andhra Pradesh',

  // Tamil Nadu
  'National Institute of Siddha': 'Tamil Nadu',
  'Govt. Siddha Medical College': 'Tamil Nadu',

  // Kerala
  'Amrita School of Ayurveda': 'Kerala',

  // Meghalaya
  'NORTH EASTERN INSTITUTE OF AYURVEDA AND HOMEOPATHY- HomoeopathySHILONG': 'Meghalaya',
  'North Eastern Institute of Ayurveda and Folk Medicine Research': 'Meghalaya',

  // West Bengal
  'Government Akhandananda Ayurveda Medical College': 'West Bengal',

  // Uttar Pradesh
  'Shri Lal Bahadur Shastri Smarak Government Ayurvedic College and Hospital': 'Uttar Pradesh',
  'State Unani Medical College and Hakim Ahmed Husain Republic Day Memorial Hospital': 'Uttar Pradesh',

  // Andhra Pradesh
  'Anantha Laxmi Govt. Ayurved College': 'Andhra Pradesh',

  // Additional mappings
  'Faculty of Ayurveda': 'Uttar Pradesh',
  'Shri Maru Singh Memorial Institute of Ayurved (Female Seat only )': 'Rajasthan',
  'State Takmil-ut-Tib College and Hospital': 'Uttar Pradesh',
  'University College of Unani': 'Rajasthan',
  'Baba Khetanath Govt. Ayurvedic College and Hospita': 'Bihar',
  'Government Dhanwantri Ayurveda College': 'Madhya Pradesh',
  'Government Unani Medical college & hospital': 'Karnataka',
  'Government Ayurveda College and Hospital': 'Odisha',
  'Government Ayurved College': 'Chhattisgarh',
  'Government Ayurved Medical College': 'Jammu and Kashmir',
  'Government Ayurved College and Hospital': 'Madhya Pradesh',
  'Government Ayurveda Medical College and Hospital': 'Maharashtra',
  'Govt. Ayurveda College': 'Rajasthan',
  'Government Ayurvedic Medical college': 'Bihar',
  'Rajiv Gandhi Ayurveda Medical College and Hospital': 'Karnataka',
  'Ayurved Mahavidyalaya and Hospital': 'Maharashtra',
}

export const VET_STATE_MAP: Record<string, string> = {
  'Madras Veterinary College Vepery': 'Tamil Nadu',
  'Veterinary College and Research Institute Namakkal- 637002': 'Tamil Nadu',
  'Veterinary College and Research Institute Namakkal-637002': 'Tamil Nadu',
  'Veterinary College and Research Institute Ramayanpatti': 'Tamil Nadu',
  'Veterinary College and Research Institute': 'Tamil Nadu',
  'Bombay Veterinary College Parel Mumbai (Bombay Veterinary College': 'Maharashtra',
  'Bombay Veterinary College Parel Mumbai  (Bombay Veterinary College': 'Maharashtra',
  'Nagpur veterinary College': 'Maharashtra',
  'Bihar Veterinary College': 'Bihar',
  'College of Veterinary Science & Animal Husbandry Sardarkrushinagar': 'Gujarat',
  'Apollo College of Veterinary Medicine (Rajasthan)': 'Rajasthan',
  'Arawali Veterinary College': 'Rajasthan',
  'Mahatma Jyotiba Full College of Veterinary & Animal Sciences. Chomu': 'Rajasthan',
  'Ranchi College of Veterinary Science and Animal Husbandry': 'Jharkhand',
  'Veterinary College Gadag': 'Karnataka',
  'Faculty of Veterinary and Animal Sciences Mohanpur Nadia-741252 West Bengal West Bengal': 'West Bengal',
  'Faculty of Veterinary and Animal Sciences Mohanpur Nadia- 741252 West Bengal  West Bengal': 'West Bengal',
  'Indian Veterinary Research Institute': 'Uttar Pradesh',
  'KNP College of Veterinary Science': 'Uttar Pradesh',
  'Faculty of Veterinary and Animal Science RGSC': 'Uttar Pradesh',
  'Rajiv Gandhi Institute of Veterinary Education and Research': 'Puducherry',
  'International Institute of Veterinary Education and Research': 'Haryana',
  'Khalsa College of Veterinary Animal Science': 'Punjab',
  'Post Graduate Institute of Veterinary Education and Research': 'Rajasthan',
  'Dr. G.C. Negi Collage of veterinary & Aminal sciences': 'Uttarakhand',
  'College of Veterinary Sciences & A.H': 'Punjab',
  'Faculty of Veterinary Veterinary College': 'Telangana',
  'Faculty of Veterinary Science': 'Telangana',
  'NTR College of Veterinary Science': 'Andhra Pradesh',
}
