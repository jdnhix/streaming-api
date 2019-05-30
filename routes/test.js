
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
 * /getTest2:
 *   get:
 *     tags:
 *       - Test
 *     name: Find test
 *     operationId: getTest2
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


module.exports.getTest2 = (app) => {
  app.get('/getTest2', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify('test 2'))
    res.status(200)
  });
};

