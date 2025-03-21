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
  number: number
}

export type ErrorResponse = {
  error: string
}

export type AdditionalAlbumInfo = {
  tracklist: string[]
  blurb: string
}