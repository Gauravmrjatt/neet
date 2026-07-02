/**
 * Comprehensive phone number migration script.
 * Searches ALL collections in MongoDB for the old number +91 9261858208
 * and replaces it with +91 9509698208.
 *
 * Usage: pnpm tsx scripts/update-phone-number.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const OLD_PATTERNS = [
  '+91 9261858208',
  '+91-9261858208',
  '9261858208',
  '+919261858208',
]
const NEW_NUMBER = '+91 9509698208'

function replacePhoneNumber(value: unknown): string | null {
  if (typeof value !== 'string') return null
  let newVal = value as string
  let changed = false
  for (const old of OLD_PATTERNS) {
    if (newVal.includes(old)) {
      newVal = newVal.replaceAll(old, NEW_NUMBER)
      changed = true
    }
  }
  return changed ? newVal : null
}

// Recursively walk an object and replace phone numbers in all string fields
function walkAndReplace(
  obj: Record<string, unknown>,
  updates: Record<string, unknown>,
  prefix: string,
): boolean {
  let changed = false
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key
    if (value === null || value === undefined) continue
    if (typeof value === 'string') {
      const result = replacePhoneNumber(value)
      if (result !== null) {
        updates[fullPath] = result
        changed = true
      }
    } else if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const item = value[i]
        if (typeof item === 'string') {
          const result = replacePhoneNumber(item)
          if (result !== null) {
            updates[`${fullPath}.${i}`] = result
            changed = true
          }
        } else if (item !== null && typeof item === 'object') {
          const nestedChanged = walkAndReplace(
            item as Record<string, unknown>,
            updates,
            `${fullPath}.${i}`,
          )
          if (nestedChanged) changed = true
        }
      }
    } else if (typeof value === 'object') {
      const nestedChanged = walkAndReplace(
        value as Record<string, unknown>,
        updates,
        fullPath,
      )
      if (nestedChanged) changed = true
    }
  }
  return changed
}

function getDb(payload: any): any {
  // Payload 3.x stores the MongoDB connection on the internal `db` instance
  // @payloadcms/db-mongodb uses mongoose under the hood
  return payload.db?.connection?.db
}

async function main() {
  const payload = await getPayload({ config })
  const db = getDb(payload)
  if (!db) {
    console.error('❌ Could not get database connection')
    process.exit(1)
  }
  console.log('📦 Connected to database')

  const collections = await db.listCollections().toArray()
  let totalUpdated = 0

  for (const { name } of collections) {
    if (name.startsWith('system.') || name === 'migrations' || name.startsWith('_')) continue

    const collection = db.collection(name)
    const docs = await collection.find({}).toArray()
    let colUpdated = 0

    for (const doc of docs) {
      const updates: Record<string, unknown> = {}
      const hasChanges = walkAndReplace(doc as Record<string, unknown>, updates, '')

      if (hasChanges) {
        await collection.updateOne({ _id: doc._id }, { $set: updates })
        colUpdated++
        totalUpdated++
        console.log(`  ✏️  ${name} id=${doc._id}: ${Object.keys(updates).join(', ')}`)
      }
    }

    if (colUpdated > 0) {
      console.log(`✅ ${name}: ${colUpdated} doc(s) updated`)
    } else {
      console.log(`  ${name}: clean`)
    }
  }

  console.log(`\n=== Summary: ${totalUpdated} total documents updated ===`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
