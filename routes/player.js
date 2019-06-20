import request from 'request'

module.exports.player = (app) => {

    /**
     * @swagger
     * /currentPlayback:
     *   get:
     *     tags:
     *       - Test
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
     *       - Test
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
     *   get:
     *     tags:
     *       - Test
     *     name: Pauses
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

    app.get('/pause', (req, res) => {
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
     *   get:
     *     tags:
     *       - Test
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

    app.get('/play', (req, res) => {
        const access_token = req.session.access_token

        const options = {
            url: 'https://api.spotify.com/v1/me/player/play',
            headers: {'Authorization': 'Bearer ' + access_token},
            json: true
        };

        request.put(options, () => {
            res.end('music started!')
        });
    })

    /**
     * @swagger
     * /seek:
     *   get:
     *     tags:
     *       - Test
     *     name: Seek
     *     operationId: seek
     *     summary: seeks to the 5 second mark of user's current song
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

    app.get('/seek', (req, res) => {
        const access_token = req.session.access_token

        const options = {
            url: 'https://api.spotify.com/v1/me/player/seek',
            headers: {'Authorization': 'Bearer ' + access_token},
            json: true,
            qs: {
                position_ms: 5000
            }
        };

        request.put(options, () => {
            res.end('seeked to 5 seconds!')
        });
    })

    /**
     * @swagger
     * /volume:
     *   get:
     *     tags:
     *       - Test
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
    app.get('/volume', (req, res) => {
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
     *   get:
     *     tags:
     *       - Test
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

    app.get('/next', (req, res) => {
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
     *   get:
     *     tags:
     *       - Test
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

    app.get('/previous', (req, res) => {
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
     *       - Test
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