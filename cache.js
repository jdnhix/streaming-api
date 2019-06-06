import { DataCache } from './DataCache'
import axios from 'axios'

const clientID = '85ec7eb9dc0543fc9408c8ba05fd2bdb';
const clientSecret = 'c9192d5af4bb450da0770bf5b23f4e49';
const getSpotifyToken = () => {
  const url =  'https://accounts.spotify.com/api/token'
  return axios({
    method: 'post',
    url: url,
    params: { // in axios data is the body request
      grant_type: 'client_credentials',
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientID}:${clientSecret}`).toString('base64') // client id and secret from env
    }
  }).then((result)=> {
    return result
  }).catch((err) => console.log(err.response))
}

const spotifyCache = new DataCache(getSpotifyToken)
const spotifyToken = () => {
  return new Promise((resolve, reject) => {
      spotifyCache.getData().then(token => {
        resolve(token.data.access_token)
      })
    }
  )
}

module.exports = {
  spotifyToken : spotifyToken()
}
