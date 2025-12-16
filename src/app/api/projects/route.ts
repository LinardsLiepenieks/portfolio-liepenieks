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
        pi.category,
        pc.category_name
      FROM public.project_items pi
      LEFT JOIN public.project_categories pc ON pi.category = pc.id
      ORDER BY pi.id DESC
    `;

    return NextResponse.json(projects);
  } catch (error: unknown) {
    // Enhanced debug output
    console.error('Failed to fetch projects data:', error);
    console.error('DATABASE_URL:', process.env.DATABASE_URL);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Optionally include relevant environment/config info (not secrets) for debugging
    return NextResponse.json(
      {
        error: 'Failed to fetch projects data',
        details: errorMessage,
        stack: errorStack,
        dbURL: process.env.DATABASE_URL, // REMOVE or mask in production!
      },
      { status: 500 }
    );
  }
}
