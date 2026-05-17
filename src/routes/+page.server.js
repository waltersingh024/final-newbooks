// src/routes/+page.server.js
import { neon } from '@neondatabase/serverless';

// Connecting using your new clean project credentials directly
const sql = neon("postgresql://neondb_owner:npg_6UorJjeMhqi3@ep-wild-bread-aq20vhfn-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require");

export async function load() {
  // Pulls your database rows and explicitly converts the date format 
  // so JavaScript doesn't distort dates across timezones.
  const rows = await sql`
    SELECT id, date::text AS date, description, debit, credit, amount 
    FROM transactions 
    ORDER BY date ASC
  `;

  // This returns the records cleanly to your +page.svelte file
  return { 
    transactions: rows 
  };
}