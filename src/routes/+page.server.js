// src/routes/+page.server.js
import { neon } from '@neondatabase/serverless';

// Connecting using your clean project credentials directly
const sql = neon("postgresql://neondb_owner:npg_6UorJjeMhqi3@ep-wild-bread-aq20vhfn-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require");

export async function load() {
  // Pulls your database rows and explicitly converts the date format 
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

export const actions = {
  // 'default' runs when a form on the page is submitted with no action= attribute.
  default: async ({ request }) => {
    // 1. Get the form data the browser sent.
    const formData = await request.formData();
    const date        = formData.get('date');
    const description = formData.get('description');
    const debit       = formData.get('debit');
    const credit      = formData.get('credit');
    const amount      = formData.get('amount');

    // 2. Safely inserts your form values into the database columns using parameters
    await sql`
      INSERT INTO transactions (date, description, debit, credit, amount)
      VALUES (${date}, ${description}, ${debit}, ${credit}, ${amount})
    `;

    // 3. Return success. SvelteKit will re-run load() automatically,
    //    so the page picks up the new row.
    return { success: true };
  }
};