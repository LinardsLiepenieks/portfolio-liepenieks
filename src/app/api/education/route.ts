import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const education = await sql`
      SELECT 
        ei.id,
        ei.name,
        ei.name_short,
        ei.degree,
        ei.specialty,
        ei.start_year,
        ei.end_year,
        ei.description_short,
        ei.logo_url,
        ei.attachment_name,
        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', eu.id,
              'education_id', eu.education_id,
              'url', eu.education_url
            )
          ) FILTER (WHERE eu.id IS NOT NULL),
          '[]'::jsonb
        ) as education_urls
      FROM education_items ei
      LEFT JOIN education_urls eu ON ei.id = eu.education_id
      GROUP BY ei.id, ei.name, ei.name_short, ei.degree, ei.specialty, ei.start_year, ei.end_year, ei.description_short, ei.logo_url
      ORDER BY ei.start_year DESC
    `;

    return NextResponse.json(education);
  } catch (error: unknown) {
    // Enhanced debug output
    console.error('Failed to fetch education data:', error);
    console.error('DATABASE_URL:', process.env.DATABASE_URL);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Optionally include relevant environment/config info (not secrets) for debugging
    return NextResponse.json(
      {
        error: 'Failed to fetch education data',
        details: errorMessage,
        stack: errorStack,
        dbURL: process.env.DATABASE_URL, // REMOVE or mask in production!
      },
      { status: 500 }
    );
  }
}
