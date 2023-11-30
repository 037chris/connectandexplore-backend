"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("./authentication");
const express_validator_1 = require("express-validator");
const CommentService_1 = require("../services/CommentService");
const RatingService_1 = require("../services/RatingService");
const commentsRouter = express_1.default.Router();
const commentService = new CommentService_1.CommentService();
const ratingService = new RatingService_1.RatingService();
commentsRouter.get("/comments", authentication_1.requiresAuthentication, async (req, res, next) => {
    if (req.role !== "a") {
        try {
            const comments = await commentService.getComments();
            res.status(200).send(comments);
        }
        catch (err) {
            res.status(404);
            next(err);
        }
    }
    else {
        res.status(403);
        next(new Error("Unauthorized for this resource!"));
    }
});
commentsRouter.get("/event/:id/comments", (0, express_validator_1.param)("id").isMongoId(), async (req, res, next) => {
    var _a;
    const id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const comments = await commentService.getCommentsOfEvent(id);
        const commentsWithRatings = {
            comments: [],
        };
        for (const comment of comments.comments) {
            const ratings = await ratingService.getRatingsOfComment(comment.id);
            if (comment.creatorName) {
                let commentWithRatings = Object.assign(Object.assign({}, comment), { ratings: ratings });
                commentsWithRatings.comments.push(commentWithRatings);
            }
        }
        res.send(commentsWithRatings);
    }
    catch (err) {
        res.status(404);
        next(err);
    }
});
commentsRouter.get("/user/:id/comments", authentication_1.requiresAuthentication, (0, express_validator_1.param)("id").isMongoId(), async (req, res, next) => {
    try {
        const comments = await commentService.getComments();
        if (comments.comments.length < 1) {
            res.send(comments);
        }
        if (req.role === "a" || req.userId !== comments.comments[0].id) {
            //admin dashboard for comments of an user and user dashbaord of comments
            res.status(200).send(comments);
        }
        else {
            res.status(403);
            next(new Error("Unauthorized for this resource!"));
        }
    }
    catch (err) {
        res.status(404);
        next(err);
    }
});
commentsRouter.post("/comment", authentication_1.requiresAuthentication, (0, express_validator_1.body)("title").isString().isLength({ min: 1, max: 100 }), (0, express_validator_1.body)("stars")
    .isInt()
    .custom((stars) => stars >= 1 && stars <= 5), (0, express_validator_1.body)("content").isString().isLength({ min: 0, max: 1000 }), (0, express_validator_1.body)("creator").isMongoId(), (0, express_validator_1.body)("edited").optional().isBoolean(), (0, express_validator_1.body)("event").isMongoId(), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (req.role !== "u") {
        res.status(403);
        next(new Error("Only users are authorized to create comments!"));
    }
    try {
        const commentData = (0, express_validator_1.matchedData)(req);
        const createdComment = await commentService.createComment(commentData);
        res.status(201).send(createdComment);
    }
    catch (err) {
        res.status(400);
        next(err);
    }
});
commentsRouter.put("/comment/:id", authentication_1.requiresAuthentication, (0, express_validator_1.body)("title").isString().isLength({ min: 1, max: 100 }), (0, express_validator_1.body)("stars")
    .isInt()
    .custom((stars) => stars >= 1 && stars <= 5), (0, express_validator_1.body)("content").isString().isLength({ min: 0, max: 1000 }), (0, express_validator_1.body)("creator").isMongoId(), (0, express_validator_1.body)("edited").optional().isBoolean(), (0, express_validator_1.body)("event").isMongoId(), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (req.role === "u" && req.body.creator !== req.userId) {
        res.status(403);
        next(new Error("Only admins or the creator are authorized to update comments!"));
    }
    try {
        const commentData = (0, express_validator_1.matchedData)(req);
        const createdComment = await commentService.updateComment(commentData);
        res.status(200).send(createdComment);
    }
    catch (err) {
        res.status(400);
        next(err);
    }
});
commentsRouter.delete("/comment/:id", (0, express_validator_1.param)("id"), authentication_1.requiresAuthentication, async (req, res, next) => {
    var _a;
    const id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
    if (req.role === "u" && req.body.creator !== req.userId) {
        res.status(403);
        next(new Error("Only Admins and the creator of the comment are authorized to delete comments!"));
    }
    try {
        await ratingService.deleteRatingsOfComment(id);
        await commentService.deleteComment(id);
        res.sendStatus(204);
    }
    catch (err) {
        res.status(404);
        next(err);
    }
});
exports.default = commentsRouter;
//# sourceMappingURL=Comments.js.map