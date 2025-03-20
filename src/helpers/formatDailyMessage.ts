import { AlbumData } from '../types'
import { EmbedBuilder } from 'discord.js'

/**
 * Formats the daily message for an album, preparing it in discord markdown format.
 * @param {AlbumData} albumData - The data of the album to format the message for.
 * @returns {object} An object containing the formatted content and embeds for the message.
 */
export function formatDailyMessage(albumData: AlbumData) {
  const {
    artist,
    name,
    releaseDate,
    spotifyId,
    images,
    globalReviewsUrl,
    wikipediaUrl,
    genres,
    subGenres,
    artistOrigin,
    number,
  } = albumData
  const url = images[1].url
  const imageEmbed = new EmbedBuilder().setImage(url)

  const tracklist = `Original Tracklist:\n1. Track 1\n2. Track 2\n3. Track 3\n4. Track 4\n5. Track 5\n6. Track 6\n7. Track 7`
  const quickInfo = `Artist Origin: ${artistOrigin.toUpperCase()}\nYear: ${releaseDate}\nGenres: ${genres.join(', ')}\nSubgenres: ${subGenres.join(', ')}\n`
  const quickInfoBlock = '```' + quickInfo + tracklist + '```'
  const links = `**[Spotify](https://open.spotify.com/album/${spotifyId})   |   [Wiki](${wikipediaUrl})   |   [Global Reviews](${globalReviewsUrl})**`
  const title = `### Album ${number}/1088 - __${name}__ by __${artist}__`

  return {
    content: `${title}\n${links}\n${quickInfoBlock}`,
    embeds: [imageEmbed],
  }
}
