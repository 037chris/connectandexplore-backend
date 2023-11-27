"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categoty = exports.Event = void 0;
const mongoose_1 = require("mongoose");
const UserModel_1 = require("./UserModel");
const categorySchema = new mongoose_1.Schema({
<<<<<<< HEAD
    name: { type: String, required: true, unique: true },
=======
    name: { type: String, required: true /* , unique: true */ },
>>>>>>> main
    description: { type: String },
});
const eventSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    creator: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    address: UserModel_1.addressSchema,
    thumbnail: { type: String },
    hashtags: [{ type: String }],
<<<<<<< HEAD
    category: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Category" }],
    chat: { type: mongoose_1.Schema.Types.ObjectId, ref: "Chat", required: true },
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
=======
    category: [categorySchema],
    chat: { type: mongoose_1.Schema.Types.ObjectId, ref: "Chat", required: true },
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }],
>>>>>>> main
});
/*
Zu implementieren?:
Middleware-Methode, die sicherstellt, dass nach Bearbeitung eines Events, alle Teilnehmer benachrichtigt werden

eventSchema.post('updateOne', async function (result, next) {
    try {
        //Funktion zur Benachrichtigung aller Teilnehmer
    } catch (error) {
        //throw new Error()
    }
    next();
}); */
exports.Event = (0, mongoose_1.model)("Event", eventSchema);
exports.Categoty = (0, mongoose_1.model)("Category", categorySchema);
//# sourceMappingURL=EventModel.js.map