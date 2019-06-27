import axios from 'axios'
import {ObjectId} from "mongodb";


module.exports.room = (app, db) => {

    /**
     * @swagger
     * /getAllRooms:
     *   get:
     *     tags:
     *       - Room
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
     *       - Room
     *     name: Find test
     *     operationId: getRoomByID
     *     summary: Retrieves list of all rooms
     *     parameters:
     *      - in: body
     *        name: body
     *        schema:
     *          type: object
     *          required:
     *              - roomId
     *          properties:
     *              roomId:
     *                  type: string
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

    app.get('/getRoomByID', (req, res) => {
        const roomId = req.query.id

        db.development.collection('rooms').find(
            {_id: ObjectId(roomId)}
        ).toArray((err, docs) => {
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
     * /addRoom:
     *   post:
     *     tags:
     *       - Room
     *     name: Add Room
     *     operationId: addRoom
     *     summary: Adds a new room with an empty queue to the database
     *     parameters:
     *      - in: body
     *        name: body
     *        schema:
     *          type: object
     *          required:
     *              -roomName
     *              -roomType
     *              -createdBy
     *              -participants
     *              -settings
     *          properties:
     *              roomName:
     *                  type: string
     *              roomType:
     *                  type: string
     *                  enum: ['public', 'private']
     *              createdBy:
     *                  type: string
     *              participants:
     *                  type: integer
     *                  default: 0
     *              settings:
     *                  type: object
     *                  required:
     *                      -explicitAllowed
     *                  properties:
     *                      explicitAllowed:
     *                          type: boolean
     *                      password:
     *                          type: string
     *                      minVoteToPlay:
     *                          type: integer
     *                      downVoteLimit:
     *                          type: integer
     *        required: true
     *        description: required room information
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
        db.development.collection('rooms').update(
            {
                roomName: req.body.roomName,
                roomType: req.body.roomType,
                createdBy: req.body.createdBy,

            },
            { $set:
                    {
                        participants: req.body.participants,
                        Settings: req.body.settings,
                        Queue: []
                    }
            },
            {
                upsert: true
            }, (err, result) => {
                console.log(result)
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
     * /removeRoom:
     *   post:
     *     tags:
     *       - Room
     *     name: Remove Room
     *     operationId: removeRoom
     *     summary: Removes a room
     *     parameters:
     *      - in: body
     *        name: body
     *        schema:
     *          type: object
     *          required:
     *              -roomId
     *          properties:
     *              roomId:
     *                  type: string
     *        required: true
     *        description: body example
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

    app.post('/removeRoom' ,(req,res) => {
        db.development.collection('rooms').deleteOne({_id: ObjectId(req.body.roomId)},
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
     * /addSongToQueue:
     *   post:
     *     tags:
     *       - Room
     *     name: Add Song To Queue
     *     operationId: addSongToRoom
     *     summary: Adds a song to the queue of a room
     *     parameters:
     *      - in: body
     *        name: body
     *        schema:
     *          type: object
     *          required:
     *              -roomId
     *              -songName
     *              -artistName
     *              -songId
     *          properties:
     *              roomId:
     *                  type: string
     *              songName:
     *                  type: string
     *              artistName:
     *                  type: string
     *              songId:
     *                  type: string
     *        required: true
     *        description: body example
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

    app.post('/addSongToQueue', (req, res) => {
        const roomId = req.body.roomId;
        const song = {
            songName: req.body.songName,
            artistName: req.body.artistName,
            songId: req.body.songId,
            rank: 0
        }

        db.development.collection('rooms').updateOne(
            {_id: ObjectId(roomId)},
            {$push: {Queue: song}},
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
     * /removeSongFromQueue:
     *   post:
     *     tags:
     *       - Room
     *     name: Remove Song From Queue
     *     operationId: removeSongFromQueue
     *     summary: Removes a song from a queue
     *     parameters:
     *      - in: body
     *        name: body
     *        schema:
     *          type: object
     *          required:
     *              -roomId
     *              -songId
     *          properties:
     *              roomId:
     *                  type: string
     *              songId:
     *                  type: string
     *        required: true
     *        description: body example
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

    app.post('/removeSongFromQueue', (req, res) => {

        db.development.collection('rooms').updateOne(
            {_id: ObjectId(req.body.roomId)},
            {$pull: {"Queue" : {songId: req.body.songId}}}, (err, result) => {
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
     * /increaseSongRank:
     *   post:
     *     tags:
     *       - Room
     *     name: Increase Song Rank
     *     operationId: increaseSongRank
     *     summary: increases a song's rank in the queue
     *     parameters:
     *      - in: body
     *        name: body
     *        schema:
     *          type: object
     *          required:
     *              -roomId
     *              -songId
     *          properties:
     *              roomId:
     *                  type: string
     *              songId:
     *                  type: string
     *        required: true
     *        description: body example
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

    app.post('/increaseSongRank', (req,res) => {
        const id = req.body.songId

        db.development.collection('rooms').updateOne(
            {_id: ObjectId(req.body.roomId), "Queue.songId" : id},
            {$inc: {'Queue.$.rank': 1}}, (err, result) => {
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
     * /decreaseSongRank:
     *   post:
     *     tags:
     *       - Room
     *     name: Decrease Song Rank
     *     operationId: decreaseSongRank
     *     summary: decreases a song's rank in the queue
     *     parameters:
     *      - in: body
     *        name: body
     *        schema:
     *          type: object
     *          required:
     *              -roomId
     *              -songId
     *          properties:
     *              roomId:
     *                  type: string
     *              songId:
     *                  type: string
     *        required: true
     *        description: body example
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

    app.post('/decreaseSongRank', (req,res) => {
        const id = req.body.songId

        db.development.collection('rooms').updateOne(
            {_id: ObjectId(req.body.roomId), "Queue.songId" : id},
            {$inc: {'Queue.$.rank': -1}}, (err, result) => {
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
     * /sortQueue:
     *   post:
     *     tags:
     *       - Room
     *     name: Sort Queue
     *     operationId: sortQueue
     *     summary: Sorts queue by song rank
     *     parameters:
     *      - in: body
     *        name: body
     *        schema:
     *          type: object
     *          required:
     *              - roomId
     *          properties:
     *              roomId:
     *                  type: string
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

    app.post('/sortQueue', (req, res) =>{
        db.development.collection('rooms').update(
            { _id: ObjectId(req.body.roomId) },
            { $push: { Queue: { $each: [ ], $sort: 1 } } },(err, result) => {
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