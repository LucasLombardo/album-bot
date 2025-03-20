import OpenAI from 'openai'
import { AlbumData } from '../types'
import { OPENAI_API_KEY } from '../config'

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

const defaultAdditionalInfo = {
  tracklist: [],
  blurb: '',
}

export async function getAdditionalAlbumInfo(album: AlbumData) {
  try {
    const systemMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
      role: 'system',
      content: `Get the original tracklist for ${album.name} by ${album.artist}, also write a short paragraph with any interesting or notable info about the album, fun facts, etc.
                respond in JSON with the syntax:
                {
                "tracklist": ["track1","track2"],
                "blurb": "some info"
                }
            `,
    }
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      systemMessage,
    ]
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    })

    const additionalInfo = JSON.parse(
      response.choices[0]?.message?.content || ''
    )
    if (!additionalInfo.tracklist || !additionalInfo.blurb) {
      console.log(additionalInfo)
      return defaultAdditionalInfo
    }
    return additionalInfo
  } catch (error) {
    console.error('Error with OpenAI API:', error)
    return defaultAdditionalInfo
  }
}
