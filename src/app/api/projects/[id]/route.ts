// app/api/projects/[id]/route.ts
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params object before accessing properties
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
  }

  try {
    // Get the project details with multiple categories aggregated
    const projectResult = await sql`
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
      WHERE pi.id = ${id}
      GROUP BY pi.id, pi.name, pi.year, pi.description, pi.background_url, 
               pi.logo_url, pi.github_url, pi.source_url
    `;

    if (projectResult.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = projectResult[0];

    // Get technology data from the join table with technology info
    const technologies = await sql`
      SELECT 
        pti.id,
        pti.project_id,
        pti.technology_id,
        t.technology_name,
        t.technology_url
      FROM project_technology_images pti
      JOIN technology_images t ON pti.technology_id = t.id
      WHERE pti.project_id = ${id}
    `;

    // Add technologies to project
    const projectWithTechnologies = {
      ...project,
      technologies: technologies,
    };

    return NextResponse.json(projectWithTechnologies);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch project details',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
