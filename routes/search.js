import request from 'request'

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
	app.get('/search', async (req, res) => {
		const { accessToken } = req.query
		const { songName } = req.query
        // console.log('access token', spotifyToken)

		const options = {
			url: 'https://api.spotify.com/v1/search',
			headers: { Authorization: `Bearer ${accessToken}` },
			qs: {
				q: `track:${songName}`,
				type: 'track',
			},
			json: true,
		};

		request.get(options, (error, response, body) => {
			res.end(JSON.stringify(body, undefined, 2))
		});
	})

}
