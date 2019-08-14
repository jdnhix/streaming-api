import request from 'request'

const client_id = '85ec7eb9dc0543fc9408c8ba05fd2bdb';
const client_secret = 'c9192d5af4bb450da0770bf5b23f4e49';

async function getNewToken(refreshToken) {

	const authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: { Authorization: `Basic ${new Buffer(`${client_id}:${client_secret}`).toString('base64')}` },
		form: {
			grant_type: 'refresh_token',
			refresh_token: refreshToken
		},
		json: true
	};

	return new Promise((resolve) => {
		request.post(authOptions, (error, response, body) => {
			if (!error && response.statusCode === 200) {
				const { access_token } = body

			// console.log(access_token)
				resolve(access_token)
			}
		});
	})
}

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
		const { refreshToken } = req.query
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

		request.get(options, async (error, response, body) => {
			if (body && body.error && body.error.message === 'Invalid access token') {
				console.log('error with access token, attempting to refresh token')
				const newAccessToken = await getNewToken(refreshToken)
				console.log(`New access token: ${newAccessToken}`)

				const newOptions = {
					url: 'https://api.spotify.com/v1/search',
					headers: { Authorization: `Bearer ${newAccessToken}` },
					qs: {
						q: `track:${songName}`,
						type: 'track',
					},
					json: true,
				};

				request.get(newOptions, async (error, response, body) => {
					res.end(JSON.stringify(body, undefined, 2))
				})

				// todo need to find a way to update the access token, sockets maybe?


			} else {
				res.end(JSON.stringify(body, undefined, 2))
			}

		});
	})

}
