"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../database/db");
const UserModel_1 = require("../../src/model/UserModel");
const UserService_1 = require("../../src/services/UserService");
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
const userService = new UserService_1.UserService();
const NON_EXISTING_ID = "635d2e796ea2e8c9bde5787c";
describe("userModel test", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () { return yield (0, db_1.connect)(); }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () { return yield (0, db_1.clearDatabase)(); }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () { return yield (0, db_1.closeDatabase)(); }));
    test("createUser function", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userService.createUser(u);
        expect(user.id).toBeDefined();
        expect(user.name.first).toBe(u.name.first);
        expect(user.name.last).toBe(u.name.last);
        expect(user.email).toBe(u.email);
        expect(user.password).toBeUndefined();
        const res = yield UserModel_1.User.findById(user.id);
        expect(yield res.isCorrectPassword("12abcAB!")).toBeTruthy();
        expect(user.address).toMatchObject(a);
        expect(user.birthDate).toBe(u.birthDate);
        expect(user.gender).toBe(u.gender);
        expect(user.isActive).toBeTruthy();
        expect(user.profilePicture).toBe(u.profilePicture);
        expect(user.socialMediaUrls).toMatchObject(u.socialMediaUrls);
    }));
    test("getUser works and returns user without password", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userService.createUser(u);
        yield expect(userService.getUser(undefined)).rejects.toThrow("Can not get user, userID is invalid");
        yield expect(userService.getUser(NON_EXISTING_ID)).rejects.toThrow(`No user with id: ${NON_EXISTING_ID} exists.`);
        const res = yield userService.getUser(user.id);
        expect(user.id).toBeDefined();
        expect(user.name.first).toBe(u.name.first);
        expect(user.name.last).toBe(u.name.last);
        expect(user.email).toBe(u.email);
        expect(user.password).toBeUndefined();
        const r = yield UserModel_1.User.findById(user.id);
        expect(yield r.isCorrectPassword("12abcAB!")).toBeTruthy();
        expect(user.address).toMatchObject(a);
        expect(user.birthDate).toBe(u.birthDate);
        expect(user.gender).toBe(u.gender);
        expect(user.isActive).toBeTruthy();
        expect(user.profilePicture).toBe(u.profilePicture);
        expect(user.socialMediaUrls).toMatchObject(u.socialMediaUrls);
    }));
    test("get all users also returns inactive users, getUser(userID) throws error at inactive user.", () => __awaiter(void 0, void 0, void 0, function* () {
        const u1 = yield userService.createUser(u);
        const user1 = {
            id: u1.id,
            email: u1.email,
            name: {
                first: u1.name.first,
                last: u1.name.last,
            },
            isAdministrator: u1.isAdministrator,
            address: u1.address,
            birthDate: u1.birthDate,
            gender: u1.gender,
            isActive: u1.isActive,
        };
        u.isActive = false;
        u.email = "Jane@doe.com";
        u.name.first = "Jane";
        const u2 = yield UserModel_1.User.create(u);
        const user2 = {
            id: u2.id,
            email: u2.email,
            name: {
                first: u2.name.first,
                last: u2.name.last,
            },
            isAdministrator: u2.isAdministrator,
            address: u2.address,
            birthDate: u2.birthDate,
            gender: u2.gender,
            isActive: u2.isActive,
        };
        yield expect(userService.getUser(u2.id)).rejects.toThrow(`No user with id: ${u2.id} exists.`);
        const users = yield userService.getUsers();
        expect(users.users.length).toBe(2);
        expect(users.users[0].isActive).toBe(user1.isActive);
        expect(users.users[1].isActive).toBe(user2.isActive);
    }));
    test("updateUserWithAdmin user update validations", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userService.createUser(u);
        const existingUserId = user.id;
        const updatedUser = Object.assign(Object.assign({}, u), { id: existingUserId, email: "newemail@example.com" });
        const result = yield userService.updateUserWithAdmin(updatedUser);
        expect(result.id).toBeDefined();
        expect(result.name.first).toBe(updatedUser.name.first);
        expect(result.name.last).toBe(updatedUser.name.last);
        expect(result.email).toBe(updatedUser.email);
        expect(result.password).toBeUndefined();
        expect(result.address).toMatchObject(updatedUser.address);
        expect(result.birthDate).toBe(updatedUser.birthDate);
        expect(result.gender).toBe(updatedUser.gender);
        expect(result.isActive).toBeTruthy();
        expect(result.profilePicture).toBe(updatedUser.profilePicture);
        expect(result.socialMediaUrls).toMatchObject(updatedUser.socialMediaUrls);
        //Test for missing userID
        const userWithNoId = Object.assign(Object.assign({}, u), { id: undefined });
        yield expect(userService.updateUserWithAdmin(userWithNoId)).rejects.toThrow("User id is missing, cannot update User.");
        //Test for non-existing userID
        const nonExistingUser = Object.assign(Object.assign({}, u), { id: NON_EXISTING_ID });
        yield expect(userService.updateUserWithAdmin(nonExistingUser)).rejects.toThrow(`No user with id: ${NON_EXISTING_ID} found, cannot update`);
    }));
    test("duplicate email check", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userService.createUser(u);
        yield userService.createUser(Object.assign(Object.assign({}, u), { email: "duplicate@example.com" }));
        //Create another user with a different ID but same email for duplicate check
        const userWithDuplicateEmail = Object.assign(Object.assign({}, user), { email: "duplicate@example.com" });
        yield expect(userService.updateUserWithAdmin(userWithDuplicateEmail)).rejects.toThrow("Duplicate email");
    }));
});
//# sourceMappingURL=UserService.test.js.map