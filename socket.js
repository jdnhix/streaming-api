import socket from 'socket.io'
import {ObjectId} from 'mongodb'

module.exports.socket = (server, db) => {

    const io = socket(server)

    io.on('connection', (socket) => {
        console.log("Socket Connection Established with ID :" + socket.id)

        socket.on("addSongToQueue", async (song) => {
            song.rank = 0
            const roomId = song.roomId
            delete song.roomId
            db.development.collection('rooms').updateOne(
                {_id: ObjectId(roomId)},
                {$push: {queue: song}},
                {
                    upsert: true
                }, (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('res.json(result) used to sit here')
                    }
                })

            //emit socket here
            socket.emit('addSongToQueue', song)
        })

        socket.on("removeQueueItem", async (params) => {

            db.development.collection('rooms').updateOne(
                {_id: ObjectId(params.roomId)},
                {$pull: {"queue": {songId: params.songId}}}, (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('res.json(result) used to sit here')
                    }
                }
            )

            socket.emit("removeQueueItem", params)
        })

        socket.on('addRoom', async (room) => {
            room.queue = []
            room.currentSong = {
                songName: 'no current song',
                artistName: 'no current song',
                uri: '',
                coverArt: ''
            }
            room.audienceSize = 0


            const id = await db.development.collection('rooms').updateOne(
                {
                    roomName: room.roomName,
                    roomType: room.roomType,
                    hostName: room.hostName,
                },
                {
                    $set:
                        {
                            audienceSize: room.audienceSize,
                            password: room.password,
                            downVoteLimit: room.downVoteLimit,
                            queue: room.queue,
                            currentSong: room.currentSong
                        }
                },
                {
                    upsert: true
                }, (err, result) => {
                    room._id = result.upsertedId._id
                    socket.emit('addRoom', room)
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('res.json(result) used to sit here')
                    }
                })
                // socket.emit('addRoom', room)
        })
    })
}