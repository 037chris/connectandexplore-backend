"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rating = exports.RatingType = void 0;
const mongoose_1 = require("mongoose");
var RatingType;
(function (RatingType) {
    RatingType["Helpful"] = "helpful";
    RatingType["Reported"] = "reported";
})(RatingType || (exports.RatingType = RatingType = {}));
const ratingSchema = new mongoose_1.Schema({
    comment: { type: mongoose_1.Schema.Types.ObjectId, ref: "Comment", required: true },
    creator: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    ratingType: { type: String, enum: Object.values(RatingType), required: true },
});
exports.Rating = (0, mongoose_1.model)("Rating", ratingSchema);
//# sourceMappingURL=RatingModel.js.map