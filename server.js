import express from 'express';
import cors from 'cors';
import swaggerDoc from 'swagger-jsdoc';
import swagger from 'swagger-ui-express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import logger from './logger'
import session from 'cookie-session'
import user from './routes/user.js'

const host = 'localhost:'
const port = process.env.API_PORT || 3000;

const app = express();

app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

// Swagger definition
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
const swaggerDefinition = {
  info: {
    title: 'Streaming Service Data API',
    version: '1.0.0',
    description: 'Third party streaming service API data that we care about',
  },
  host: `localhost:${port}`,
  basePath: '/',
}

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  explorer: true,
  // Path to the API docs
  // Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
  apis: ['./routes/*.js'],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format

const swaggerSpec = swaggerDoc(options)

const errorHandler = (err, req, res, next) => {
  if (err) {
    logger.info("Universal Error Catch")
    logger.info(err)
    if (res.statusCode === 200) res.statusCode = 400
    return res.end(JSON.stringify(err))
  }
  return next()
}

// Serve swagger docs the way you like (Recommendation: swagger-tools)
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});




app.use('/api-docs', swagger.serve, swagger.setup(swaggerSpec))
app.use(cors());
app.use(errorHandler)
app.use(morgan('dev'));
app.use(bodyParser.json()); // To support JSON-encoded bodies
app.use(bodyParser.urlencoded({
  // To support URL-encoded bodies
  extended: true
}));

// Routes
// require('./routes/test').getTest(app)
// require('./routes/test').spotifySearchTest(app) todo fix these two
require('./routes/user.js').getUserAccess(app);



// Start the server
    const server = app.listen(port, async () => {
      const host = server.address().address;
      const {port} = server.address();
      console.log('Server Listening at http://%s:%s', host, port);
    });

module.exports = app;
