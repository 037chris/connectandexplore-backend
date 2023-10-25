import express, { Express, Request, Response } from 'express';
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const key = fs.readFileSync('./certificates/key.pem');
const cert = fs.readFileSync('./certificates/cert.pem');
import { connect } from './database/db';
const https = require('https');

const app: Express = express();

/* Routes */
app.use("*",cors())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Expose-Headers","Authorization");
  next();
  });

app.use(bodyParser.json());
// New route for /api/hello
app.use('/api/hello', (req, res, next) => {
  res.json({ message: 'Hello, World!' });
});
app.use((req, res, next) => {
  res.status(404).json("Not Found")
});


connect()
  .then(() => {
    //console.log('Connected to the database');
    const server = https.createServer({ key, cert }, app);
    server.listen(443, () => {
      console.log('Listening on port 443');
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
  });

module.exports = app;