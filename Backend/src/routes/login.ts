import express from "express";
import { body, matchedData, validationResult } from "express-validator";
import { LoginResource } from "../Resources";
import { verifyPasswordAndCreateJWT } from "../services/JWTService";

// Implementierung wird Teil eines nächsten Aufgabenblattes.

const loginRouter = express.Router();

/**
 * Diese Funktion bitte noch nicht implementieren, sie steht hier als Platzhalter.
 * Wir benötigen dafür Authentifizierungsinformationen, die wir später in einem JSW speichern.
 */
loginRouter.post(
  "/",
  body("email").isEmail().normalizeEmail(),
  body("password").isStrongPassword(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //const loginResource = matchedData(req) as LoginResource;
    const resource = matchedData(req);
    const jwtstring = await verifyPasswordAndCreateJWT(
      resource.email,
      resource.password,
    );
    if (!jwtstring) {
      res.status(401);
      next(new Error("no jwtstring"));
    }
    const result: LoginResource = {
      access_token: jwtstring!,
      token_type: "Bearer",
    };
    res.send(result);
  },
);

export default loginRouter;
