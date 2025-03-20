import OpenAI from 'openai'
import { OPENAI_API_KEY } from '../config'

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

/**
 * Sends conversation history to OpenAI and returns a response.
 * @param conversationHistory - The history of messages in the thread.
 * @returns The AI-generated response.
 */
export async function getChatResponse(
  conversationHistory: { role: 'user' | 'assistant'; content: string }[],
  threadName: string
): Promise<string> {
  try {
    const systemMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
      role: 'system',
      content: `You are a helpful assistant in a Discord thread discussing a daily album from the 1001 albums to listen to before you die. 
            Your goal is to answer questions and provide interesting insights about the album. 
            Keep your responses relevant to music, albums, and artist discussions. 
            Avoid off-topic discussions.
            Limit responses to 1800 characters or less.
            Be concise and informative. If a question can be answered in a few words, do so. 
            The relevent album info is ${threadName}.`,
    }
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      systemMessage,
      ...conversationHistory,
    ]
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // Use 'gpt-3.5-turbo' if preferred
      messages,
    })
    return (
      response.choices[0]?.message?.content ||
      'I had trouble processing your request.'
    )
  } catch (error) {
    console.error('Error with OpenAI API:', error)
    return 'Oops! I had trouble processing that.'
  }
}
