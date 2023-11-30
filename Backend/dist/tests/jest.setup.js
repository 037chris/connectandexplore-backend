"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.req = void 0;
// jest.setup.ts
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server")); // Replace 'path-to-app' with the actual path to your app.ts file
const db_1 = require("../database/db");
let req;
let server;
beforeAll(async () => {
    await (0, db_1.connect)();
    exports.req = req = (0, supertest_1.default)(server_1.default); // Initialize supertest request
});
afterAll(async () => {
    if (server) {
        await new Promise((resolve) => {
            server.close(() => {
                (0, db_1.closeDatabase)().then(resolve); // Close the server and the database after all tests
            });
        });
    }
});
//# sourceMappingURL=jest.setup.js.map