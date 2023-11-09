import express, { Express, Request, Response } from "express";
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const key = fs.readFileSync("./certificates/key.pem");
const cert = fs.readFileSync("./certificates/cert.pem");
import { connect } from "./database/db";
const https = require("https");
const http = require("http");
import swaggerDocs from "./src/utils/swagger";
import UserRoute from "./src/routes/UserRoute";

const app: Express = express();

/* Routes */
app.use("*", cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Expose-Headers", "Authorization");
  next();
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use("/api/users", UserRoute);
swaggerDocs(app, 80);
app.use((req, res, next) => {
  res.status(404).json("Not Found");
});

connect()
  .then(() => {
    // Create HTTP server for testing
    /** 
    const httpServer = http.createServer(app);
    httpServer.listen(80, () => {
      console.log("Listening on port 80 (HTTP) for testing");
    });
    */
    //console.log('Connected to the database');
    const server = https.createServer({ key, cert }, app);
    server.listen(443, () => {
      console.log("Listening on port 443");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

export default app;
