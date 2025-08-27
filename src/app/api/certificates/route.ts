// app/api/certificates/route.ts
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const certificates = await sql`
      SELECT * FROM certificate_items 
      ORDER BY year DESC
    `;
    return NextResponse.json(certificates);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificate data' },
      { status: 500 }
    );
  }
}
