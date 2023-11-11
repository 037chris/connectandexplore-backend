"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const UserService_1 = require("../services/UserService");
const FileUpload_1 = require("../utils/FileUpload");
const authentication_1 = require("./authentication");
const UserRouter = express_1.default.Router();
const userService = new UserService_1.UserService();
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
UserRouter.post("/register", FileUpload_1.upload.single("profilePicture"), async (req, res) => {
    try {
        if (req.file) {
            req.body.profilePicture = `/uploads/${req.file.filename}`;
        }
        const newUser = await userService.registerUser(req.body);
        return res.status(201).json(newUser);
    }
    catch (error) {
        if (error.message === "User already exists") {
            return res.status(409).json({ Error: "User already exists" });
        }
        else {
            return res.status(500).json({ Error: "Registration failed" });
        }
    }
});
UserRouter.get("/:userid", authentication_1.requiresAuthentication, (0, express_validator_1.param)("userid").isMongoId(), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userid = req.params.userid;
    if (req.role !== "a" || userid !== req.userId) {
        res.status(403);
        next(new Error("Invalid authorization, can not get User."));
    }
    else {
        try {
            const user = await userService.getUser(userid);
        }
        catch (err) {
            res.status(404);
            next(err);
        }
    }
});
UserRouter.put("/:userid", authentication_1.requiresAuthentication, (0, express_validator_1.body)("email").isEmail().normalizeEmail(), (0, express_validator_1.body)("isAdministrator").isBoolean(), (0, express_validator_1.body)("password").isStrongPassword(), (0, express_validator_1.body)("oldPassword").isStrongPassword(), (0, express_validator_1.body)("name.first")
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage("First name is required."), (0, express_validator_1.body)("name.last")
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage("Last name is required."), (0, express_validator_1.body)("address.street").notEmpty().withMessage("Street address is required."), (0, express_validator_1.body)("address.houseNumber")
    .notEmpty()
    .withMessage("House number is required."), (0, express_validator_1.body)("address.postalCode").notEmpty().withMessage("Postal code is required."), (0, express_validator_1.body)("address.city").notEmpty().withMessage("City is required."), (0, express_validator_1.body)("address.country").notEmpty().withMessage("Country is required."), (0, express_validator_1.body)("address.stateOrRegion")
    .optional()
    .isString()
    .withMessage("invalid State or Region."), (0, express_validator_1.body)("address.appartmentNumber")
    .optional()
    .isString()
    .withMessage("invalid Appartmentnumber."), (0, express_validator_1.body)("profilePicture").optional().isString(), //??
(0, express_validator_1.body)("birthDate").isDate(), (0, express_validator_1.body)("gender").isString().notEmpty(), //isString() ist vlt unnötig
(0, express_validator_1.body)("socialMediaUrls.facebook").isString().notEmpty(), (0, express_validator_1.body)("socialMediaUrls.instagram").isString().notEmpty(), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userid = req.params.userid;
    const userResource = (0, express_validator_1.matchedData)(req);
    userResource.id = userid;
    if (req.role === "a") {
        try {
            const updatedUser = await userService.updateUserWithAdmin(userResource);
            res.status(200).send(updatedUser);
        }
        catch (err) {
            res.status(404);
            next(err);
        }
    }
    else {
        if (req.userId !== userid) {
            res.status(403);
            next(new Error("Invalid authorization, can not update user."));
        }
        else {
            try {
                const oldPw = req.body.oldPassword;
                const updatedUser = await userService.updateUserWithPw(userResource, oldPw);
                res.status(200).send(updatedUser);
            }
            catch (err) {
                res.status(403);
                next(new Error("Invalid authorization, probably invalid password."));
            }
        }
    }
});
UserRouter.delete("/:userid", authentication_1.requiresAuthentication, (0, express_validator_1.param)("userid").isMongoId(), async (req, res, next) => {
    const userid = req.params.userid;
    try {
        if (req.role === "a") {
            const isDeleted = await userService.deleteUser(userid, false);
            res.status(204).send(isDeleted);
        }
        else {
            if (req.userId === userid) {
                const isDeleted = await userService.deleteUser(userid, true);
                res.status(204).send(isDeleted);
            }
            else {
                res.send(403);
                next(new Error("Invalid authorization, can not delete user."));
            }
        }
    }
    catch (err) {
        res.send(403);
        next(new Error("Invalid authorization, can not delete user."));
    }
});
exports.default = UserRouter;
//# sourceMappingURL=UserRoute.js.map