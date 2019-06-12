



module.exports.room = (app) => {

    /**
     * @swagger
     * /getAllRooms:
     *   get:
     *     tags:
     *       - Test
     *     name: Find test
     *     operationId: getAllRooms
     *     summary: Retrieves list of all rooms
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

    app.get('/getAllRooms', (req, res) => {
        res.send('test')
    })


    /**
     * @swagger
     * /getRoomByID:
     *   get:
     *     tags:
     *       - Test
     *     name: Find test
     *     operationId: getRoomByID
     *     summary: Retrieves list of all rooms
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: string
     *        required: true
     *        description: numeric ID of room to get
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
    app.get('/getRoomByID', (req, res) => {
        res.send('test')
    })

}