import request from 'request'

/* eslint-disable no-console */

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
  app.get('/getTest', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify('test 123'))
    res.status(200)
  });
};

/**
 * @swagger
 * /postTest2:
 *   get:
 *     tags:
 *       - Test
 *     name: Find test
 *     operationId: getTest2
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


module.exports.getTest2 = (app, clientID, clientSecret) => {
  app.get('/postTest2', (err, req, res) => {
  })
};

