
// import cache from '../cache'
// // import axios from 'axios'

const cache = require('../cache')
const axios = require('axios')

module.exports.searchTrack = async(app) => {
    const spotifyToken = await cache.spotifyToken
    const songName = 'moi'
    const artistName = "lolo zouai" //todo im still confused on how to encode spaces...sometimes %20 works

    function findTrack() {
        return axios.get('https://api.spotify.com/v1/search', {
            headers: {
                'Authorization': 'Bearer ' + spotifyToken
            },
            params: {
                q: `track:${songName} artist:${artistName}`,
                type: 'track'
            }
        }).then((results) => {
            return results.data.tracks.items
        }).catch((err) => console.log(err.response))
    }

    app.get('/searchTrack', async (req, res) => {
        const temp = await findTrack();
        console.log(temp);
        res.end(JSON.stringify(temp, null, 2));
    })

    //JSON.stringify(findTrack())

}
