"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const JWTService_1 = require("../services/JWTService");
const loginRouter = express_1.default.Router();
/**
 * @swagger
 * /api/login/:
 *  "post":
 *    "summary": "Login user"
 *    "description": "Endpoint to log in a user"
 *    "tags": [
 *      "User"
 *    ]
 *    "parameters": []
 *    "requestBody":
 *      "content":
 *        "application/json":
 *          "schema":
 *            "type": "object"
 *            "properties":
 *              "email":
 *                "type": "string"
 *              "password":
 *                "type": "string"
 *            "required":
 *              - "email"
 *              - "password"
 *          "example":
 *            "email": "John@doe.com"
 *            "password": "12abcAB!"
 *    "responses":
 *      "200":
 *        "description": "OK"
 *        "content":
 *          "application/json":
 *            "schema":
 *              "type": "object"
 *              "properties": {}
 *      "400":
 *        "description": "Bad Request - Validation Error"
 *        "content":
 *          "application/json":
 *            "schema":
 *              "type": "object"
 *              "properties":
 *                "error":
 *                  "type": "string"
 *                  "example": "Validation failed: Please provide a valid email and password."
 *      "401":
 *        "description": "Unauthorized - Missing JWT"
 *        "content":
 *          "application/json":
 *            "schema":
 *              "type": "object"
 *              "properties":
 *                "error":
 *                  "type": "string"
 *                  "example": "Unauthorized: No JWT token provided."
 *    "security":
 *      - "bearerAuth": []
 */
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