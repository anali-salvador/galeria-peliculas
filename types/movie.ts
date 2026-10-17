export interface MovieSummary {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export interface SearchResponse {
  results: MovieSummary[]
  totalResults: number
}

export interface MovieDetail {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  imdbRating: string
  imdbVotes: string
  Type: string
}
