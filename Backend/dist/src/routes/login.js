"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const JWTService_1 = require("../services/JWTService");
// Implementierung wird Teil eines nächsten Aufgabenblattes.
const loginRouter = express_1.default.Router();
/**
 * Diese Funktion bitte noch nicht implementieren, sie steht hier als Platzhalter.
 * Wir benötigen dafür Authentifizierungsinformationen, die wir später in einem JSW speichern.
 */
loginRouter.post("/", (0, express_validator_1.body)("email").isEmail(), (0, express_validator_1.body)("password").isStrongPassword(), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //const loginResource = matchedData(req) as LoginResource;
    const resource = (0, express_validator_1.matchedData)(req);
    const jwtstring = await (0, JWTService_1.verifyPasswordAndCreateJWT)(resource.email, resource.password);
    if (!jwtstring) {
        res.status(401);
        next(new Error("no jwtstring"));
    }
    const result = {
        access_token: jwtstring,
        token_type: "Bearer",
    };
    res.send(result);
});
exports.default = loginRouter;
//# sourceMappingURL=login.js.map