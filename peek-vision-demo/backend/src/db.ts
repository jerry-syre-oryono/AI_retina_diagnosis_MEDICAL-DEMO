import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join } from 'path'
import { fileURLToPath } from 'url'

// 👇 handle __dirname in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = join(__filename, '..')

// Path to JSON database file
const file = join(__dirname, 'db.json')

// Initialize lowdb
const adapter = new JSONFile<{ reports: any[] }>(file)
const db = new Low(adapter, { reports: [] })

// Function to read and initialize DB
export async function initDB() {
  await db.read()
  db.data ||= { reports: [] }
  await db.write()
  return db
}

export { db }
