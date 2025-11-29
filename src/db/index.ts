import { config } from 'dotenv'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from './schema.ts'

config()

const pool = new Pool({
  connectionString: getDatabaseUrl(),
})

export const db = drizzle(pool, { schema })

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  const {
    POSTGRES_USER = 'agro',
    POSTGRES_PASSWORD = 'agro',
    POSTGRES_DB = 'agrogame',
    POSTGRES_HOST = 'localhost',
    POSTGRES_PORT = '5432',
  } = process.env

  if (!POSTGRES_USER || !POSTGRES_DB) {
    throw new Error('Missing DATABASE_URL or POSTGRES_* env vars for database connection')
  }

  return `postgres://${encodeURIComponent(POSTGRES_USER)}:${encodeURIComponent(POSTGRES_PASSWORD)}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`
}
