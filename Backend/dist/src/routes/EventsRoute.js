"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EventService_1 = require("../services/EventService");
const authentication_1 = require("./authentication");
const express_validator_1 = require("express-validator");
const EventsRouter = express_1.default.Router();
const eventService = new EventService_1.EventService();
EventsRouter.get("/:userid", authentication_1.requiresAuthentication, (0, express_validator_1.param)("userid").isMongoId(), async (req, res, next) => {
    if (req.role === "a" || req.params.userid === req.userId) {
        try {
            const userID = req.params.userid;
            const events = await eventService.getEvents(userID);
            if (events.events.length === 0) {
                return res.status(404).json({ message: "No events found." });
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
EventsRouter.get("/", async (req, res, next) => {
    try {
        const events = await eventService.getAllEvents();
        if (events.events.length === 0) {
            return res.status(404).json({ message: "No events found." });
        }
        res.status(200).send(events);
    }
    catch (err) {
        res.status(404);
        next(err);
    }
});
EventsRouter.get("/search", [(0, express_validator_1.query)("query").isString().notEmpty()], async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const q = req.query.query;
        const events = await eventService.searchEvents(q);
        if (events.events.length === 0) {
            return res
                .status(404)
                .json({ message: "No events found matching the query." });
        }
        res.status(200).send(events);
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});
EventsRouter.get("/joined", authentication_1.requiresAuthentication, async (req, res, next) => {
    try {
        const events = await eventService.getJoinedEvents(req.userId);
        if (events.events.length === 0) {
            return res.status(404).json({ message: "No events found." });
        }
        res.status(200).send(events);
    }
    catch (err) {
        res.status(404);
        next(err);
    }
});
exports.default = EventsRouter;
//# sourceMappingURL=EventsRoute.js.map