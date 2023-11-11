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
const a = {
    street: "Street",
    houseNumber: "1",
    postalCode: "12345",
    city: "Berlin",
    country: "Germany",
};
let u = {
    email: "John@doe.com",
    name: {
        first: "John",
        last: "Doe",
    },
    password: "123",
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
describe("userModel test", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () { return yield (0, db_1.connect)(); }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () { return yield (0, db_1.clearDatabase)(); }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () { return yield (0, db_1.closeDatabase)(); }));
    test("create User", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield UserModel_1.User.create(u);
        expect(user.id).toBeDefined();
        expect(user.name.first).toBe(u.name.first);
        expect(user.name.last).toBe(u.name.last);
        expect(user.email).toBe(u.email);
        expect(user.password).not.toBe(u.password);
        expect(user.password).toBeDefined();
        expect(yield user.isCorrectPassword("123")).toBeTruthy();
        expect(user.address).toMatchObject(a);
        expect(user.birthDate).toBe(u.birthDate);
        expect(user.gender).toBe(u.gender);
        expect(user.isActive).toBeTruthy();
        expect(user.profilePicture).toBe(u.profilePicture);
        expect(user.socialMediaUrls).toMatchObject(u.socialMediaUrls);
    }));
    test("updated user password middleware", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield UserModel_1.User.create(u);
        user.password = "456";
        user.email = "John@some-host.de";
        yield user.save();
        const res = yield UserModel_1.User.findById(user.id);
        expect(res.password).not.toBe("456");
        expect(res.password).not.toBe("123");
        expect(res.password).toBeDefined();
        expect(yield res.isCorrectPassword("456")).toBeTruthy();
        expect(res.email).toBe("John@some-host.de");
        expect(yield UserModel_1.User.findOne({ email: "John@doe.com" })).toBeNull();
    }));
    test("rejects on duplicate email", () => __awaiter(void 0, void 0, void 0, function* () {
        yield UserModel_1.User.create(u);
        u.name.first = "Jane";
        yield expect(UserModel_1.User.create(u)).rejects.toThrow();
    }));
});
//# sourceMappingURL=UserModel.test.js.map