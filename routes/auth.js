import querystring from 'querystring'
import request from 'request'
import ip from 'ip'

const client_id = '85ec7eb9dc0543fc9408c8ba05fd2bdb';
const client_secret = 'c9192d5af4bb450da0770bf5b23f4e49';
let redirect_uri = ''

if(ip.address() === '172.31.35.143'){
    redirect_uri = 'http://jdh-symphony-bucket.s3-website-us-east-1.amazonaws.com/setup'
} else {
    redirect_uri = 'http://192.168.50.86:8081/setup'
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

        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: client_id,
                redirect_uri,
                scope: 'user-follow-read ' +
                    'user-read-playback-state ' +
                    'user-read-recently-played ' +
                    'streaming ' +
                    'user-read-email ' +
                    'user-read-birthdate ' +
                    'user-read-private ' +
                    'user-modify-playback-state ' ,
                // 'user-top-read ',
                show_dialog: 'true'
                // state: state todo add this for extra securtiy
            }))

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
    //todo replace this with the other /user when done
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
            if(error) {
                res.statusCode = 400
                return
            }
            if (access_token) {
                req.session.access_token = access_token
                res.send('Logged in!')
            } else {
                res.send('Login Failed')
            }
        })

    });


    app.post('/user2', (req, res) => {
        // console.log(req.body.code)
        const code = req.body.code

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
            if(error) {
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
            url: 'https://accounts.spotify.com/authorize?' +
                querystring.stringify({
                    response_type: 'code',
                    client_id: client_id,
                    redirect_uri,
                    scope: 'user-follow-read ' +
                        'user-read-playback-state ' +
                        'user-read-recently-played ' +
                        'streaming ' +
                        'user-read-email ' +
                        'user-read-birthdate ' +
                        'user-read-private ' +
                        'user-modify-playback-state ' ,
                    // 'user-top-read ',
                    show_dialog: 'true'
                    // state: state todo add this for extra securtiy
                })
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

    app.post('/refresh_token', function (req, res) {

        // requesting access token from refresh token
        var refresh_token = req.body.refreshToken;
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


