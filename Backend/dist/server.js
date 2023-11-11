"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const key = fs.readFileSync("./certificates/key.pem");
const cert = fs.readFileSync("./certificates/cert.pem");
const db_1 = require("./database/db");
const https = require("https");
const http = require("http");
const swagger_1 = __importDefault(require("./src/utils/swagger"));
const UserRoute_1 = __importDefault(require("./src/routes/UserRoute"));
const UsersRouter_1 = __importDefault(require("./src/routes/UsersRouter"));
const login_1 = __importDefault(require("./src/routes/login"));
const app = (0, express_1.default)();
/* Routes */
app.use("*", cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers", "Authorization");
    next();
});
app.use(bodyParser.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(__dirname));
app.use('/api/users', UserRoute_1.default);
app.use('/api', UsersRouter_1.default);
app.use('/api/login', login_1.default);
(0, swagger_1.default)(app, 443);
app.use((req, res, next) => {
    res.status(404).json("Not Found");
});
(0, db_1.connect)()
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
exports.default = app;
//# sourceMappingURL=server.js.map