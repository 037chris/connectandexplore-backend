import express, { Express, Request, Response } from "express";
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const key = fs.readFileSync("./certificates/key.pem");
const cert = fs.readFileSync("./certificates/cert.pem");
import { connect } from "./database/db";
import createAdminUser from "./src/utils/CreateAdminUser";
import https from "https";
const http = require("http");
import swaggerDocs from "./src/utils/swagger";
import UserRoute from "./src/routes/UserRoute";
import UsersRouter from "./src/routes/UsersRouter";
import loginRouter from "./src/routes/login";
import EventRouter from "./src/routes/EventRoute";
import createTestData from "./src/utils/createTestData";
import commentsRouter from "./src/routes/Comments";
import socketIO from "socket.io";
import ChatRouter from "./src/routes/ChatRoute";
import { ChatService } from "./src/services/ChatService";

const app: Express = express();
const port = process.env.PORT || 443;
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

export const server = https.createServer({ key, cert }, app);
const chatService = new ChatService();
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("socket connected");

  socket.on("disconnect", () => {
    console.log("socket disconnected")
  });

  socket.on("join chat", async (data) => {
    const { chatID, username } = data;
    socket.join(chatID);
    socket.username = username;
    //const chat = await chatService.getChat(chatID);
    //console.log(chat);
    console.log(`(${chatID}): ${username} joined`);
  });

  socket.on("new message", (data) => {
    const { chatID, message } = data;
    console.log(`(${chatID}): ${socket.username}> ${message}`);
    io.to(chatID).emit("new message", {
      username: socket.username,
      message: message,
    });
  });
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("Health Check: OK");
});
app.use("/api/users", UserRoute);
app.use("/api", UsersRouter);
app.use("/api/login", loginRouter);
app.use("/api/events", EventRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/chat", ChatRouter);
swaggerDocs(app, +port);
app.use((req, res, next) => {
  res.status(404).json("Not Found");
});

connect()
  .then(async () => {
    // Create admin user after connecting to the database
    await createAdminUser();
    await createTestData();
    //let server = https.createServer({ key, cert }, app);
    //let server = http.createServer(app);
    if (process.env.NODE_ENV !== "test") {
      server.listen(port, () => {
        console.log("Listening on port ", port);
      });
    }
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

export default app;
