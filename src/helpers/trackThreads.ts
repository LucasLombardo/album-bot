import { Client, Message, ThreadChannel } from 'discord.js'
import { getChatResponse } from './getChatResponse'

export async function trackThreads(client: Client) {
  // Store conversation history per thread
  const conversationHistories = new Map<
    string,
    { role: 'user' | 'assistant'; content: string }[]
  >()

  // Fetch all active threads in the server
  const guilds = client.guilds.cache
  guilds.forEach(async (guild) => {
    const activeThreads = await guild.channels.fetchActiveThreads()
    activeThreads.threads.forEach((thread) => {
      if (!thread.archived && thread.ownerId === client.user?.id) {
        trackThread(thread)
      }
    })
  })

  console.log(`Listening to all active threads.`)

  // Function to track messages in a thread
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
      if (msg.channel.id !== thread.id || msg.author.bot) return // Ignore non-thread messages & bot messages

      console.log(`Received message in thread ${thread.name}: ${msg.content}`)

      // Get conversation history
      const history = conversationHistories.get(thread.id) || []

      // Add user's message to history
      history.push({ role: 'user', content: msg.content })

      // Get ChatGPT response
      const chatResponse = await getChatResponse(history, thread.name)

      // Add ChatGPT's response to history
      history.push({ role: 'assistant', content: chatResponse })

      // Update conversation history
      conversationHistories.set(thread.id, history)

      // Send response
      await msg.reply(chatResponse)
    })
  }

  // Listen for newly created threads
  client.on('threadCreate', (thread) => {
    console.log(`New thread detected: ${thread.name}`)
    trackThread(thread)
  })
}
