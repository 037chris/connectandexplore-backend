"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const mongoose_1 = require("mongoose");
const CommentModel_1 = require("../model/CommentModel");
const UserModel_1 = require("../model/UserModel");
const ServiceHelper_1 = require("./ServiceHelper");
const EventModel_1 = require("../model/EventModel");
class CommentService {
    /**
     * finds all existing comments,
     * fills in creator and event name by populating documents.
     * skip and delete invalid comments before returning all comments?
     * (comments where event/creator is invalid/missing are invalid).
     * @returns all existing comments
     */
    async getComments() {
        const comments = (await CommentModel_1.Comment.find({})
            .populate("creator", "name")
            .populate("event", "name")
            .exec());
        const commentsToDelete = [];
        const filteredComments = comments.filter((comment) => {
            if (!comment.event || !comment.creator) {
                commentsToDelete.push(this.deleteComment(comment.id));
                return false;
            }
            else
                return true;
        });
        await Promise.all(commentsToDelete);
        const commentsResource = {
            comments: filteredComments.map((comment) => {
                /*
                    if (!comment.creator) {
                        throw new Error(`Comment with ID ${comment.id} has no creator.`);
                    }
                    if (!comment.event) {
                        throw new Error(`Comment with ID ${comment.id} has no event.`);
                    }
                    */
                return {
                    id: comment.id,
                    title: comment.title,
                    stars: comment.stars,
                    content: comment.content,
                    createdAt: (0, ServiceHelper_1.dateToString)(comment.createdAt),
                    creator: comment.creator._id.toString(),
                    creatorName: comment.creator.name,
                    event: comment.event._id.toString(),
                    eventName: comment.event.name,
                    edited: comment.edited,
                };
            }),
        };
        return commentsResource;
    }
    /**
     * populates the name of the event and sets the creatorName of every comment of the user.
     * @param userId specifies the user
     * @returns array of all comments from a user
     */
    async getCommentsOfUser(userId) {
        const user = await UserModel_1.User.findById(userId);
        if (!user) {
            throw new Error(`Invalid userId ${userId}, can not find Comment!`);
        }
        const comments = (await CommentModel_1.Comment.find({ creator: user.id })
            .populate("event", "name")
            .exec());
        const commentsToDelete = [];
        const filteredComments = comments.filter((comment) => {
            if (!comment.event) {
                commentsToDelete.push(this.deleteComment(comment.id));
                return false;
            }
            else
                return true;
        });
        await Promise.all(commentsToDelete);
        const commentsResource = {
            comments: filteredComments.map((comment) => {
                return {
                    id: comment.id,
                    title: comment.title,
                    stars: comment.stars,
                    content: comment.content,
                    createdAt: (0, ServiceHelper_1.dateToString)(comment.createdAt),
                    creator: user.id,
                    creatorName: user.name,
                    event: comment.event._id.toString(),
                    eventName: comment.event.name,
                    edited: comment.edited,
                };
            }),
        };
        return commentsResource;
    }
    async getCommentsOfEvent(eventId) {
        const event = await EventModel_1.Event.findById(eventId);
        if (!event) {
            throw new Error(`Invalid eventId ${eventId}, can not find Comment!`);
        }
        const comments = (await CommentModel_1.Comment.find({ event: event.id })
            .populate("creator", "name")
            .exec());
        const commentsToDelete = [];
        const filteredComments = comments.filter((comment) => {
            if (!comment.creator) {
                commentsToDelete.push(this.deleteComment(comment.id));
                return false;
            }
            else
                return true;
        });
        await Promise.all(commentsToDelete);
        const commentsResource = {
            comments: filteredComments.map((comment) => {
                return {
                    id: comment.id,
                    title: comment.title,
                    stars: comment.stars,
                    content: comment.content,
                    createdAt: (0, ServiceHelper_1.dateToString)(comment.createdAt),
                    creator: comment.creator._id.toString(),
                    creatorName: comment.creator.name,
                    event: event.id,
                    eventName: event.name,
                    edited: comment.edited,
                };
            }),
        };
        return commentsResource;
    }
    /**
     * used to create comments.
     * @param comment describes the comment
     * @returns the created comment with additional information (creatorName, eventName and date of creation).
     */
    async createComment(comment) {
        const user = await UserModel_1.User.findById(comment.creator);
        const event = await EventModel_1.Event.findById(comment.event);
        if (!user) {
            throw new Error(`No creator with id: ${comment.creator} exists, can not create comment.`);
        }
        if (!event) {
            throw new Error(`No event with id: ${comment.event} exists, can not create comment.`);
        }
        const createdComment = await CommentModel_1.Comment.create({
            title: comment.title,
            stars: comment.stars,
            content: comment.content,
            creator: user.id,
            creatorName: user.name,
            event: event.id,
            eventName: event.name,
        });
        const commentResource = {
            id: createdComment.id,
            title: createdComment.title,
            stars: createdComment.stars,
            content: createdComment.content,
            creator: user.id,
            creatorName: user.name,
            event: event.id,
            eventName: event.name,
            createdAt: (0, ServiceHelper_1.dateToString)(createdComment.createdAt),
            edited: createdComment.edited,
        };
        return commentResource;
    }
    /**
     * Updated ein Kommentar. Es können nur title, stars und content aktualisiert werden.
     * Edited wird auf true gesetzt.
     */
    async updateComment(comment) {
        if (!comment.id) {
            throw new Error(`CommentId missing, can not update.`);
        }
        const foundComment = await CommentModel_1.Comment.findById(comment.id).exec();
        if (!foundComment) {
            throw new Error(`No comment with id: ${comment.id} exists, can not update comment.`);
        }
        const user = await UserModel_1.User.findById(comment.creator);
        const event = await EventModel_1.Event.findById(comment.event);
        if (!user) {
            throw new Error(`No creator with id: ${comment.creator} exists, can not update comment.`);
        }
        if (!event) {
            throw new Error(`No event with id: ${comment.event} exists, can not update comment.`);
        }
        if (comment.title && comment.title != foundComment.title) {
            foundComment.title = comment.title;
            foundComment.edited = true;
        }
        if (comment.stars && comment.stars != foundComment.stars) {
            foundComment.stars = comment.stars;
            foundComment.edited = true;
        }
        if (comment.content && comment.content != foundComment.content) {
            foundComment.content = comment.content;
            foundComment.edited = true;
        }
        const commentResource = await foundComment.save();
        return {
            id: commentResource.id,
            title: commentResource.title,
            stars: commentResource.stars,
            content: commentResource.content,
            edited: commentResource.edited,
            createdAt: (0, ServiceHelper_1.dateToString)(commentResource.createdAt),
            creator: user.id,
            creatorName: user.name,
            event: event.id,
            eventName: event.name,
        };
    }
    /**
     * Deletes comment and all ratings of said comment.
     * @param id comment to be deleted.
     */
    async deleteComment(id) {
        if (!id) {
            throw new Error(`CommentId missing, can not delete.`);
        }
        const comment = await CommentModel_1.Comment.findById(id).exec();
        if (!comment) {
            throw new Error(`Comment ${id} does not exist, can not delete.`);
        }
        await CommentModel_1.Comment.deleteOne({ _id: new mongoose_1.Types.ObjectId(id) }).exec();
        /*const res = await Comment.deleteOne({ _id: new Types.ObjectId(id) }).exec();
        if (res.deletedCount !== 1) {
            throw new Error(`No comment with id ${id} deleted, probably id not valid`);
        }
        */
    }
    /**
     * used to delete all comments of a user who gets deleted.
     * comments of non exisiting users are not needed and are getting deleted.
     * @param userId identifies creator of comments
     */
    async deleteCommentsOfUser(userId) {
        /*
        if (!userId) {
            throw new Error(`UserId missing, can not delete comments of user.`);
        }
        const user = await User.findById(userId).exec();
        if (!user) {
            throw new Error(`User with id: ${userId} does not exist, can not delete comments of user`);
        }
        
        await Comment.deleteMany({ creator:user._id }).exec();
        */
        await CommentModel_1.Comment.deleteMany({ creator: userId }).exec();
    }
    /**
     * used to delete all Comments of a event that gets removed from database.
     * comments of non existing events are not needed and are getting deleted.
     * @param eventId specifies the event of which comments to be deleted.
     */
    async deleteCommentsOfevent(eventId) {
        /*
        if (!eventId) {
            throw new Error(`eventId missing, can not delete comments of event.`);
        }
        const event = await event.findById(eventId).exec();
        if (!event) {
            throw new Error(`event with id: ${eventId} does not exist, can not delete comments of event`);
        }
        
        await Comment.deleteMany({ event:event._id }).exec();
        */
        await CommentModel_1.Comment.deleteMany({ event: eventId }).exec();
    }
}
exports.CommentService = CommentService;
//# sourceMappingURL=CommentService.js.map