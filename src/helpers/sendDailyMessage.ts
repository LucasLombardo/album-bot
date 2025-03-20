import { Client, TextChannel } from 'discord.js'
import { CHANNEL_ID, GROUP_ID } from '../config'
import { fetchDailyAlbum } from './fetchDailyAlbum'
import { formatDailyMessage } from './formatDailyMessage'

export async function sendDailyMessage(client: Client) {
  const channel = client.channels.cache.get(CHANNEL_ID) as
    | TextChannel
    | undefined

  if (!channel) {
    console.error('Channel not found! Check if the bot has access.')
    return
  }

  const album = await fetchDailyAlbum(GROUP_ID)

  if ('error' in album) {
    await channel.send('Error fetching album data')
    return
  } else {
    const message = await channel.send(formatDailyMessage(album))
    await message.startThread({
      name: `${album.number}: ${album.name} - ${album.artist}`,
      autoArchiveDuration: 10080,
    })
  }
}
