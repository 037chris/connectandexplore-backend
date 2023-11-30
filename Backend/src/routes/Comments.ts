import express from "express";
import { requiresAuthentication } from "./authentication";
import { body, matchedData, param, validationResult } from "express-validator";
import {
  CommentResource,
  CommentWithRatingsResource,
  CommentsWithRatingsResource,
} from "../Resources";
import { CommentService } from "../services/CommentService";
import { RatingService } from "../services/RatingService";

const commentsRouter = express.Router();

const commentService: CommentService = new CommentService();
const ratingService: RatingService = new RatingService();

commentsRouter.get(
  "/comments",
  requiresAuthentication,
  async (req, res, next) => {
    if (req.role !== "a") {
      try {
        const comments = await commentService.getComments();
        res.status(200).send(comments);
      } catch (err) {
        res.status(404);
        next(err);
      }
    } else {
      res.status(403);
      next(new Error("Unauthorized for this resource!"));
    }
  },
);

commentsRouter.get(
  "/event/:id/comments",
  param("id").isMongoId(),
  async (req, res, next) => {
    const id = req.params?.id;
    try {
      const comments = await commentService.getCommentsOfEvent(id);
      const commentsWithRatings: CommentsWithRatingsResource = {
        comments: [],
      };
      for (const comment of comments.comments) {
        const ratings = await ratingService.getRatingsOfComment(comment.id!);
        if (comment.creatorName) {
          let commentWithRatings: CommentWithRatingsResource = {
            ...comment,
            ratings: ratings,
          };
          commentsWithRatings.comments.push(commentWithRatings);
        }
      }
      res.send(commentsWithRatings);
    } catch (err) {
      res.status(404);
      next(err);
    }
  },
);

commentsRouter.get(
  "/user/:id/comments",
  requiresAuthentication,
  param("id").isMongoId(),
  async (req, res, next) => {
    try {
      const comments = await commentService.getComments();
      if (comments.comments.length < 1) {
        res.send(comments);
      }
      if (req.role === "a" || req.userId !== comments.comments[0].id) {
        //admin dashboard for comments of an user and user dashbaord of comments
        res.status(200).send(comments);
      } else {
        res.status(403);
        next(new Error("Unauthorized for this resource!"));
      }
    } catch (err) {
      res.status(404);
      next(err);
    }
  },
);

commentsRouter.post(
  "/comment",
  requiresAuthentication,
  body("title").isString().isLength({ min: 1, max: 100 }),
  body("stars")
    .isInt()
    .custom((stars) => stars >= 1 && stars <= 5),
  body("content").isString().isLength({ min: 0, max: 1000 }),
  body("creator").isMongoId(),
  body("edited").optional().isBoolean(),
  body("event").isMongoId(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.role !== "u") {
      res.status(403);
      next(new Error("Only users are authorized to create comments!"));
    }
    try {
      const commentData = matchedData(req) as CommentResource;
      const createdComment = await commentService.createComment(commentData);
      res.status(201).send(createdComment);
    } catch (err) {
      res.status(400);
      next(err);
    }
  },
);

commentsRouter.put(
  "/comment/:id",
  requiresAuthentication,
  body("title").isString().isLength({ min: 1, max: 100 }),
  body("stars")
    .isInt()
    .custom((stars) => stars >= 1 && stars <= 5),
  body("content").isString().isLength({ min: 0, max: 1000 }),
  body("creator").isMongoId(),
  body("edited").optional().isBoolean(),
  body("event").isMongoId(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.role === "u" && req.body.creator !== req.userId) {
      res.status(403);
      next(
        new Error(
          "Only admins or the creator are authorized to update comments!",
        ),
      );
    }
    try {
      const commentData = matchedData(req) as CommentResource;
      const createdComment = await commentService.updateComment(commentData);
      res.status(200).send(createdComment);
    } catch (err) {
      res.status(400);
      next(err);
    }
  },
);

commentsRouter.delete(
  "/comment/:id",
  param("id"),
  requiresAuthentication,
  async (req, res, next) => {
    const id = req.params?.id;
    if (req.role === "u" && req.body.creator !== req.userId) {
      res.status(403);
      next(
        new Error(
          "Only Admins and the creator of the comment are authorized to delete comments!",
        ),
      );
    }
    try {
      await ratingService.deleteRatingsOfComment(id);
      await commentService.deleteComment(id);
      res.sendStatus(204);
    } catch (err) {
      res.status(404);
      next(err);
    }
  },
);

export default commentsRouter;