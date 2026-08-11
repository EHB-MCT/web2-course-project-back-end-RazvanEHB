require('dotenv').config();

let accessToken = null;
let tokenExpirationTime = 0;

async function getAccessToken() {
    if (accessToken && Date.now() < tokenExpirationTime) {
        return accessToken;
    }
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    
}

module.exports = getAccessToken;