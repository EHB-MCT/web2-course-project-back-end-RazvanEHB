//NOTE: This file is for testing Spotify's API response only. It is not part of the main application.

const { getPlaylistTracks } = require('./config/spotify');

getPlaylistTracks('5eJ5SgP0MQg5EizWn1Hptw') // Winter playlist ID
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(err => console.error('Error:', err));