import { Client, GatewayIntentBits } from 'discord.js'
import * as cron from 'node-cron'
import * as dotenv from 'dotenv'
import { sendDailyMessage } from './helpers/sendDailyMessage'

dotenv.config()

const TOKEN = process.env.DISCORD_BOT_TOKEN as string
const CHANNEL_ID = process.env.CHANNEL_ID as string
const GROUP_ID = process.env.GROUP_ID as string

if (!TOKEN) throw new Error('Missing DISCORD_BOT_TOKEN in .env file.')
if (!CHANNEL_ID) throw new Error('Missing CHANNEL_ID in .env file.')
if (!GROUP_ID) throw new Error('Missing GROUP_ID in .env file.')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)

  // Run daily at 5 AM
  cron.schedule(
    '0 5 * * *',
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

client.login(TOKEN)
