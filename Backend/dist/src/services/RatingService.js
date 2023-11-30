"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingService = void 0;
const UserModel_1 = require("../model/UserModel");
const CommentModel_1 = require("../model/CommentModel");
const RatingModel_1 = require("../model/RatingModel");
const mongoose_1 = require("mongoose");
class RatingService {
    async getRatingsOfComment(commentId) {
        const comment = await CommentModel_1.Comment.findById(commentId).exec();
        if (!comment) {
            throw new Error(`No comment with id: ${commentId} of rating found.`);
        }
        const ratings = await RatingModel_1.Rating.find({ comment: commentId }).exec();
        const result = {
            ratings: ratings.map((rating) => {
                const r = {
                    id: rating.id,
                    comment: comment.id,
                    creator: rating.creator.toString(),
                    ratingType: rating.ratingType,
                };
                return r;
            }),
        };
        return result;
    }
    async createRating(rating) {
        const user = await UserModel_1.User.findById(rating.creator).exec();
        if (!user) {
            throw new Error(`No creator with id: ${rating.creator} of rating found. Can not create Rating.`);
        }
        const comment = await CommentModel_1.Comment.findById(rating.comment).exec();
        if (!comment) {
            throw new Error(`No comment with id: ${rating.comment} of rating found. Can not create Rating.`);
        }
        const createdRating = await RatingModel_1.Rating.create(rating);
        const res = Object.assign(Object.assign({}, rating), { id: createdRating.id });
        return res;
    }
    async updateRating(rating) {
        if (!rating.id) {
            throw new Error(`No ratingId:${rating.id} found, can not update rating`);
        }
        const recievedRating = await RatingModel_1.Rating.findById(rating.id).exec();
        if (!recievedRating) {
            throw new Error(`No rating with id:${rating.id} found, can not update rating`);
        }
        const user = await UserModel_1.User.findById({
            _id: new mongoose_1.Types.ObjectId(rating.creator),
        }).exec();
        if (!user) {
            throw new Error(`No creator with id: ${rating.creator} of rating found. Can not update rating.`);
        }
        const comment = await CommentModel_1.Comment.findById({
            _id: new mongoose_1.Types.ObjectId(rating.comment),
        }).exec();
        if (!comment) {
            throw new Error(`No comment with id: ${rating.comment} of rating found. Can not update rating.`);
        }
        if (rating.ratingType)
            recievedRating.ratingType = rating.ratingType;
        const res = await recievedRating.save();
        return {
            id: res.id,
            comment: res.comment.toString(),
            creator: res.creator.toString(),
            ratingType: res.ratingType,
        };
    }
    async deleteRating(id) {
        if (!id) {
            throw new Error(`RatingId missing, can not delete.`);
        }
        const res = await RatingModel_1.Rating.deleteOne({ _id: new mongoose_1.Types.ObjectId(id) }).exec();
        if (res.deletedCount !== 1) {
            throw new Error(`No rating with id ${id} deleted, probably id not valid`);
        }
    }
    async deleteRatingsOfUser(userId) {
        if (!userId) {
            throw new Error(`UserId missing, can not delete.`);
        }
        const user = await UserModel_1.User.findById(userId).exec();
        if (!user) {
            throw new Error(`User with id: ${userId} missing, can not delete.`);
        }
        await RatingModel_1.Rating.deleteMany({ creator: userId }).exec();
    }
    async deleteRatingsOfComment(commentId) {
        if (!commentId) {
            throw new Error(`CommentId missing, can not delete.`);
        }
        const comment = await CommentModel_1.Comment.findById(commentId).exec();
        if (!comment) {
            throw new Error(`Comment with id: ${commentId} missing, can not delete.`);
        }
        await RatingModel_1.Rating.deleteMany({ comment: new mongoose_1.Types.ObjectId(commentId) }).exec();
    }
}
exports.RatingService = RatingService;
//# sourceMappingURL=RatingService.js.map