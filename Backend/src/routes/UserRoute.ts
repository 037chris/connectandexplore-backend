import express from "express";
import { body, check, validationResult } from "express-validator";
import { UserService } from "../services/UserService";
import { upload } from "../utils/FileUpload";
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
  }
);

export default UserRouter;
