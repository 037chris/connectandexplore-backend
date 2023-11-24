"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const EventService_1 = require("../services/EventService");
const authentication_1 = require("./authentication");
const EventRouter = (0, express_1.Router)();
exports.EventRouter = EventRouter;
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
        if (err.message === "User or event not found") {
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
        const userID = req.userId;
        const eventID = req.params.eventid;
        await eventService.cancelEvent(userID, eventID);
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
//# sourceMappingURL=EventRoute.js.map