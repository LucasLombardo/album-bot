import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import * as cron from 'node-cron';
import * as dotenv from 'dotenv';
import { fetchDailyAlbum } from './fetchDailyAlbum';

dotenv.config();

const TOKEN = process.env.DISCORD_BOT_TOKEN as string;
const CHANNEL_ID = process.env.CHANNEL_ID as string;
const GROUP_ID = process.env.GROUP_ID as string;

if (!TOKEN) throw new Error("Missing DISCORD_BOT_TOKEN in .env file.");
if (!CHANNEL_ID) throw new Error("Missing CHANNEL_ID in .env file.");
if (!GROUP_ID) throw new Error("Missing GROUP_ID in .env file.");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    // Run daily at 5 AM
    cron.schedule('0 5 * * *', async () => {
        sendDailyMessage();
    });
});

client.on('messageCreate', async (message) => {
    if (message.content === '!test' && message.channelId === CHANNEL_ID) {
        sendDailyMessage();
    }
});

async function sendDailyMessage() {
    const channel = client.channels.cache.get(CHANNEL_ID) as TextChannel | undefined;

    if (!channel) {
        console.error('Channel not found! Check if the bot has access.');
        return;
    }

    const albumData = await fetchDailyAlbum(GROUP_ID);
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if ('error' in albumData) {
        await channel.send('Error fetching album data');
        return;
    } else {
        const { artist, name, releaseDate, globalReviewsUrl, spotifyId } = albumData;
        await channel.send(`**${today}**\n\n The album of the day is [${name}](https://open.spotify.com/album/${spotifyId}) by ${artist}, released in ${releaseDate}.\n`);
    }
}

client.login(TOKEN);
