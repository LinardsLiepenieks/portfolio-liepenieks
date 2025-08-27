// app/api/education/route.ts
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const education = await sql`
      SELECT * FROM education_items 
      ORDER BY start_year DESC
    `;
    return NextResponse.json(education);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch education data' },
      { status: 500 }
    );
  }
}
