"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const comentSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    stars: {
        type: Number,
        required: true,
        validate: {
            validator: (value) => value >= 0 && value <= 5,
            message: "Stars must be between 0 and 5.",
        },
    },
    content: { type: String, required: true },
    edited: { type: Boolean, default: false },
    creator: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: mongoose_1.Schema.Types.ObjectId, ref: "Event", required: true },
}, { timestamps: true });
exports.Comment = (0, mongoose_1.model)("Comment", comentSchema);
//# sourceMappingURL=CommentModel.js.map