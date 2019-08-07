import socket from 'socket.io'
import {ObjectId} from 'mongodb'
import request from 'request'

const events = require('events')


module.exports.socket = (server, db) => {

    const eventEmitter = new events.EventEmitter();
    const io = socket(server)

    io.on('connection', (socket) => {
        console.log("Socket Connection Established with ID :" + socket.id)


        socket.on('join', (roomId) => {
            console.log(`CONNECTION: socket ${socket.id} joined room ${roomId}`)
            socket.join(`${roomId}`)
            io.in(roomId).emit("changeAudienceSize", {dir: 'inc', roomId: roomId})
        })

        socket.on('leave', (roomId) => {
            console.log(`DISCONNECTION: socket ${socket.id} left room ${roomId}`)
            socket.leave(`${roomId}`)
        })






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
                        // console.log(result)
                    }
                })

            //emit socket here
            io.in(roomId).emit('addSongToQueue', song)
        })

        socket.on("removeQueueItem", async (params) => {

            db.development.collection('rooms').updateOne(
                {_id: ObjectId(params.roomId)},
                {$pull: {"queue": {songId: params.songId}}}, (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        // console.log(result)
                    }
                }
            )

            io.in(params.roomId).emit("removeQueueItem", params)
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
                            currentSong: room.currentSong,
                            accessToken: room.accessToken
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
                        console.log(room._id)
                        socket.emit('setHostId', room)
                    }
                })
            io.emit('addRoom', room)
        })

        socket.poll = (token) => {
            const access_token = token

            const options = {
                url: 'https://api.spotify.com/v1/me/player',
                headers: {'Authorization': 'Bearer ' + access_token},
                json: true
            };

            request.get(options, function (error, response, body) {
                if (body && body.is_playing) {
                    // console.log(`playing at ${body.progress_ms} ms`)
                    setTimeout(() => {
                        socket.poll(token)
                    }, 1000)
                } else {
                    if(body && body.progress_ms === 0){
                        console.log('music stopped')
                        socket.emit('musicStop')
                    } else {
                        console.log('music paused')
                        socket.emit('musicPause')
                    }
                }
            })
        }

        socket.on('playSong', async (params) => {
            if (params.song) {
                const access_token = params.token
                const options = {
                    url: 'https://api.spotify.com/v1/me/player/play',
                    headers: {'Authorization': 'Bearer ' + access_token},
                    json: true,
                    body: {
                        uris: [params.song.uri]
                    }
                };

                request.put(options, async () => {
                    console.log('song started')
                    //set timeout here to prevent any weird overlap
                    setTimeout( () => {
                        socket.poll(params.token)
                    }, 500)
                });

                db.development.collection('rooms').updateOne(
                    {_id: ObjectId(params.roomId)},
                    {$set: {currentSong: params.song}}, (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            // console.log(result)
                        }
                    }
                )

                db.development.collection('rooms').updateOne(
                    {_id: ObjectId(params.roomId)},
                    {$pop: {queue: -1}}, (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            // console.log(result)
                        }
                    })

            } else {
                const access_token = params.token
                const options = {
                    url: 'https://api.spotify.com/v1/me/player/play',
                    headers: {'Authorization': 'Bearer ' + access_token},
                    json: true,
                };

                request.put(options, () => {
                    console.log('song resumed')
                    //set timeout here to prevent any weird overlap
                    setTimeout( () => {
                        socket.poll(params.token)
                    }, 500)
                })
            }

            io.in(params.roomId).emit('playSong', params)
        })

        socket.on('changeSongRank', async (params) => {
            const id = params.song.songId
            const direction = params.direction

            if (direction === 'inc') {
                db.development.collection('rooms').updateOne(
                    {_id: ObjectId(params.roomId), "queue.songId": id},
                    {$inc: {'queue.$.rank': 1}}, (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            // console.log(result)
                        }
                    }
                )
            } else if (direction === 'dec') {
                db.development.collection('rooms').updateOne(
                    {_id: ObjectId(params.roomId), "queue.songId": id},
                    {$inc: {'queue.$.rank': -1}}, (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            // console.log(result)
                        }
                    }
                )
            }

            db.development.collection('rooms').update(
                {_id: ObjectId(params.roomId)},
                {$push: {queue: {$each: [], $sort: {rank: -1}}}}, (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        // console.log(result)
                    }
                }
            )

            io.in(params.roomId).emit('changeSongRank', params)
        })

        socket.on('clearCurrentSong', (params) => {
            const currentSong = {
                songName: 'no current song',
                artistName: 'no current song',
                uri: '',
                coverArt: ''
            }

            db.development.collection('rooms').updateOne(
                {_id: ObjectId(params.roomId)},
                {$set: {currentSong: currentSong}}, (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        // console.log(result)
                    }
                }
            )

            io.in(params.roomId).emit('clearCurrentSong', currentSong)
        })
    })
}




