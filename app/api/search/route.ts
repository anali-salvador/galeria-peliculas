import { NextResponse } from 'next/server'
import { searchMoviesPaged } from '@/lib/omdb'

// Ruta intermedia: el navegador llama aquí y el servidor consulta OMDb con la key privada
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q) return NextResponse.json({ results: [], totalResults: 0 })

  const pageParam = Number.parseInt(searchParams.get('page') ?? '1', 10)
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam

  // Solo se aceptan "movie" o "series"; cualquier otro valor se ignora
  const typeParam = searchParams.get('type')
  const type = typeParam === 'movie' || typeParam === 'series' ? typeParam : undefined

  try {
    const results = await searchMoviesPaged(q, page, type)
    return NextResponse.json(results)
  } catch {
    return NextResponse.json({ error: 'No se pudo consultar OMDb' }, { status: 500 })
  }
}
