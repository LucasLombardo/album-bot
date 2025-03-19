import axios from 'axios';

type AlbumData = {
    uuid: string;
    artist: string;
    artistOrigin: string;
    images: { [key: string]: any }[];
    genres: string[];
    subGenres: string[];
    name: string;
    slug: string;
    releaseDate: string;
    globalReviewsUrl: string;
    wikipediaUrl: string;
    spotifyId: string;
    appleMusicId: string;
    tidalId: number;
    amazonMusicId: string;
    youtubeMusicId: string;
    qobuzId: string;
    deezerId: string;
};

type ErrorResponse = {
    error: string;
};

async function fetchDailyAlbum(groupId: string): Promise<AlbumData | ErrorResponse> {
    try {
        const response = await axios.get(`https://1001albumsgenerator.com/api/v1/groups/${groupId}`);
        const albumData: AlbumData = response.data.currentAlbum;
        return albumData;
    } catch (error) {
        return { error: 'Error fetching album data' };
    }
}

export { fetchDailyAlbum };