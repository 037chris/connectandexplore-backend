"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../database/db");
const server_1 = __importDefault(require("../../server"));
//import { req } from "../jest.setup";
const UserModel_1 = require("../../src/model/UserModel");
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
    //profilePicture: "picture1",
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
    // profilePicture: "picture1",
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
let req = (0, supertest_1.default)(server_1.default);
describe("userRoute test", () => {
    beforeAll(async () => await (0, db_1.connect)());
    beforeEach(async () => {
        admin = await userService.createUser(u);
        jane = await userService.createUser(JaneData);
        //const req = request(app);
        const adminloginData = { email: "John@doe.com", password: "12abcAB!" };
        const adminRes = await req.post(`/api/login`).send(adminloginData);
        const AdminLoginResource = adminRes.body;
        AdminToken = AdminLoginResource.access_token;
        const janeLoginData = { email: "Jane@doe.com", password: "12abcAB!" };
        const janeRes = await req.post(`/api/login`).send(janeLoginData);
        const janeLoginResource = janeRes.body;
        token = janeLoginResource.access_token;
    });
    afterEach(async () => await (0, db_1.clearDatabase)());
    afterAll(async () => {
        await (0, db_1.closeDatabase)(); // Perform final cleanup after all tests
    });
    test("getUsers", async () => {
        //const req = request(app);
        const response = await req
            .get("/api/users")
            .set("Authorization", `Bearer ${AdminToken}`);
        expect(response.statusCode).toBe(200);
        const users = response.body;
        expect(users.users.length).toBe(3);
        let userPos;
        if (users.users[0].name.first === u.name.first) {
            userPos = 0;
        }
        else if (users.users[1].name.first === u.name.first) {
            userPos = 1;
        }
        else if (users.users[2].name.first === u.name.first) {
            userPos = 2;
        }
        expect(users.users[userPos].id).toBeDefined();
        expect(users.users[userPos].name.first).toBe(u.name.first);
        expect(users.users[userPos].name.last).toBe(u.name.last);
        expect(users.users[userPos].email).toBe(u.email);
        expect(users.users[userPos].password).toBeUndefined();
        expect(users.users[userPos].address).toMatchObject(a);
        //expect(users.users[0].birthDate).toBe(u.birthDate);
        expect(users.users[userPos].gender).toBe(u.gender);
        expect(users.users[userPos].isActive).toBeTruthy();
        //expect(users.users[0].profilePicture).toBe(u.profilePicture);
        expect(users.users[userPos].socialMediaUrls).toMatchObject(u.socialMediaUrls);
    });
    test("getUsers fails on request by non-admin", async () => {
        //const req = request(app);
        const response = await req
            .get("/api/users")
            .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).toBe(403);
    });
    test("get User request responses with 404 on invalid userID", async () => {
        //const req = request(app);
        const response = await req
            .get(`/api/users/${NON_EXISTING_ID}`)
            .set("Authorization", `Bearer ${AdminToken}`);
        expect(response.statusCode).toBe(404);
    });
    test("get User request responses with 400 on undefined userID", async () => {
        //const req = request(app);
        const response = await req
            .get(`/api/users/invalidID`)
            .set("Authorization", `Bearer ${AdminToken}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
    test("get User returns any user when performed by an admin and returns user when performed by non-admin", async () => {
        const response = await req
            .get(`/api/users/${jane.id}`)
            .set("Authorization", `Bearer ${AdminToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.name.first).toBe(jane.name.first);
        const res = await req
            .get(`/api/users/${jane.id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.name.first).toBe(jane.name.first);
    });
    test("put user successfully updates user in db and returns updated user information", async () => {
        const newName = "newName";
        jane.name.last = newName;
        const res = await req
            .put(`/api/users/${jane.id}`)
            .send(jane)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.name.last).toBe(newName);
        const janeDataFromDB = await UserModel_1.User.findById(jane.id).exec();
        expect(janeDataFromDB.name.last).toBe(newName);
        const updatedName = "newName-adminUpdate";
        jane.name.last = updatedName;
        const response = await req
            .put(`/api/users/${jane.id}`)
            .send(jane)
            .set("Authorization", `Bearer ${AdminToken}`);
        expect(response.body.name.last).toBe(updatedName);
        const janeDataFromDBAdminUpdate = await UserModel_1.User.findById(jane.id).exec();
        expect(janeDataFromDBAdminUpdate.name.last).toBe(updatedName);
    });
    test("should return error on updating email to duplicate email", async () => {
        jane.email = admin.email;
        const res = await req
            .put(`/api/users/${jane.id}`)
            .send(jane)
            .set("Authorization", `Bearer ${AdminToken}`);
        expect(res.statusCode).toBe(404);
    });
    test("should return error on trying to update other users as non-admin", async () => {
        admin.name.first = "newName";
        const res = await req
            .put(`/api/users/${admin.id}`)
            .send(admin)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(403);
    });
    test("testing for validation errors on put user route", async () => {
        const invalidUserResource = {
            email: "",
            name: {
                first: "",
                last: "",
            },
            isAdministrator: false,
            address: a,
            birthDate: jane.birthDate,
            gender: "",
            isActive: true,
        };
        const res = await req
            .put(`/api/users/${jane.id}`)
            .send(invalidUserResource)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toBeDefined();
    });
    test("put user with invalid old password returns error", async () => {
        const requestData = jane;
        requestData.oldPassword = "invalidPW123!";
        requestData.password = "newStrongPassword123!";
        const res = await req
            .put(`/api/users/${jane.id}`)
            .send(requestData)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(403);
        const dbJane = await UserModel_1.User.findById(jane.id).exec();
        expect(await dbJane.isCorrectPassword("newPassowrd")).toBeFalsy();
    });
    test("should allow an admin to delete any user", async () => {
        const response = await req
            .delete(`/api/users/${jane.id}`)
            .set("Authorization", `Bearer ${AdminToken}`);
        expect(response.statusCode).toBe(204);
    });
    test("should allow a user to inactivate their own account", async () => {
        const response = await req
            .delete(`/api/users/${jane.id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).toBe(204);
    });
    test("should prevent a non-admin user from deleting another user", async () => {
        const response = await req
            .delete(`/api/users/${admin.id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).toBe(403);
    });
    test("should return an error for an invalid user ID", async () => {
        const response = await req
            .delete(`/api/users/${NON_EXISTING_ID}`)
            .set("Authorization", `Bearer ${AdminToken}`);
        expect(response.statusCode).toBe(404);
    });
});
//# sourceMappingURL=UserRoute.test.js.map