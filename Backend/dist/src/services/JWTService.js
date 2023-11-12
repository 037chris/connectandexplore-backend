"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.verifyPasswordAndCreateJWT = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const UserModel_1 = require("../model/UserModel");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * @param email E-Mail-Adresse des Users
 * @param password Das Passwort des Users
 * @returns JWT als String, im JWT ist sub gesetzt mit der Mongo-ID des Users als String sowie role mit "u" oder "a" (User oder Admin);
 *      oder undefined wenn Authentifizierung fehlschlägt.
 */
async function verifyPasswordAndCreateJWT(email, password) {
    const users = await UserModel_1.User.find({ email: email, isActive: true }).exec();
    if (!users || users.length != 1) {
        return undefined;
    }
    const user = users[0];
    if (!(await user.isCorrectPassword(password))) {
        return undefined;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET not set");
    }
    const timeInSec = Math.floor(Date.now() / 1000);
    const ttl = process.env.JWT_TTL;
    if (!ttl) {
        throw new Error("TTL not set");
    }
    const exp = timeInSec + parseInt(ttl);
    const role = user.isAdministrator ? "a" : "u";
    const payload = {
        sub: user.id,
        iat: timeInSec,
        exp: exp,
        role: role,
    };
    const jwtString = (0, jsonwebtoken_1.sign)(payload, secret, { algorithm: "HS256" });
    return jwtString;
}
exports.verifyPasswordAndCreateJWT = verifyPasswordAndCreateJWT;
/**
 * Gibt user id (Mongo-ID) und ein Kürzel der Rolle zurück, falls Verifizierung erfolgreich, sonst wird ein Error geworfen.
 *
 * Die zur Prüfung der Signatur notwendige Passphrase wird aus der Umgebungsvariable `JWT_SECRET` gelesen,
 * falls diese nicht gesetzt ist, wird ein Fehler geworfen.
 *
 * @param jwtString das JWT
 * @return user id des Users (Mongo ID als String) und Rolle (u oder a) des Benutzers;
 *      niemals undefined (bei Fehler wird ein Error geworfen)
 */
function verifyJWT(jwtString) {
    var _a;
    if (!jwtString) {
        throw new Error("No JWT-string");
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET not set");
    }
    try {
        const payload = (0, jsonwebtoken_1.verify)(jwtString, secret);
        if (typeof payload === "object" && "sub" in payload && payload.sub) {
            const result = { userId: (_a = payload.sub) === null || _a === void 0 ? void 0 : _a.toString(), role: payload.role };
            return result;
        }
    }
    catch (err) {
        throw new Error("verify_error");
    }
    throw new Error("invalid_token");
}
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=JWTService.js.map