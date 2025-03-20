import { Client, TextChannel } from 'discord.js'
import { CHANNEL_ID, GROUP_ID } from '../config'
import { fetchDailyAlbum } from './fetchDailyAlbum'
import { formatDailyMessage } from './formatDailyMessage'
import { getAdditionalAlbumInfo } from './getAdditionalAlbumInfo'

/**
 * Sends the daily album message to a specified Discord channel and starts a thread.
 * @param client - The Discord client instance.
 */
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
    const additionalInfo = await getAdditionalAlbumInfo(album)
    const message = await channel.send(
      formatDailyMessage(album, additionalInfo)
    )
    const thread = await message.startThread({
      name: `${album.number}: ${album.name} - ${album.artist}`,
      autoArchiveDuration: 10080,
    })

    await thread.send(additionalInfo.blurb)
    await thread.send(
      `**Post any comments here in the thread, for questions use !q**`
    )
  }
}
