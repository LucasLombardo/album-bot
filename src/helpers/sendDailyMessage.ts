import { Client, TextChannel, EmbedBuilder } from 'discord.js'
import * as dotenv from 'dotenv'
import { fetchDailyAlbum } from './fetchDailyAlbum'

dotenv.config()

const CHANNEL_ID = process.env.CHANNEL_ID as string
const GROUP_ID = process.env.GROUP_ID as string

if (!CHANNEL_ID) throw new Error('Missing CHANNEL_ID in .env file.')
if (!GROUP_ID) throw new Error('Missing GROUP_ID in .env file.')

export async function sendDailyMessage(client: Client) {
  const channel = client.channels.cache.get(CHANNEL_ID) as
    | TextChannel
    | undefined

  if (!channel) {
    console.error('Channel not found! Check if the bot has access.')
    return
  }

  const albumData = await fetchDailyAlbum(GROUP_ID)

  if ('error' in albumData) {
    await channel.send('Error fetching album data')
    return
  } else {
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
    const title = `## Album ${number}/1088 - __${name}__ by __${artist}__`

    channel.send({
      content: `${title}\n${links}\n${quickInfoBlock}`,
      embeds: [imageEmbed],
    })
  }
}
