import express from "express";
import fs from "fs";
import {
  body,
  check,
  matchedData,
  param,
  validationResult,
} from "express-validator";
import { UserService } from "../services/UserService";
import { upload, deleteProfilePicture } from "../utils/FileUpload";
import { requiresAuthentication } from "./authentication";
import { userResource } from "../Resources";
const UserRouter = express.Router();
const userService = new UserService();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with user data and an optional profile picture.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: object
 *                 properties:
 *                   first:
 *                     type: string
 *                   last:
 *                     type: string
 *               password:
 *                 type: string
 *               isAdministrator:
 *                 type: boolean
 *               address:
 *                 $ref: '#/components/schemas/IAddress'
 *               profilePicture:
 *                 type: file
 *               birthDate:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               socialMediaUrls:
 *                 type: object
 *                 properties:
 *                   facebook:
 *                     type: string
 *                   instagram:
 *                     type: string
 *             required:
 *               - email
 *               - name
 *               - password
 *               - birthDate
 *               - gender
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IUser'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             example:
 *               Error: User already exists
 *       500:
 *         description: Registration failed
 *         content:
 *           application/json:
 *             example:
 *               Error: Registration failed
 */
UserRouter.post(
  "/register",
  upload.single("profilePicture"),
  [
    body("email").isEmail(),
    body("name.first")
      .isString()
      .isLength({ min: 3, max: 100 })
      .withMessage("First name is required."),
    body("name.last")
      .isString()
      .isLength({ min: 3, max: 100 })
      .withMessage("Last name is required."),
    body("password").isStrongPassword(),
    body("isAdministrator").optional().isBoolean(),
    body("address.street")
      .notEmpty()
      .withMessage("Street address is required."),
    body("address.houseNumber")
      .notEmpty()
      .withMessage("House number is required."),
    body("address.postalCode")
      .notEmpty()
      .withMessage("Postal code is required."),
    body("address.city").notEmpty().withMessage("City is required."),
    body("address.country").notEmpty().withMessage("Country is required."),
    body("address.stateOrRegion")
      .optional()
      .isString()
      .withMessage("Invalid State or Region."),
    body("address.apartmentNumber")
      .optional()
      .isString()
      .withMessage("Invalid Apartment number."),
    body("profilePicture").optional().isString(),
    body("birthDate").isDate(),
    body("gender").isString().notEmpty(),
    body("socialMediaUrls.facebook").optional().isString(),
    body("socialMediaUrls.instagram").optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (req.file) {
          // Delete the file
          deleteProfilePicture(req.file.path);
        }
        return res.status(400).json({ errors: errors.array() });
      } else {
        if (req.file) {
          req.body.profilePicture = `/uploads/${req.file.filename}`;
        }
        const newUser = await userService.registerUser(req.body);
        return res.status(201).json(newUser);
      }
    } catch (error) {
      if (error.message === "User already exists") {
        return res.status(409).json({ Error: "User already exists" });
      } else {
        return res.status(500).json({ Error: "Registration failed" });
      }
    }
  }
);

UserRouter.get(
  "/:userid",
  requiresAuthentication,
  param("userid").isMongoId(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userid = req.params.userid;
    if (req.role !== "a" && userid !== req.userId) {
      res.status(403);
      next(new Error("Invalid authorization, can not get User."));
    } else {
      try {
        const user: userResource = await userService.getUser(userid);
        res.status(200).json(user);
      } catch (err) {
        res.status(404);
        next(err);
      }
    }
  }
);

UserRouter.put(
  "/:userid",
  requiresAuthentication,
  upload.single("profilePicture"),
  [
    param("userid").isMongoId(),
    body("email").isEmail(),
    body("isAdministrator").isBoolean(),
    body("password").optional().isStrongPassword(),
    body("oldPassword").optional().isStrongPassword(),
    body("name.first")
      .isString()
      .isLength({ min: 3, max: 100 })
      .withMessage("First name is required."),
    body("name.last")
      .isString()
      .isLength({ min: 3, max: 100 })
      .withMessage("Last name is required."),
    body("address.street")
      .notEmpty()
      .withMessage("Street address is required."),
    body("address.houseNumber")
      .notEmpty()
      .withMessage("House number is required."),
    body("address.postalCode")
      .notEmpty()
      .withMessage("Postal code is required."),
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
    body("birthDate").isString(), //throws errors on date when isDate()
    body("gender").isString().notEmpty(), //isString() ist vlt unnötig
    body("socialMediaUrls.facebook").isString().notEmpty(),
    body("socialMediaUrls.instagram").isString().notEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        // Delete the file
        deleteProfilePicture(req.file.path);
      }
      return res.status(400).json({ errors: errors.array() });
    }
    const userid = req.params.userid;
    if (req.role === "a" || userid === req.userId) {
      const user: userResource = await userService.getUser(userid);
      try {
        if (req.file) {
          req.body.profilePicture = `/uploads/${req.file.filename}`;
          if (user.profilePicture) {
            deleteProfilePicture(user.profilePicture);
          }
        }
      } catch (err) {
        deleteProfilePicture(req.body.profilePicture);
        res.status(404).json({
          Error: "Can not delete Profile picture - no such file or directory",
        });
      }
    }
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
            oldPw
          );
          res.status(200).send(updatedUser);
        } catch (err) {
          res.status(403);
          next(new Error("Invalid authorization, probably invalid password."));
        }
      }
    }
  }
);

UserRouter.delete(
  "/:userid",
  requiresAuthentication,
  param("userid").isMongoId(),
  async (req, res, next) => {
    const userid = req.params.userid;
    try {
      if (req.role === "a") {
        const isDeleted: boolean = await userService.deleteUser(userid, false);
        res.status(204).send(isDeleted);
      } else {
        if (req.userId === userid) {
          const isDeleted: boolean = await userService.deleteUser(userid, true);
          res.status(204).send(isDeleted);
        } else {
          res.send(403);
          next(new Error("Invalid authorization, can not delete user."));
        }
      }
    } catch (err) {
      res.send(404);
      next(new Error("Probably invalid userid, can not delete user."));
    }
  }
);
export default UserRouter;
