import { Client, TextChannel } from 'discord.js';
import * as dotenv from 'dotenv';
import { fetchDailyAlbum } from './fetchDailyAlbum';

dotenv.config();

const CHANNEL_ID = process.env.CHANNEL_ID as string;
const GROUP_ID = process.env.GROUP_ID as string;

if (!CHANNEL_ID) throw new Error("Missing CHANNEL_ID in .env file.");
if (!GROUP_ID) throw new Error("Missing GROUP_ID in .env file.");

export async function sendDailyMessage(client: Client) {
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
        const { artist, name, releaseDate, spotifyId } = albumData;
        await channel.send(`**${today}**\n\n The album of the day is [${name}](https://open.spotify.com/album/${spotifyId}) by ${artist}, released in ${releaseDate}.\n`);
    }
}