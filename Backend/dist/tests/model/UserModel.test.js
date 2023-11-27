"use strict";
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
    beforeAll(async () => await (0, db_1.connect)());
    afterEach(async () => await (0, db_1.clearDatabase)());
    afterAll(async () => await (0, db_1.closeDatabase)());
    test("create User", async () => {
        const user = await UserModel_1.User.create(u);
        expect(user.id).toBeDefined();
        expect(user.name.first).toBe(u.name.first);
        expect(user.name.last).toBe(u.name.last);
        expect(user.email).toBe(u.email);
        expect(user.password).not.toBe(u.password);
        expect(user.password).toBeDefined();
        expect(await user.isCorrectPassword("123")).toBeTruthy();
        expect(user.address).toMatchObject(a);
        expect(user.birthDate).toBe(u.birthDate);
        expect(user.gender).toBe(u.gender);
        expect(user.isActive).toBeTruthy();
        expect(user.profilePicture).toBe(u.profilePicture);
        expect(user.socialMediaUrls).toMatchObject(u.socialMediaUrls);
    });
    test("updated user password middleware", async () => {
        const user = await UserModel_1.User.create(u);
        user.password = "456";
        user.email = "John@some-host.de";
        await user.save();
        const res = await UserModel_1.User.findById(user.id);
        expect(res.password).not.toBe("456");
        expect(res.password).not.toBe("123");
        expect(res.password).toBeDefined();
        expect(await res.isCorrectPassword("456")).toBeTruthy();
        expect(res.email).toBe("John@some-host.de");
        expect(await UserModel_1.User.findOne({ email: "John@doe.com" })).toBeNull();
    });
    test("rejects on duplicate email", async () => {
        await UserModel_1.User.create(u);
        u.name.first = "Jane";
        await expect(UserModel_1.User.create(u)).rejects.toThrow();
    });
});
//# sourceMappingURL=UserModel.test.js.map