"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthentication = exports.requiresAuthentication = void 0;
const JWTService_1 = require("../services/JWTService");
/**
 * Prüft Authentifizierung und schreibt `userId` mit Mongo-ID des Users und `role` mit Kürzel der Rolle in den Request.
 * Falls Authentifizierung fehlschlägt, wird ein Fehler (401) erzeugt.
 */
async function requiresAuthentication(req, res, next) {
    try {
        const authorization = req.headers.authorization;
        if (authorization && authorization.startsWith("Bearer ")) {
            const token = authorization.substring("Bearer ".length);
            const { userId, role } = (0, JWTService_1.verifyJWT)(token);
            if (!userId || !role) {
                res.status(401);
                return next(new Error("Authentication Failed"));
            }
            req.userId = userId;
            req.role = role;
            next();
        }
        else {
            res.status(401);
            res.setHeader("WWW-Authenticate", ["Bearer", 'realm="app"']);
            next(new Error("authentication required!"));
        }
    }
    catch (err) {
        res.status(401);
        res.setHeader("WWW-Authenticate", [
            "Bearer",
            'realm="app"',
            'error="invalid_token"',
        ]);
        next(err);
    }
}
exports.requiresAuthentication = requiresAuthentication;
/**
 * Prüft Authentifizierung und schreibt `userId` mit Mongo-ID des Users und `role` mit Kürzel der Rolle in den Request.
 * Falls kein JSON-Web-Token im Request-Header vorhanden ist, wird kein Fehler erzeugt (und auch nichts in den Request geschrieben).
 * Falls Authentifizierung fehlschlägt, wird ein Fehler (401) erzeugt.
 */
async function optionalAuthentication(req, res, next) {
    const authorization = req.headers.authorization;
    if (authorization) {
        try {
            const token = authorization.split(" ")[1];
            const { userId, role } = (0, JWTService_1.verifyJWT)(token);
            if (!userId || !role) {
                res.status(401);
                return next(new Error("Authentication Failed"));
            }
            req.userId = userId;
            req.role = role;
            next();
        }
        catch (err) {
            res.status(401);
            next(err);
        }
    }
    else {
        next();
    }
}
exports.optionalAuthentication = optionalAuthentication;
//# sourceMappingURL=authentication.js.map