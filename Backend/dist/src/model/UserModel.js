"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.addressSchema = exports.userRole = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
var userRole;
(function (userRole) {
    userRole["User"] = "u";
    userRole["Admin"] = "a";
})(userRole || (exports.userRole = userRole = {}));
/**
 * Adressen werden später in das UserSchema eingefügt und als teil eines Users in mongoDB gespeichert
 */
exports.addressSchema = new mongoose_1.Schema({
    street: { type: String, required: true },
    houseNumber: { type: String, required: true },
    apartmentNumber: String,
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    stateOrRegion: String,
    country: { type: String, required: true },
});
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
    },
    password: { type: String, required: true },
    isAdministrator: { type: Boolean, default: false },
    address: exports.addressSchema,
    profilePicture: String,
    birthDate: { type: Date, required: true },
    gender: { type: String, required: true },
    socialMediaUrls: {
        facebook: String,
        instagram: String,
    },
    isActive: { type: Boolean, default: true },
});
userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        const hashedPassword = await bcryptjs_1.default.hash(this.password, 10);
        this.password = hashedPassword;
    }
});
userSchema.pre("updateOne", { document: false, query: true }, async function () {
    const update = this.getUpdate();
    if ((update === null || update === void 0 ? void 0 : update.password) != null) {
        const hashedPassword = await bcryptjs_1.default.hash(update.password, 10);
        update.password = hashedPassword;
    }
});
userSchema.method("isCorrectPassword", async function (password) {
    const isPW = await bcryptjs_1.default.compare(password, this.password);
    return isPW;
});
exports.User = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=UserModel.js.map