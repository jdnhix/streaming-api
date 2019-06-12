import request from 'request'

module.exports.player = (app) => {

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

    //this one doesnt work
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