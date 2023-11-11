"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../database/db");
const server_1 = __importDefault(require("../../server"));
const UserService_1 = require("../../src/services/UserService");
const supertest_1 = __importDefault(require("supertest"));
const a = {
    street: "Street",
    houseNumber: "1",
    postalCode: "12345",
    city: "Berlin",
    country: "Germany",
};
const u = {
    email: "John@doe.com",
    name: {
        first: "John",
        last: "Doe",
    },
    password: "12abcAB!",
    isAdministrator: true,
    address: a,
    birthDate: new Date(),
    gender: "male",
    isActive: true,
    profilePicture: "picture1",
    socialMediaUrls: {
        facebook: "facebook",
        instagram: "instagram",
    },
};
const JaneData = {
    email: "Jane@doe.com",
    name: {
        first: "Jane",
        last: "Doe",
    },
    password: "12abcAB!",
    isAdministrator: false,
    address: a,
    birthDate: new Date(),
    gender: "male",
    isActive: true,
    profilePicture: "picture1",
    socialMediaUrls: {
        facebook: "facebook",
        instagram: "instagram",
    },
};
const userService = new UserService_1.UserService();
const NON_EXISTING_ID = "635d2e796ea2e8c9bde5787c";
let admin;
let AdminToken;
let jane;
let token;
describe("userRoute test", () => {
    beforeAll(async () => await (0, db_1.connect)());
    beforeEach(async () => {
        admin = await userService.createUser(u);
        jane = await userService.createUser(JaneData);
        const req = (0, supertest_1.default)(server_1.default);
        const adminloginData = { email: "John@doe.com", password: "12abcAB!" };
        const adminRes = await req.post(`/api/login`).send(adminloginData);
        const AdminLoginResource = adminRes.body;
        AdminToken = AdminLoginResource.access_token;
        const janeLoginData = { email: "Jane@doe.com", password: "12abcAB!" };
        const janeRes = await req.post(`/api/login`).send(janeLoginData);
        const janeLoginResource = janeRes.body;
        token = janeLoginResource.access_token;
        console.log(token);
    });
    afterEach(async () => await (0, db_1.clearDatabase)());
    afterAll(async () => await (0, db_1.closeDatabase)());
    test("getUsers", async () => {
        const req = (0, supertest_1.default)(server_1.default);
        const response = await req
            .get("/api/users")
            .set("Authorization", `Bearer ${AdminToken}`);
        expect(response.statusCode).toBe(200);
        const users = response.body;
        expect(users.users.length).toBe(2);
        expect(users.users[0].id).toBeDefined();
        expect(users.users[0].name.first).toBe(u.name.first);
        expect(users.users[0].name.last).toBe(u.name.last);
        expect(users.users[0].email).toBe(u.email);
        expect(users.users[0].password).toBeUndefined();
        expect(users.users[0].address).toMatchObject(a);
        expect(users.users[0].birthDate).toBe(u.birthDate);
        expect(users.users[0].gender).toBe(u.gender);
        expect(users.users[0].isActive).toBeTruthy();
        expect(users.users[0].profilePicture).toBe(u.profilePicture);
        expect(users.users[0].socialMediaUrls).toMatchObject(u.socialMediaUrls);
    });
});
//# sourceMappingURL=UserRoute.test.js.map