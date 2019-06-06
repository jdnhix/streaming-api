
import cache from '../cache'
import axios from 'axios'

module.exports.searchTrack = async(app) => {
    const spotifyToken = await cache.spotifyToken
    const songName = 'shiptrip'
    const artistName = 'kyle'
    const albumName = ''

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
            console.log(results.data.tracks.items[0])
            return results.data.tracks.items[0]
        }).catch((err) => console.log(err.response))
    }

    app.get('/searchTrack', (req, res) => {
        res.send(findTrack())
    })


}