import request from 'request'

module.exports.user = (app) => {

    /**
     * @swagger
     * /userProfile:
     *   get:
     *     tags:
     *       - User
     *     name: User Profile
     *     operationId: userProfile
     *     summary: Retrieves user info
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

    app.get('/userProfile', (req, res) => {
        const access_token = req.session.access_token

        const options = {
            url: 'https://api.spotify.com/v1/me',
            headers: {'Authorization': 'Bearer ' + access_token},
            json: true
        };

        request.get(options, function (error, response, body) {
            res.end(JSON.stringify(body, undefined, 2))
        });
    })


    /**
     * @swagger
     * /top:
     *   get:
     *     tags:
     *       - User
     *     name: Top
     *     operationId: top
     *     summary: Retrieves user's top songs or tracks
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

    //todo check to see if scope works
    app.get('/top', (req, res) => {
        const access_token = req.session.access_token
        const type = 'tracks' //tracks or artists

        const options = {
            type: 'tracks',
            url: 'https://api.spotify.com/v1/me/top/tracks',
            headers: {'Authorization': 'Bearer ' + access_token},
            time_range: 'short_term',
            offset: 1,
            limit: 5,
            json: true
        };

        request.get(options, function (error, response, body) {
            console.log(body)
            res.end(JSON.stringify(body, undefined, 2))
        });
    })


}