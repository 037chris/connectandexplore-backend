import express from "express";
import {
  body,
  check,
  matchedData,
  param,
  validationResult,
} from "express-validator";
import { UserService } from "../services/UserService";
import { upload } from "../utils/FileUpload";
import { requiresAuthentication } from "./authentication";
import { userResource } from "../Resources";
const UserRouter = express.Router();
const userService = new UserService();

UserRouter.post(
  "/register",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      console.log(req.body);
      if (req.file) {
        console.log(req.file.filename);
        req.body.profilePicture = `/uploads/${req.file.filename}`;
        console.log(req.body);
      }
      const newUser = await userService.registerUser(req.body);
      return res.status(201).json(newUser);
    } catch (error) {
      if (error.message === "User already exists") {
        return res.status(409).json({ Error: "User already exists" });
      } else {
        return res.status(500).json({ Error: "Registration failed" });
      }
    }
  },
);

UserRouter.get(
  "/:userid",
  requiresAuthentication,
  param("userid").isMongoId(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userid = req.params.userid;
    if (req.role !== "a" || userid !== req.userId) {
      res.status(403);
      next(new Error("Invalid authorization, can not get User."));
    } else {
      try {
        const user: userResource = await userService.getUser(userid);
      } catch (err) {
        res.status(404);
        next(err);
      }
    }
  },
);

UserRouter.put(
  "/:userid",
  requiresAuthentication,
  body("email").isEmail().normalizeEmail(),
  body("isAdministrator").isBoolean(),
  body("password").isStrongPassword(),
  body("oldPassword").isStrongPassword(),
  body("name.first")
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage("First name is required."),
  body("name.last")
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage("Last name is required."),
  body("address.street").notEmpty().withMessage("Street address is required."),
  body("address.houseNumber")
    .notEmpty()
    .withMessage("House number is required."),
  body("address.postalCode").notEmpty().withMessage("Postal code is required."),
  body("address.city").notEmpty().withMessage("City is required."),
  body("address.country").notEmpty().withMessage("Country is required."),
  body("address.stateOrRegion")
    .optional()
    .isString()
    .withMessage("invalid State or Region."),
  body("address.appartmentNumber")
    .optional()
    .isString()
    .withMessage("invalid Appartmentnumber."),
  body("profilePicture").optional().isString(), //??
  body("birthDate").isDate(),
  body("gender").isString().notEmpty(), //isString() ist vlt unnötig
  body("socialMediaUrls.facebook").isString().notEmpty(),
  body("socialMediaUrls.instagram").isString().notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userid = req.params.userid;
    const userResource = matchedData(req) as userResource;
    userResource.id = userid;
    if (req.role === "a") {
      try {
        const updatedUser: userResource =
          await userService.updateUserWithAdmin(userResource);
        res.status(200).send(updatedUser);
      } catch (err) {
        res.status(404);
        next(err);
      }
    } else {
      if (req.userId !== userid) {
        res.status(403);
        next(new Error("Invalid authorization, can not update user."));
      } else {
        try {
          const oldPw = req.body.oldPassword;
          const updatedUser = await userService.updateUserWithPw(
            userResource,
            oldPw,
          );
          res.status(200).send(updatedUser);
        } catch (err) {
          res.status(403);
          next(new Error("Invalid authorization, probably invalid password."));
        }
      }
    }
  },
);
export default UserRouter;
