import * as dotenv from 'dotenv'

dotenv.config()

const { DISCORD_BOT_TOKEN, CHANNEL_ID, GROUP_ID, OPENAI_API_KEY } =
  process.env as {
    DISCORD_BOT_TOKEN: string
    CHANNEL_ID: string
    GROUP_ID: string
    OPENAI_API_KEY: string
  }

if (!DISCORD_BOT_TOKEN) throw new Error('Missing TOKEN in .env file.')
if (!CHANNEL_ID) throw new Error('Missing CHANNEL_ID in .env file.')
if (!GROUP_ID) throw new Error('Missing GROUP_ID in .env file.')
if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY in .env file.')

export { DISCORD_BOT_TOKEN, CHANNEL_ID, GROUP_ID, OPENAI_API_KEY }
