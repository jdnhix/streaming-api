import express from 'express';
import cors from 'cors';
import swaggerDoc from 'swagger-jsdoc';
import swagger from 'swagger-ui-express';
import bodyParser from 'body-parser';

const app = express();

const host = 'localhost:'
const port = process.env.API_PORT || 3000;

const swaggerDefinition = {
  info: {
    title: 'Streaming Service Data API',
    version: '1.0.0',
    description: 'Third party streaming service API data that we care about',
  },
  host: `${host}${port}`,
  basePath: '/',


}

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerDoc(options);

app.get('/swagger.json', (req, res) => {
  console.log(req, res);
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', swagger.serve, swagger.setup(swaggerSpec));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// require('./routes/getTest')(app);

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
