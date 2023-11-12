"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../model/UserModel");
const createAdminUser = async () => {
    const a = {
        street: "Street",
        houseNumber: "1",
        postalCode: "12345",
        city: "Berlin",
        country: "Germany",
    };
    let u = {
        email: "admin.team@connectandexplore.com",
        name: {
            first: "admin",
            last: "team",
        },
        password: "k.9MSn#JJh+§3F3a",
        isAdministrator: true,
        address: a,
        birthDate: new Date(),
        gender: "male",
        isActive: true,
        socialMediaUrls: {
            facebook: "facebook.com",
            instagram: "instagram.com",
        },
    };
    try {
        const user = await UserModel_1.User.create(u);
        console.log("Admin user created:");
    }
    catch (error) {
        console.error("Error creating admin user:", error);
    }
};
exports.default = createAdminUser;
//# sourceMappingURL=CreateAdminUser.js.map