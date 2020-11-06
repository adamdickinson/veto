import fetch from 'node-fetch'

import { THE_MOVIE_DB_API_KEY } from '../config'

export const getMovieImage = async (name: string) => {
  let movieData
  try {
    movieData = await fetch(
      `https://api.themoviedb.org/3/search/movie?` +
        `api_key=${THE_MOVIE_DB_API_KEY}&` +
        `query=${encodeURIComponent(name)}`
    ).then((response) => response.json())
  } catch (error) {
    console.error(error)
    return null
  }

  const imagePath = movieData.results?.[0]?.poster_path
  if (!imagePath) return null

  return `http://image.tmdb.org/t/p/w220_and_h330_face${imagePath}`
}
