const temp = require('mongodb')
const ObjectId = temp.ObjectId


module.exports.room = (app, db) => {

    /**
     * @swagger
     * /room:
     *   get:
     *     tags:
     *       - Room
     *     name: Find test
     *     operationId: room
     *     summary: Retrieves list of all rooms or specific room by ID
     *     parameters:
     *      - in: query
     *        name: roomId
     *        schema:
     *          type: object
     *          properties:
     *              roomId:
     *                  type: string
     *        description: numeric ID of room
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
	app.get('/room', (req, res) => {
		const roomId = req.query.roomId || ''

		if (roomId) {
			db.development.collection('rooms').find(
				{ _id: ObjectId(roomId) }
			).toArray((err, docs) => {
				if (err) {
					console.log(err)
				} else {
					res.json(docs)
				}
			})
		} else {
			db.development.collection('rooms').find({}).toArray((err, docs) => {
				if (err) {
					console.log(err)
					res.error(err)
				} else {
					res.json(docs)
				}
			})
		}
	})

    /**
     * @swagger
     * /addRoom:
     *   post:
     *     tags:
     *       - Room
     *     name: Add Room
     *     operationId: addRoom
     *     summary: Adds a new room with an empty queue to the database
     *     parameters:
     *      - in: query
     *        name: roomName
     *        schema:
     *          type: string
     *        required: true
     *        description: name of room
     *      - in: query
     *        name: roomType
     *        schema:
     *          type: string
     *          enum: ['public', 'private']
     *        required: true
     *        description: type of room (public/private)
     *      - in: query
     *        name: hostName
     *        schema:
     *          type: string
     *        required: true
     *        description: name of room host
     *      - in: body
     *        name: settings
     *        schema:
     *          type: object
     *          required:
     *              -explicitAllowed
     *          properties:
     *              explicitAllowed:
     *                  type: boolean
     *              password:
     *                  type: string
     *              minVoteToPlay:
     *                  type: integer
     *              downVoteLimit:
     *                  type: integer
     *        description: settings
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
    // todo should i rename this to room and somehow combine it with the deleteRoom route?
	app.post('/addRoom', (req, res) => {
		db.development.collection('rooms').updateOne(
			{
				roomName: req.query.roomName,
				roomType: req.query.roomType,
				hostName: req.query.hostName,
			},
			{
				$set:
                    {
                    	audienceSize: 0,
                    	settings: req.body,
                    	queue: [],
                    	currentSong: {}
                    }
			},
			{
				upsert: true
			}, (err, result) => {
				if (err) {
					console.log(err)
					res.error(err)
				} else {
					res.json(result)
				}
			}
		)
	})

    /**
     * @swagger
     * /removeRoom:
     *   post:
     *     tags:
     *       - Room
     *     name: Remove Room
     *     operationId: removeRoom
     *     summary: Removes a room
     *     parameters:
     *      - in: query
     *        name: roomId
     *        schema:
     *          type: string
     *        required: true
     *        description: id of room
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
	app.post('/removeRoom', (req, res) => {
		db.development.collection('rooms').deleteOne({ _id: ObjectId(req.query.roomId) },
			(err, result) => {
				if (err) {
					console.log(err)
					res.error(err)
				} else {
					res.json(result)
				}
			})
	})

    /**
     * @swagger
     * /sortQueue:
     *   post:
     *     tags:
     *       - Room
     *     name: Sort Queue
     *     operationId: sortQueue
     *     summary: Sorts queue by song rank
     *     parameters:
     *      - in: query
     *        name: roomId
     *        schema:
     *          type: string
     *        required: true
     *        description: numeric ID of room
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
    // todo move this to a socket event
	app.post('/sortQueue', (req, res) => {
		const { params } = req.body

		db.development.collection('rooms').update(
			{ _id: ObjectId(params.roomId) },
			{ $push: { queue: { $each: [], $sort: { rank: -1 } } } }, (err, result) => {
				if (err) {
					console.log(err)
					res.error(err)
				} else {
					res.json(result)
				}
			}
		)
	})

}
