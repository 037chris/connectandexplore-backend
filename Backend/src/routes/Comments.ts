import express from "express";
import {
  optionalAuthentication,
  requiresAuthentication,
} from "./authentication";
import { body, matchedData, param, validationResult } from "express-validator";
import {
  CommentResource,
  CommentWithRatingsResource,
  CommentsWithRatingsResource,
} from "../Resources";
import { CommentService } from "../services/CommentService";
import { RatingService } from "../services/RatingService";
import { Comment } from "../model/CommentModel";

const commentsRouter = express.Router();

const commentService: CommentService = new CommentService();
const ratingService: RatingService = new RatingService();

commentsRouter.get("/", requiresAuthentication, async (req, res, next) => {
  if (req.role === "a") {
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
});
/**
 * @swagger
 * /api/comments/event/{id}:
 *   get:
 *     summary: Get all comments of an event
 *     description: Retrieve all comments associated with a specific event.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to retrieve comments for
 *         schema:
 *           type: string
 *           format: mongo-id
 *     responses:
 *       '200':
 *         description: Successful response with comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IComment'
 *       '404':
 *         description: Event not found or no comments exist for the event
 *         content:
 *           application/json:
 *             example:
 *               error: Event not found or no comments exist for the event
 */

commentsRouter.get(
  "/event/:id",
  optionalAuthentication,
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
  }
);

commentsRouter.get(
  "/user/:id",
  requiresAuthentication,
  param("id").isMongoId(),
  async (req, res, next) => {
    try {
      const comments = await commentService.getComments();
      if (comments.comments.length < 1) {
        res.send(comments);
      }
      if (req.role === "a" /* || req.userId !== comments.comments[0].id */) {
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
  }
);
/**
 * @swagger
 * /api/comments/post:
 *   post:
 *     summary: Create a new comment
 *     description: Endpoint to create a new comment.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Amazing"
 *                 description: "Title of the comment (max length: 100)"
 *               stars:
 *                 type: integer
 *                 example: 4
 *                 description: "Number of stars (1-5)"
 *               content:
 *                 type: string
 *                 example: "The best Event that i have joined in my entire life"
 *                 description: "Content of the comment (max length: 1000)"
 *               creator:
 *                 type: string
 *                 format: mongo-id
 *                 description: "ID of the comment creator (User ID)"
 *               edited:
 *                 type: boolean
 *                 default: false
 *                 description: "Indicates if the comment has been edited"
 *               event:
 *                 type: string
 *                 format: mongo-id
 *                 description: "ID of the associated event"
 *             required:
 *               - title
 *               - stars
 *               - content
 *               - creator
 *               - event
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IComment'
 *       '400':
 *         description: Bad request, validation error or other errors
 *         content:
 *           application/json:
 *             examples:
 *               BadRequestExample1:
 *                 summary: User has already submitted a comment for this event
 *                 value:
 *                   error: User has already submitted a comment for this event
 *               BadRequestExample2:
 *                 summary: No creator/event with the given ID exists
 *                 value:
 *                   error: No creator/event with the given ID exists
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               error: Only users are authorized to create comments!
 */
commentsRouter.post(
  "/post",
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
  }
);

commentsRouter.put(
  "/:id",
  requiresAuthentication,
  param("id").isMongoId(),
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
          "Only admins or the creator are authorized to update comments!"
        )
      );
    }
    try {
      const commentData = matchedData(req) as CommentResource;
      if (commentData.id === req.params.id) commentData.id = req.params.id;
      const createdComment = await commentService.updateComment(commentData);
      res.status(200).send(createdComment);
    } catch (err) {
      res.status(400);
      next(err);
    }
  }
);

commentsRouter.delete(
  "/:id",
  requiresAuthentication,
  param("id").isMongoId(),
  async (req, res, next) => {
    const id = req.params.id;
    const comment = await Comment.findById(id).exec();
    if (req.role === "u" && comment.creator.toString() !== req.userId) {
      res.status(403);
      next(
        new Error(
          "Only Admins and the creator of the comment are authorized to delete comments!"
        )
      );
      return;
    }
    try {
      await ratingService.deleteRatingsOfComment(id);
      await commentService.deleteComment(id);
      res.sendStatus(204);
    } catch (err) {
      res.status(404);
      next(err);
    }
  }
);

export default commentsRouter;
