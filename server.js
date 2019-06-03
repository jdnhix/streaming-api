import express from 'express';
import cors from 'cors';
import swaggerDoc from 'swagger-jsdoc';
import swagger from 'swagger-ui-express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import logger from './logger'
import request from "request";
import qs from 'qs'

const host = 'localhost:'
const port = process.env.API_PORT || 3000;
const clientID = '85ec7eb9dc0543fc9408c8ba05fd2bdb';
const clientSecret = 'c9192d5af4bb450da0770bf5b23f4e49';

const app = express();
app.use(bodyParser.json()); // To support JSON-encoded bodies
app.use(bodyParser.urlencoded({
  // To support URL-encoded bodies
  extended: true
}));

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
const swaggerSpec = swaggerDoc(options, () => {
  app.use(errorHandler)
});

// Serve swagger docs the way you like (Recommendation: swagger-tools)
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

const spotifyauth = () => {

};

const errorHandler = (err, req, res, next) => {
  if (err) {
    logger.info("Universal Error Catch")
    logger.info(err)
    if (res.statusCode === 200) res.statusCode = 400
    return res.end(JSON.stringify(err))
  }
  next()
}

app.use('/api-docs', swagger.serve, swagger.setup(swaggerSpec));
app.use(cors());
app.use(morgan('dev'));


var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    const token = body.access_token;
    const options = {
      url: 'https://api.spotify.com/v1/users/jdhnation',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options, function(error, response, body) {
      console.log(body);
    });
  }
});

// Routes
require('./routes/test').getTest(app)
require('./routes/test').getTest2(app, clientID, clientSecret)

module.exports = app;

// Start the server
const server = app.listen(port, () => {
  const host = server.address().address;
  const { port } = server.address();


  console.log('Example app listening at http://%s:%s', host, port);

});



spotifyauth();


