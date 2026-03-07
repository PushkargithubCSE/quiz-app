import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS participants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      state TEXT NOT NULL DEFAULT '',
      district TEXT NOT NULL DEFAULT '',
      block TEXT DEFAULT '',
      gp TEXT DEFAULT '',
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      answers JSONB NOT NULL,
      completed_at TIMESTAMPTZ NOT NULL,
      time_taken INTEGER NOT NULL
    )
  `;

  await sql`ALTER TABLE participants ADD COLUMN IF NOT EXISTS state TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE participants ADD COLUMN IF NOT EXISTS district TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE participants ADD COLUMN IF NOT EXISTS block TEXT DEFAULT ''`;
  await sql`ALTER TABLE participants ADD COLUMN IF NOT EXISTS gp TEXT DEFAULT ''`;
}