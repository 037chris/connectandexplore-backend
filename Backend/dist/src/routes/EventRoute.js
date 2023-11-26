"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EventService_1 = require("../services/EventService");
const authentication_1 = require("./authentication");
const express_validator_1 = require("express-validator");
const EventRouter = express_1.default.Router();
const eventService = new EventService_1.EventService();
EventRouter.post("/create", authentication_1.requiresAuthentication, 
//upload.single("thumbnail"),
[
    (0, express_validator_1.body)("name").isString().notEmpty().withMessage("Event name is required."),
    (0, express_validator_1.body)("creator").isString().notEmpty(),
    (0, express_validator_1.body)("price").isNumeric().notEmpty(),
    (0, express_validator_1.body)("description")
        .isString()
        .notEmpty()
        .withMessage("Description is required."),
    (0, express_validator_1.body)("date").isDate().notEmpty(),
    (0, express_validator_1.body)("address.street")
        .notEmpty()
        .withMessage("Street address is required."),
    (0, express_validator_1.body)("address.houseNumber")
        .notEmpty()
        .withMessage("House number is required."),
    (0, express_validator_1.body)("address.postalCode")
        .notEmpty()
        .withMessage("Postal code is required."),
    (0, express_validator_1.body)("address.city").notEmpty().withMessage("City is required."),
    (0, express_validator_1.body)("address.country").notEmpty().withMessage("Country is required."),
    (0, express_validator_1.body)("address.stateOrRegion")
        .optional()
        .isString()
        .withMessage("Invalid State or Region."),
    (0, express_validator_1.body)("address.apartmentNumber")
        .optional()
        .isString()
        .withMessage("Invalid Apartment number."),
    (0, express_validator_1.body)("thumbnail").optional().isString(),
    (0, express_validator_1.body)("hashtags").optional().isArray(),
    (0, express_validator_1.body)("category")
        .isArray()
        .notEmpty()
        .withMessage("Categories are required."),
    (0, express_validator_1.body)("chat").isString().notEmpty(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        else {
            /* if (req.file) {
              req.body.thumbnail = `/uploads/${req.file.filename}`;
            } */
            const newEvent = await eventService.createEvent(req.body);
            return res.status(201).send(newEvent);
        }
    }
    catch (err) {
        return res.status(500).json({ Error: "Event creation failed" });
    }
});
EventRouter.post("/:eventid/join", authentication_1.requiresAuthentication, (0, express_validator_1.param)("eventid").isMongoId(), async (req, res, next) => {
    try {
        await eventService.joinEvent(req.userId, req.params.eventid);
        res.status(200).json({ message: "User joined the event successfully" });
    }
    catch (err) {
        if (err.message === "User not found") {
            return res.status(404).json({ Error: err.message });
        }
        else if (err.message === "Event not found") {
            return res.status(404).json({ Error: err.message });
        }
        else if (err.message === "User is already participating in the event") {
            return res.status(409).json({ Error: err.message });
        }
        else {
            return res.status(500).json({ Error: "Joining event failed" });
        }
    }
});
EventRouter.delete("/:eventid/cancel", authentication_1.requiresAuthentication, (0, express_validator_1.param)("eventid").isMongoId(), async (req, res, next) => {
    try {
        await eventService.cancelEvent(req.userId, req.params.eventid);
        res.status(204).send();
    }
    catch (err) {
        if (err.message === "User is not participating in the event") {
            return res.status(409).json({ Error: err.message });
        }
        else {
            return res.status(500).json({ Error: "Canceling event failed" });
        }
    }
});
EventRouter.get("/:eventid/participants", authentication_1.requiresAuthentication, (0, express_validator_1.param)("eventid").isMongoId(), async (req, res, next) => {
    try {
        const participants = await eventService.getParticipants(req.params.eventid, req.userId);
        res.status(200).send(participants);
    }
    catch (err) {
        res.status(404);
        next(err);
    }
});
EventRouter.delete("/:eventid", authentication_1.requiresAuthentication, (0, express_validator_1.param)("eventid").isMongoId(), async (req, res, next) => {
    try {
        const deleted = await eventService.deleteEvent(req.params.eventid, req.userId);
        if (deleted) {
            res.status(204).json({ message: "Event successfully deleted" });
        }
        else {
            res.status(405).json({ error: "Event could not be deleted" });
        }
    }
    catch (err) {
        res.status(404);
        next(err);
    }
});
EventRouter.get("/creator/:userid", authentication_1.requiresAuthentication, (0, express_validator_1.param)("userid").isMongoId(), async (req, res, next) => {
    if (req.role === "a" || req.params.userid === req.userId) {
        try {
            const userID = req.params.userid;
            const events = await eventService.getEvents(userID);
            if (events.events.length === 0) {
                return res.status(204).json({ message: "No events found." });
            }
            res.status(200).send(events);
        }
        catch (err) {
            res.status(404);
            next(err);
        }
    }
    else {
        res.status(403);
        next(new Error("Invalid authorization"));
    }
});
EventRouter.get("/", async (req, res, next) => {
    try {
        const events = await eventService.getAllEvents();
        if (events.events.length === 0) {
            return res.status(204).json({ message: "No events found." });
        }
        res.status(200).send(events);
    }
    catch (err) {
        res.status(404);
        next(err);
    }
});
EventRouter.get("/search", [(0, express_validator_1.query)("query").isString().notEmpty()], async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const term = req.query.query;
        const events = await eventService.searchEvents(term);
        if (events.events.length === 0) {
            return res
                .status(204)
                .json({ message: "No events found matching the query." });
        }
        res.status(200).send(events);
    }
    catch (err) {
        res.status(404);
        next(err);
    }
});
EventRouter.get("/joined", authentication_1.requiresAuthentication, async (req, res, next) => {
    try {
        const events = await eventService.getJoinedEvents(req.userId);
        if (events.events.length === 0) {
            return res.status(204).json({ message: "No events found." });
        }
        res.status(200).send(events);
    }
    catch (err) {
        res.status(404);
        next(err);
    }
});
exports.default = EventRouter;
//# sourceMappingURL=EventRoute.js.map