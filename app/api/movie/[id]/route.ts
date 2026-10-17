import { NextResponse } from 'next/server'
import { getMovieById } from '@/lib/omdb'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const movie = await getMovieById(id)
    if (!movie) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
    return NextResponse.json(movie)
  } catch {
    return NextResponse.json({ error: 'No se pudo consultar OMDb' }, { status: 500 })
  }
}
