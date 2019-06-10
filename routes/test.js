
/* eslint-disable no-console */

import cache from '../cache'
import axios from "axios";

/**
 * @swagger
 * /getTest:
 *   get:
 *     tags:
 *       - Test
 *     name: Find test
 *     operationId: getTest
 *     summary: Finds a test
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


module.exports.getTest = (app) => {
  app.get('/getTest', async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    const spotifyToken = await cache.spotifyToken

    res.end(JSON.stringify(spotifyToken))
    res.status(200)
  });
};

/**
 * @swagger
 * /spotifySearchTest:
 *   get:
 *     tags:
 *       - Test
 *     name: Find test
 *     operationId: spotifySearchTest
 *     summary: Finds a test
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/x-www-form-urlencoded
 *     responses:
 *       '200':
 *         description: A single test object
 *       '401':
 *         description: No auth token / no user found in db with that name
 *       '403':
 *         description: JWT token and username from client don't match
 */


module.exports.spotifySearchTest = (app) => {
  app.get('/spotifySearchTest', async (req, res) => {
    const spotifyToken = await cache.spotifyToken
    const songName = 'ricky'
    const artistName = 'denzel curry' //todo im still confused on how to encode spaces...sometimes %20 works

    axios.get('https://api.spotify.com/v1/search', {
      headers: {
        'Authorization': 'Bearer ' + spotifyToken
      },
      params: {
        q: `track:${songName} artist:${artistName}`,
        type: 'track'
      }
    }).then((results) => {
      res.send(JSON.stringify(results.data.tracks.items, null, 2));
    }).catch((err) => console.log(err.response))

  })
};

