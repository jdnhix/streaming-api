import querystring from 'querystring'
import request from 'request'
import ip from 'ip'

// todo find a way to hide this, maybe circle ci?
const client_id = '85ec7eb9dc0543fc9408c8ba05fd2bdb';
const client_secret = 'c9192d5af4bb450da0770bf5b23f4e49';
let redirect_uri = ''

if (ip.address() === '172.31.83.49') {
	redirect_uri = 'http://symphonyroom.com/setup'
} else {
	redirect_uri = 'http://192.168.50.91:8081/setup' // change this to the current local ip
}

module.exports.getUserAccess = (app) => {

	/**
     * @swagger
     * /login:
     *   get:
     *     tags:
     *       - User
     *     name: Find test
     *     operationId: login
     *     summary: Logs a user in
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
	app.get('/login', (req, res) => {
		res.redirect(`https://accounts.spotify.com/authorize?${
			querystring.stringify({
				response_type: 'code',
				client_id,
				redirect_uri,
				scope: 'user-follow-read '
                    + 'user-read-playback-state '
                    + 'user-read-recently-played '
                    + 'streaming '
                    + 'user-read-email '
                    + 'user-read-birthdate '
                    + 'user-read-private '
                    + 'user-modify-playback-state ',
				// 'user-top-read ',
				show_dialog: 'false'
				// state: state todo add this for extra securtiy
			})}`)
	})

	/**
     * @swagger
     * /user:
     *   get:
     *     tags:
     *       - User
     *     name: User
     *     operationId: login
     *     summary: Logs a user in pt. 2
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
	app.post('/user', (req, res) => {

		const { code } = req.body

		const authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code,
				redirect_uri,
				grant_type: 'authorization_code'
			},
			headers: {
				Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`
			},
			json: true
		};

		request.post(authOptions, (error, response, body) => {
			if (error) {
				res.statusCode = 400

				return
			}

			if (body) {
				res.send(body)
			} else {
				res.send('Login Failed')
			}
		})

	});

	/**
     * @swagger
     * /auth:
     *   get:
     *     tags:
     *       - User
     *     name: Find test
     *     operationId: auth
     *     summary: authenticates spotify user
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
	app.get('/auth', (req, res) => {
		const authObject = {
			url: `https://accounts.spotify.com/authorize?${
				querystring.stringify({
					response_type: 'code',
					client_id,
					redirect_uri,
					scope: 'user-follow-read '
                        + 'user-read-playback-state '
                        + 'user-read-recently-played '
                        + 'streaming '
                        + 'user-read-email '
                        + 'user-read-birthdate '
                        + 'user-read-private '
                        + 'user-modify-playback-state ',
					// 'user-top-read ',
					show_dialog: 'true'
					// state: state todo add this for extra securtiy
				})}`
		}
		res.send(authObject)
	})

	/**
     * @swagger
     * /refresh_token:
     *   get:
     *     tags:
     *       - User
     *     name: Refresh Token
     *     operationId: refresh_token
     *     summary: refreshes user access token
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
	app.post('/refresh_token', (req, res) => {
		// requesting access token from refresh token
		const refresh_token = req.body.refreshToken;
		const authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			headers: { Authorization: `Basic ${new Buffer(`${client_id}:${client_secret}`).toString('base64')}` },
			form: {
				grant_type: 'refresh_token',
				refresh_token
			},
			json: true
		};

		request.post(authOptions, (error, response, body) => {
			if (!error && response.statusCode === 200) {
				const { access_token } = body
				res.send({
					access_token
				});
			}
		});
	});
}
