// jest.setup.ts
import request from "supertest";
import app from "../server"; // Replace 'path-to-app' with the actual path to your app.ts file
import { closeDatabase, connect } from "../database/db";
let req: request.SuperTest<request.Test>;

let server;

beforeAll(async () => {
  await connect();
  req = request(app); // Initialize supertest request
});

afterAll(async () => {
  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => {
        closeDatabase().then(resolve); // Close the server and the database after all tests
      });
    });
  }
});

export { req };
