import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const projects = await sql`
      SELECT 
        pi.id,
        pi.name,
        pi.year,
        pi.description,
        pi.background_url,
        pi.logo_url,
        pi.github_url,
        pi.source_url,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pc.id,
              'name', pc.category_name
            ) ORDER BY pc.category_name
          ) FILTER (WHERE pc.id IS NOT NULL),
          '[]'
        ) as categories
      FROM public.project_items pi
      LEFT JOIN public.project_category_mapping pcm ON pi.id = pcm.project_id
      LEFT JOIN public.project_categories pc ON pcm.category_id = pc.id
      GROUP BY pi.id, pi.name, pi.year, pi.description, pi.background_url, 
               pi.logo_url, pi.github_url, pi.source_url
      ORDER BY pi.year DESC, pi.id DESC
    `;

    return NextResponse.json(projects);
  } catch (error: unknown) {
    // Enhanced debug output
    console.error('Failed to fetch projects data:', error);
    console.error('DATABASE_URL exists:', !!process.env.DATABASE_URL);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;

    // In development, include more details; in production, be more cautious
    const isDevelopment = process.env.NODE_ENV === 'development';

    return NextResponse.json(
      {
        error: 'Failed to fetch projects data',
        details: isDevelopment ? errorMessage : 'Internal server error',
        stack: isDevelopment ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}
