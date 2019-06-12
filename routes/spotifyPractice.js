import querystring from 'querystring'
import request from 'request'

const client_id = '85ec7eb9dc0543fc9408c8ba05fd2bdb';
const client_secret = 'c9192d5af4bb450da0770bf5b23f4e49';
const redirect_uri = 'http://localhost:3000/user'


//todo for some reason this doesnt work...i just ended up copying their flow
module.exports.getTopTracks = (app) => {
    app.get('/login', (req, res) => {
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: client_id,
                redirect_uri,
                // scope: 'user-follow-read'
                // state: state
            }))
    })

    app.get('/user', (req, res) => {
        const code = req.query.code;

        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
           let access_token = body.access_token
            if (access_token) req.session.access_token = access_token


            const options = {
                url: 'https://api.spotify.com/v1/me',
                headers: {'Authorization': 'Bearer ' + access_token},
                json: true
            };

            request.get(options, function (error, response, body) {
                console.log(req.session.access_token)
                res.send(JSON.stringify(body, undefined, 2))
            });

        })


    });


    app.get('/refresh_token', function (req, res) {

        // requesting access token from refresh token
        var refresh_token = req.query.refresh_token;
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))},
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token;
                res.send({
                    'access_token': access_token
                });
            }
        });
    });


}


module.exports.spotifyAuth = (app) => {


    app.get('/login', function (req, res) {

        // your application requests authorization
        var scope = 'user-read-private user-read-email user-modify-playback-state';
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
            }));
    });

    app.get('/user', function (req, res) {

        // your application requests refresh and access tokens
        // after checking the state parameter

        var code = req.query.code || null;


        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {


            var access_token = body.access_token,
                refresh_token = body.refresh_token;


            var options = {
                url: 'https://api.spotify.com/v1/me/player/previous',
                headers: {'Authorization': 'Bearer ' + access_token},
                json: true
            };

            // use the access token to access the Spotify Web API
            request.post(options, function (error, response, body) {
                console.log(body);
                res.send(body);
            });


        });

    });

    app.get('/refresh_token', function (req, res) {

        // requesting access token from refresh token
        var refresh_token = req.query.refresh_token;
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))},
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token;
                res.send({
                    'access_token': access_token
                });
            }
        });
    });
}

