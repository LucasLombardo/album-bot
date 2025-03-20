import { Client, GatewayIntentBits } from 'discord.js'
import * as cron from 'node-cron'

import { CHANNEL_ID, DISCORD_BOT_TOKEN } from './config'
import { sendDailyMessage } from './helpers/sendDailyMessage'
import { trackThreads } from './helpers/trackThreads'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)

  trackThreads(client)

  // Run daily at 7 AM
  cron.schedule(
    '0 7 * * *',
    async () => {
      sendDailyMessage(client)
    },
    {
      timezone: 'America/New_York',
    }
  )
})

client.on('messageCreate', async (message) => {
  if (message.content === '!test' && message.channelId === CHANNEL_ID) {
    sendDailyMessage(client)
  }
})

client.login(DISCORD_BOT_TOKEN)
