import request from 'request'

module.exports.player = (app) => {

    /**
     * @swagger
     * /currentPlayback:
     *   get:
     *     tags:
     *       - Player
     *     name: Current Playback
     *     operationId: currentPlayback
     *     summary: reports the user's current playback
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

    app.get('/currentPlayback', (req, res) => {
        const access_token = req.session.access_token

        const options = {
            url: 'https://api.spotify.com/v1/me/player',
            headers: {'Authorization': 'Bearer ' + access_token},
            json: true
        };

        request.get(options, function (error, response, body) {
            res.end(JSON.stringify(body, undefined, 2))
        });
    })

    /**
     * @swagger
     * /recentlyPlayed:
     *   get:
     *     tags:
     *       - User
     *     name: Recently Played
     *     operationId: recentlyPlayed
     *     summary: reports the user's recently played songs
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

    app.get('/recentlyPlayed', (req, res) => {
        const access_token = req.session.access_token

        const options = {
            url: 'https://api.spotify.com/v1/me/player/recently-played',
            headers: {'Authorization': 'Bearer ' + access_token},
            json: true
        };

        request.get(options, function (error, response, body) {
            res.end(JSON.stringify(body, undefined, 2))
        });
    })

    /**
     * @swagger
     * /pause:
     *   post:
     *     tags:
     *       - Player
     *     name: Pause
     *     operationId: pause
     *     summary: pauses music
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

    app.post('/pause', (req, res) => {
        const access_token = req.session.access_token

        const options = {
            url: 'https://api.spotify.com/v1/me/player/pause',
            headers: {'Authorization': 'Bearer ' + access_token},
            json: true
        };

        request.put(options, () => {
            res.end('music paused!')
        });
    })

    /**
     * @swagger
     * /play:
     *   post:
     *     tags:
     *       - Player
     *     name: Play
     *     operationId: play
     *     summary: resumes the user's music
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

    app.post('/play', (req, res) => {
        const access_token = req.session.access_token

        const options = {
            url: 'https://api.spotify.com/v1/me/player/play',
            headers: {'Authorization': 'Bearer ' + access_token},
            json: true,
            body: {
                uris: ['spotify:track:7FEwp8BavoEVE3AnxJDchc']
            }

        };

        request.put(options, () => {
            res.end('music started!')
        });
    })

    /**
     * @swagger
     * /seek:
     *   post:
     *     tags:
     *       - Player
     *     name: Seek
     *     operationId: seek
     *     summary: seeks to the x second mark of user's current song
     *     parameters:
     *      - in: query
     *        name: position
     *        schema:
     *          type: int
     *        required: true
     *        description: position, in ms, to seek to
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

    app.post('/seek', (req, res) => {
        const access_token = req.session.access_token;
        const {position} = req.query;

        const options = {
            url: 'https://api.spotify.com/v1/me/player/seek',
            headers: {'Authorization': 'Bearer ' + access_token},
            json: true,
            qs: {
                position_ms: position
            }
        };

        request.put(options, () => {
            res.end(`seeked to ${position / 1000} seconds!`)
        });
    })

    /**
     * @swagger
     * /volume:
     *   post:
     *     tags:
     *       - Player
     *     name: Volume
     *     operationId: volume
     *     summary: changes the music's volume to 10%
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

    //todo this one doesnt work
    app.post('/volume', (req, res) => {
        const access_token = req.session.access_token

        const options = {
            url: 'https://api.spotify.com/v1/me/player/volume',
            headers: {'Authorization': 'Bearer ' + access_token},
            json: true,
            qs: {
                volume_percent: 10
            }
        };

        request.put(options, () => {
            res.end('volume changed to 10%!')
        });
    })

    /**
     * @swagger
     * /next:
     *   post:
     *     tags:
     *       - Player
     *     name: Next
     *     operationId: next
     *     summary: skips to the next song
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

    app.post('/next', (req, res) => {
        const access_token = req.session.access_token

        const options = {
            url: 'https://api.spotify.com/v1/me/player/next',
            headers: {'Authorization': 'Bearer ' + access_token},
            json: true,
        };

        request.post(options, () => {
            res.send('skipped to next song!')
        });
    })

    /**
     * @swagger
     * /previous:
     *   post:
     *     tags:
     *       - Player
     *     name: Previous
     *     operationId: previous
     *     summary: returns to the previous song
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

    app.post('/previous', (req, res) => {
        const access_token = req.session.access_token

        const options = {
            url: 'https://api.spotify.com/v1/me/player/previous',
            headers: {'Authorization': 'Bearer ' + access_token},
            json: true
        };

        request.post(options, () => {
            res.send('skipped to previous song!')
        });
    })

    /**
     * @swagger
     * /devices:
     *   get:
     *     tags:
     *       - Player
     *     name: Devices
     *     operationId: devices
     *     summary: reports a list of user's live devices
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

    app.get('/devices', (req, res) => {
        const access_token = req.session.access_token

        const options = {
            url: 'https://api.spotify.com/v1/me/player/devices',
            headers: {'Authorization': 'Bearer ' + access_token},
            json: true
        };

        request.get(options, function (error, response, body) {
            res.end(JSON.stringify(body, undefined, 2))
        });
    })



}