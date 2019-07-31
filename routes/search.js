import request from 'request'
import cache from '../cache'

module.exports.search = (app) => {

    /**
     * @swagger
     * /search:
     *   get:
     *     tags:
     *       - Player
     *     name: Search
     *     operationId: search
     *     summary: searches for a song by name and artist
     *     parameters:
     *      - in: query
     *        name: songName
     *        schema:
     *          type: string
     *        required: true
     *        description: name of song
     *      - in: query
     *        name: artistName
     *        schema:
     *          type: string
     *        description: name of song's artist
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     responses:
     *       '200':
     *         description: A single test object
     *       '401':
     *         description: No auth token / no user found in db with that name
     *       '403':
     *         description: JWT token and username from client don't match
     */

    app.get('/search', async  (req, res) => {
        // const spotifyToken = await cache.spotifyToken todo may need to switch back to this token
        const spotifyToken = req.query.accessToken
        const songName = req.query.songName
        // console.log('access token', spotifyToken)

        const options = {
            url: 'https://api.spotify.com/v1/search',
            headers: {'Authorization': 'Bearer ' + spotifyToken},
            qs: {
                q: `track:${songName}`,
                type: 'track',
            },
            json: true,
        };

        request.get(options, function (error, response, body) {
            // console.log(body)
            res.end(JSON.stringify(body, undefined, 2))
        });
    })


}