import request from 'request';

const clientID = '85ec7eb9dc0543fc9408c8ba05fd2bdb';
const clientSecret = 'c9192d5af4bb450da0770bf5b23f4e49';
const authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

const Cache = () => {
const self = this

  getInitData()

  function getInitData () {
  self.getSpotifyToken()
  }
  const props = {
    spotifyToken: '',
    getSpotifyToken: () => {
      request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          // use the access token to access the Spotify Web API
          self.spotifyToken = body.access_token;
          console.log(self.spotifyToken)
        }
      })
    }
  }
  return props


}
module.exports = new Cache()



//use this for other calls
// const options = {
//   url: 'https://api.spotify.com/v1/users/jdhnation',
//   headers: {
//     'Authorization': 'Bearer ' + token
//   },
//   json: true
// };
// request.get(options, function(error, response, body) {
// });
