import { Client, Message, ThreadChannel } from 'discord.js'
import { getChatResponse } from './getChatResponse'

/**
 * Tracks and manages conversations in active Discord threads.
 * @param client - The Discord client instance.
 */
export async function trackThreads(client: Client) {
  // Store conversation history per thread in memory, this will get wiped on restarts
  const conversationHistories = new Map<
    string,
    { role: 'user' | 'assistant'; content: string }[]
  >()

  // Fetch all active threads in the server and tracks them
  const guilds = client.guilds.cache
  guilds.forEach(async (guild) => {
    const activeThreads = await guild.channels.fetchActiveThreads()
    activeThreads.threads.forEach((thread) => {
      if (!thread.archived && thread.ownerId === client.user?.id) {
        trackThread(thread)
      }
    })
  })

  // Listen for newly created threads to track
  client.on('threadCreate', (thread) => {
    console.log(`New thread detected: ${thread.name}`)
    trackThread(thread)
  })

  console.log(`Listening to all active threads.`)

  async function trackThread(thread: ThreadChannel) {
    console.log(`Tracking thread: ${thread.name}`)
    // Initialize conversation history if it doesn't exist
    if (!conversationHistories.has(thread.id)) {
      conversationHistories.set(thread.id, [
        {
          role: 'assistant',
          content: "Hello! I'm here to discuss this topic with you.",
        },
      ])
    }

    // Listen for new messages in the thread
    client.on('messageCreate', async (msg: Message) => {
      // Only respond to non bot messages in the tracked thread that start with !m
      if (
        msg.channel.id !== thread.id ||
        msg.author.bot ||
        (!msg.content.startsWith('!m') && !msg.content.startsWith('!M'))
      )
        return
      console.log(`Received message in thread ${thread.name}: ${msg.content}`)

      const history = conversationHistories.get(thread.id) || []
      history.push({ role: 'user', content: msg.content })

      const chatResponse = await getChatResponse(history, thread.name)
      history.push({ role: 'assistant', content: chatResponse })
      conversationHistories.set(thread.id, history)

      await msg.reply(chatResponse)
    })
  }
}
