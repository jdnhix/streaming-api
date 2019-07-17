import socket from 'socket.io'
import {ObjectId} from 'mongodb'

module.exports.socket = (server, db) => {

    const io = socket(server)

    io.on('connection', (socket) => {
        console.log("Socket Connection Established with ID :"+ socket.id)
        socket.on("addSongToQueue", async(song) => {
            //call mongo func here
            console.log(song)
            song.rank = 0

            // const roomId = test.roomId;
            // const song = {
            //     songName: test.songName,
            //     artistName: test.artistName,
            //     songId: test.songId,
            //     coverArt: test.coverArt,
            //     explicit: test.explicit,
            //     rank: 0
            // }

            db.development.collection('rooms').updateOne(
                {_id: ObjectId(song.roomId)},
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
            socket.emit('addSongToQueue', test)
        })
    })




}