// lib/db.ts
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

export const sql = neon(process.env.DATABASE_URL)

let initialized = false
export async function ensureSchema() {
  if (initialized) return
  await sql/* sql */`
    CREATE TABLE IF NOT EXISTS users (
      id             text PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text),
      email          text UNIQUE NOT NULL,
      name           text NOT NULL,
      password_hash  text NOT NULL,
      email_verified timestamptz,
      created_at     timestamptz DEFAULT now(),
      updated_at     timestamptz DEFAULT now()
    )
  `
  initialized = true
}

export async function getUserByEmail(email: string) {
  const lower = email.toLowerCase().trim()
  const rows = await sql/* sql */`
    SELECT id, email, name, password_hash
    FROM users
    WHERE email = ${lower}
    LIMIT 1
  `
  return rows[0] ?? null
}

export async function insertUser(email: string, name: string, hash: string) {
  const lower = email.toLowerCase().trim()
  const rows = await sql/* sql */`
    INSERT INTO users (email, name, password_hash)
    VALUES (${lower}, ${name}, ${hash})
    RETURNING id, email, name, password_hash
  `
  return rows[0]
}
