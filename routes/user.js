import axios from 'axios'

const clientID = '85ec7eb9dc0543fc9408c8ba05fd2bdb';
const clientSecret = 'c9192d5af4bb450da0770bf5b23f4e49';
const redirect_uri = 'http://localhost:3000'


module.exports.temp = () => {
    return axios.get('https://accounts.spotify.com/authorize', {
        params: {
            client_id: clientID,
            response_type: 'code',
            redirect_uri,
            // todo add state (refer to guide) here for security. Highly recommended
        }
    }).then( response => {
        console.log(response.data)
        res.send(response.data)
    }).catch(err => {
        console.log(err);
    })
}

function getAuthToken(){
    const userAuthCode = getAuthCode()
}







// request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//
//         // use the access token to access the Spotify Web API
//         const token = body.access_token;
//         const options = {
//             url: 'https://api.spotify.com/v1/users/jdhnation',
//             headers: {
//                 'Authorization': 'Bearer ' + token
//             },
//             json: true
//         };
//         request.get(options, function(error, response, body) {
//             console.log(body);
//         });
//     }
// });