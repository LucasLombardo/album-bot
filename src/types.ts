export type AlbumData = {
  uuid: string
  artist: string
  artistOrigin: string
  images: { [key: string]: string }[]
  genres: string[]
  subGenres: string[]
  name: string
  slug: string
  releaseDate: string
  globalReviewsUrl: string
  wikipediaUrl: string
  spotifyId: string
  appleMusicId: string
  tidalId: number
  amazonMusicId: string
  youtubeMusicId: string
  qobuzId: string
  deezerId: string
}

export type ErrorResponse = {
  error: string
}
