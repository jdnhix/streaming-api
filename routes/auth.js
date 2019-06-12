import querystring from 'querystring'
import request from 'request'

const client_id = '85ec7eb9dc0543fc9408c8ba05fd2bdb';
const client_secret = 'c9192d5af4bb450da0770bf5b23f4e49';
const redirect_uri = 'http://localhost:3000/user'


module.exports.getUserAccess = (app) => {

    /**
     * @swagger
     * /login:
     *   get:
     *     tags:
     *       - Test
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
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: client_id,
                redirect_uri,
                scope: 'user-follow-read ' +
                    'user-read-playback-state ' +
                    'user-read-recently-played ' +
                    'user-modify-playback-state ' ,
                    // 'user-top-read ',
                show_dialog: 'false'
                // state: state todo add this for extra securtiy
            }))
    })

    app.get('/user', (req, res) => {
        const code = req.query.code;

        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
           let access_token = body.access_token
            if (access_token) req.session.access_token = access_token
            res.send('Logged in!')
        })


    });

    /**
     * @swagger
     * /refresh_token:
     *   get:
     *     tags:
     *       - Test
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

    app.get('/refresh_token', function (req, res) {

        // requesting access token from refresh token
        var refresh_token = req.query.refresh_token;
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))},
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token;
                res.send({
                    'access_token': access_token
                });
            }
        });
    });


}


