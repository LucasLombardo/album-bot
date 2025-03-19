import axios from 'axios'
import type { AlbumData, ErrorResponse } from '../types'

async function fetchDailyAlbum(
  groupId: string
): Promise<AlbumData | ErrorResponse> {
  try {
    const response = await axios.get(
      `https://1001albumsgenerator.com/api/v1/groups/${groupId}`
    )
    const albumData: AlbumData = response.data.currentAlbum
    return albumData
  } catch (error) {
    console.error('Error fetching album data:', error)
    return { error: 'Error fetching album data' }
  }
}

export { fetchDailyAlbum }
