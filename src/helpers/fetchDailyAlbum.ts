import axios from 'axios'
import type { AlbumData, ErrorResponse } from '../types'

/**
 * Fetches the daily album from the 1001 Albums Generator API.
 * @param groupId - The ID of the group to fetch the daily album for.
 * @returns The album data or an error response.
 */
async function fetchDailyAlbum(
  groupId: string
): Promise<AlbumData | ErrorResponse> {
  try {
    const response = await axios.get(
      `https://1001albumsgenerator.com/api/v1/groups/${groupId}`
    )
    const albumData: AlbumData = response.data.currentAlbum
    return { ...albumData, number: response.data.numberOfGeneratedAlbums }
  } catch (error) {
    console.error('Error fetching album data:', error)
    return { error: 'Error fetching album data' }
  }
}

export { fetchDailyAlbum }
