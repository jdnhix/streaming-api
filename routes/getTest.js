
/* eslint-disable no-console */

/**
 * @swagger
 * /getTest:
 *   get:
 *     tags:
 *       - Test
 *     name: getTest
 *     summary: Update user info
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: User info updated
 *       '403':
 *         description: No authorization / user not found
 */

module.exports = (app) => {
  app.get('/getTest', (err, req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    console.log('hitme')
    if(err) res.end(JSON.stringify(err))
                console.log('user updated');
    res.end(JSON.stringify('test 123'))
                res.status(200)
              });

};
