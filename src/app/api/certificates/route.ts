// app/api/certificates/route.ts
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const certificates = await sql`
      SELECT 
        ci.id,
        ci.name,
        ci.provider,
        ci.year,
        ci.logo_url,
        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', cu.id,
              'certificate_id', cu.certificate_id,
              'url', cu.certificate_url
            )
          ) FILTER (WHERE cu.id IS NOT NULL),
          '[]'::jsonb
        ) as certificate_urls
      FROM certificate_items ci
      LEFT JOIN certificate_urls cu ON ci.id = cu.certificate_id
      GROUP BY ci.id, ci.name, ci.provider, ci.year, ci.logo_url
      ORDER BY ci.year DESC
    `;

    return NextResponse.json(certificates);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { error: 'Failed to fetch certificate data', details: errorMessage },
      { status: 500 }
    );
  }
}
