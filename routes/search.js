import request from 'request'
import cache from '../cache'
import axios from "axios";

module.exports.search = (app) => {

    app.get('/search',async  (req, res) => {
        const spotifyToken = await cache.spotifyToken
        const access_token = req.session.access_token
        const songName = 'moi'
        const artistName = "lolo zouai"

        console.log(spotifyToken)

        const options = {
            url: 'https://api.spotify.com/v1/search',
            headers: {'Authorization': 'Bearer ' + spotifyToken},
            qs: {
                q: `track:${songName} artist:${artistName}`,
                type: 'track',
            },
            json: true,
        };

        request.get(options, function (error, response, body) {
            console.log(body)
            res.end(JSON.stringify(body, undefined, 2))
        });
    })


}