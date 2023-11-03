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
exports.UserService = void 0;
const UserModel_1 = require("../model/UserModel");
class UserService {
    registerUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user || typeof user !== 'object') {
                throw new Error('Invalid user data');
            }
            // Check if the user already exists in the database
            const { email } = user;
            const existingUser = yield UserModel_1.User.findOne({ email });
            if (existingUser) {
                throw new Error('User already exists');
            }
            // Create a new user
            try {
                console.log(user);
                const newUser = yield UserModel_1.User.create(user);
                return newUser;
            }
            catch (error) {
                console.log(error);
                throw new Error('Registration failed');
            }
        });
    }
}
exports.UserService = UserService;
exports.default = new UserService();
//# sourceMappingURL=UserService.js.map