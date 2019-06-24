import axios from 'axios'



module.exports.room = (app, db) => {

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
        db.development.collection('rooms').find({}).toArray((err, docs) => {
            if (err) {
                console.log(err)
                res.error(err)
            } else {
                res.json(docs)
            }
        })
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




    /**
     * @swagger
     * /addRoom:
     *   post:
     *     tags:
     *       - Test
     *     name: Add Room
     *     operationId: addRoom
     *     summary: Adds a new room to the database
     *     parameters:
     *      - in: body
     *        schema:
     *          type: object
     *          required:
     *              -roomName
     *          properties:
     *              roomName:
     *                  type: string
     *        required: true
     *        description: name of room
     *     consumes:
     *       - application/json
     *     responses:
     *       '200':
     *         description: A single test object
     *       '401':
     *         description: No auth token / no user found in db with that name
     *       '403':
     *         description: JWT token and username from client don't match
     */

    app.post('/addRoom', (req, res) => {
        const roomName = req.body.roomName;
        console.log(roomName)

        // db.development.collection('rooms').insertOne({
        //     roomName: "Test Room 3"
        // }, (err, result) => {
        //     console.log(result)
        //     if (err) {
        //         console.log(err)
        //         res.error(err)
        //     } else {
        //         res.json(result)
        //     }
        // })
    })



    app.get('/')
}