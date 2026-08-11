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

    const body = new URLSearchParams({ grant_type: 'client_credentials' });

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

module.exports = getAccessToken;