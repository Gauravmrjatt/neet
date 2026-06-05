import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

const INPUT = resolve(
  import.meta.dirname, '..', '..', 'Scrapper', 'neet-pipeline', 'data', 'raw', 'allotment_data.csv',
)
const OUTPUT = resolve(import.meta.dirname, '..', 'src', 'data', 'neet-allotment-data.json')

function parseCSVLine(line) {
  const result = []; let current = ''; let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { inQuotes = !inQuotes }
    else if (ch === ',' && !inQuotes) { result.push(current.trim()); current = '' }
    else { current += ch }
  }
  result.push(current.trim())
  return result
}

function main() {
  console.log(`Reading: ${INPUT}`)
  const raw = readFileSync(INPUT, 'utf-8')
  const lines = raw.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())

  const records = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length !== headers.length) continue
    const record = {}
    for (let j = 0; j < headers.length; j++) record[headers[j]] = values[j]
    record.rank = parseInt(record.rank, 10)
    record.phase = parseInt(record.phase, 10)
    records.push(record)
  }

  console.log(`Parsed ${records.length} records`)
  mkdirSync(dirname(OUTPUT), { recursive: true })
  writeFileSync(OUTPUT, JSON.stringify(records), 'utf-8')
  console.log(`Written: ${OUTPUT} (${(Buffer.byteLength(JSON.stringify(records), 'utf-8') / 1024).toFixed(1)} KB)`)
}

main()
