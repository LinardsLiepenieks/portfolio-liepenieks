// app/api/projects/[id]/technologies/route.ts
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Update type to Promise
) {
  // Await the params object before accessing its properties
  const { id } = await params;

  try {
    // Fetch technologies for the project
    const technologies = await sql`
      SELECT 
        t.id, 
        t.technology_name, 
        t.technology_url
      FROM technologies t
      JOIN project_technology_images pti ON t.id = pti.technology_id
      WHERE pti.project_id = ${id}
      GROUP BY t.id, t.technology_name, t.technology_url
      ORDER BY t.technology_name
    `;

    // Fetch technology images
    const images = await sql`
      SELECT 
        pti.id,
        pti.technology_id,
        pti.technology_image
      FROM project_technology_images pti
      WHERE pti.project_id = ${id} AND pti.technology_image IS NOT NULL
    `;

    // Group images by technology_id
    const techImagesMap = images.reduce((map, img) => {
      const techId = img.technology_id;
      if (!map[techId]) {
        map[techId] = [];
      }
      map[techId].push(img);
      return map;
    }, {});

    // Add images to each technology
    const technologiesWithImages = technologies.map((tech) => ({
      ...tech,
      images: techImagesMap[tech.id] || [],
    }));

    return NextResponse.json(technologiesWithImages);
  } catch (error) {
    console.error('Failed to fetch project technologies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project technologies' },
      { status: 500 }
    );
  }
}
