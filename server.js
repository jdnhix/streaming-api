import express from 'express';
import cors from 'cors';
import swaggerDoc from 'swagger-jsdoc';
import swagger from 'swagger-ui-express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import logger from './logger'
import session from 'cookie-session'
import socket from 'socket.io'
import ip from 'ip'

const initializeDatabases = require('./db.js')

const host = 'localhost:'
const port = process.env.API_PORT || 3000;

const app = express();

app.use(session({
  // maxAge: 10000,
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
  jsonEditor: true,
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

initializeDatabases().then(db => {
// Routes

  require('./routes/auth.js').getUserAccess(app);
  require('./routes/user').user(app);
  require('./routes/player').player(app);
  require('./routes/search').search(app);
  require('./routes/room').room(app, db);

// Start the server
  const server = app.listen(port, async () => {
    const host = ip.address()
    const {port} = server.address();
    console.log('Server Listening at http://%s:%s/api-docs', host, port);
  });

  //websocket hook up
  require('./socket').socket(server, db)






});

module.exports = app;
