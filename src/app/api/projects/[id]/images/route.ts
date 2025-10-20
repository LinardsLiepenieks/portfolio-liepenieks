import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const images = await sql`
      SELECT
        pi.id,
        pi.project_id,
        pi.image_url,
        pi.caption
      FROM project_images pi
      WHERE pi.project_id = ${id}
      ORDER BY pi.id DESC
    `;

    return NextResponse.json(images);
  } catch (error) {
    console.error('Failed to fetch project images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project images' },
      { status: 500 }
    );
  }
}
