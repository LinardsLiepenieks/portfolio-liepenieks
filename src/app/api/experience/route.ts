// app/api/experience/route.ts - THIS uses the env variables
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!); // Uses your env variable

export async function GET() {
  try {
    const experiences = await sql`
      SELECT * FROM experience_items 
      ORDER BY start_year DESC
    `;
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}
