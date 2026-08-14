require('dotenv').config();

let accessToken = null;
let tokenExpirationTime = 0;

async function getAccessToken() {
    if (accessToken && Date.now() < tokenExpirationTime) {
        return accessToken;
    }
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    
    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // const body = new URLSearchParams({ grant_type: 'client_credentials' });
    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${encoded}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    });

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpirationTime = Date.now() + data.expires_in * 1000;

    return accessToken;
}

async function getPlaylistTracks(playlistId) {
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/items`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const playlistData = await response.json();

    const simplifiedAPIResponse = playlistData.items.map(item => {
        const track = item.item;
        const artistNames = track.artists.map(artist => artist.name).join(', ');

        return {
            id: track.id,
            name: track.name,
            artists: artistNames,
            albumArt: track.album.images[0]?.url,
            url: track.external_urls.spotify,
        };
    });

    return simplifiedAPIResponse;
}

module.exports = { getAccessToken, getPlaylistTracks };