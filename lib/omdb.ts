import 'server-only'
import axios from 'axios'
import type { MovieSummary, MovieDetail, SearchResponse } from '@/types/movie'

const BASE_URL = 'https://www.omdbapi.com/'

function getApiKey(): string {
  const key = process.env.OMDB_API_KEY
  if (!key) throw new Error('Falta OMDB_API_KEY en .env.local')
  return key
}

// Busca películas o series por texto. Devuelve lista vacía si no hay resultados.
export async function searchMovies(query: string, page = 1): Promise<MovieSummary[]> {
  const response = await axios.get(BASE_URL, {
    params: { apikey: getApiKey(), s: query, page },
  })
  if (response.data.Response === 'False') return []
  return response.data.Search as MovieSummary[]
}

// Búsqueda paginada con filtro opcional de tipo. Incluye el total para saber si hay más páginas.
export async function searchMoviesPaged(
  query: string,
  page = 1,
  type?: 'movie' | 'series'
): Promise<SearchResponse> {
  const response = await axios.get(BASE_URL, {
    params: { apikey: getApiKey(), s: query, page, type },
  })
  if (response.data.Response === 'False') return { results: [], totalResults: 0 }
  return {
    results: response.data.Search as MovieSummary[],
    totalResults: Number(response.data.totalResults) || 0,
  }
}

// Obtiene el detalle completo de una película o serie por su imdbID.
export async function getMovieById(id: string): Promise<MovieDetail | null> {
  const response = await axios.get(BASE_URL, {
    params: { apikey: getApiKey(), i: id, plot: 'full' },
  })
  if (response.data.Response === 'False') return null
  return response.data as MovieDetail
}
