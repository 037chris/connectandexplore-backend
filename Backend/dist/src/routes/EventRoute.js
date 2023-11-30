"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EventService_1 = require("../services/EventService");
const authentication_1 = require("./authentication");
const express_validator_1 = require("express-validator");
<<<<<<< HEAD
const FileUpload_1 = require("../utils/FileUpload");
=======
<<<<<<< HEAD
>>>>>>> f033aa4c98017bfa3ca92460a5a643a8c5baddc6
const EventRouter = express_1.default.Router();
const eventService = new EventService_1.EventService();
/**
 * @swagger
 * /api/events/search:
 *   get:
 *     summary: "Search for events"
 *     description: "Search events based on a query string"
 *     tags:
 *       - "Event"
 *     parameters:
 *       - name: "query"
 *         in: "query"
 *         required: true
 *         schema:
 *           type: "string"
 *         description: "The query string to search for events"
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/IEvent"
 *       204:
 *         description: "No events found matching the query"
 *       400:
 *         description: "Bad request. Validation error in the query string"
 *       404:
 *         description: "Not found. The requested resource does not exist"
 *       500:
 *         description: "Internal server error"
 */
EventRouter.get("/search", authentication_1.optionalAuthentication, [(0, express_validator_1.query)("query").isString().notEmpty()], async (req, res, next) => {
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
/**
 * @swagger
 * paths:
 *  /api/events/create:
 *    post:
 *     summary: Create a new event
 *     description: Register a new event with event data and an optional event pictures.
 *     tags:
 *       - Event
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "Test Event"
 *                price:
 *                  type: number
 *                  example: 0
 *                description:
 *                  type: string
 *                  example: "Test Event description"
 *                date:
 *                  type: string
 *                  format: date
 *                  example: "2000-01-01"
 *                address[street]:
 *                  type: string
 *                  example: "123 Test Street"
 *                address[houseNumber]:
 *                  type: string
 *                  example: "1"
 *                address[apartmentNumber]:
 *                  type: string
 *                  example: "123"
 *                address[postalCode]:
 *                  type: string
 *                  example: "12345"
 *                address[city]:
 *                  type: string
 *                  example: "Berlin"
 *                address[stateOrRegion]:
 *                  type: string
 *                  example: "Berlin"
 *                address[country]:
 *                  type: string
 *                  example: "DE"
 *                thumbnail:
 *                  type: string
 *                  example: []
 *                  format: binary
 *                hashtags:
 *                  type: array
 *                  items:
 *                    type: string
 *                  example: ["sport", "freizeit"]
 *                category:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      name:
 *                        type: string
 *                        example: "Hobbys"
 *                      description:
 *                        type: string
 *                        example: "persönliche Interessen, Freizeit"
 *              required:
 *                - name
 *                - price
 *                - description
 *                - date
 *                - name[first]
 *                - name[last]
 *                - address[street]
 *                - address[houseNumber]
 *                - address[postalCode]
 *                - address[city]
 *                - address[country]
 *                - category
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IEvent'
 *       400:
 *         description: Bad request, validation error
 *         content:
 *           application/json:
 *             example:
 *               error: Bad request, validation error
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Creating new event failed
 */
EventRouter.post("/create", authentication_1.requiresAuthentication, FileUpload_1.upload.single("thumbnail"), [
    (0, express_validator_1.body)("name").isString().notEmpty().withMessage("Event name is required."),
    (0, express_validator_1.body)("creator").isString().notEmpty(),
=======
const FileUpload_1 = require("../utils/FileUpload");
const EventRouter = express_1.default.Router();
const eventService = new EventService_1.EventService();
EventRouter.get("/search", authentication_1.optionalAuthentication, [(0, express_validator_1.query)("query").isString().notEmpty()], async (req, res, next) => {
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
EventRouter.post("/create", authentication_1.requiresAuthentication, FileUpload_1.upload.single("thumbnail"), [
    (0, express_validator_1.body)("name").isString().notEmpty().withMessage("Event name is required."),
    //body("creator").isString().notEmpty(),
>>>>>>> main
    (0, express_validator_1.body)("price").isNumeric().notEmpty(),
    (0, express_validator_1.body)("description")
        .isString()
        .notEmpty()
        .withMessage("Description is required."),
<<<<<<< HEAD
    (0, express_validator_1.body)("date") /* .isDate() */
        .notEmpty(),
=======
<<<<<<< HEAD
    (0, express_validator_1.body)("date").isDate().notEmpty(),
=======
    (0, express_validator_1.body)("date") /* .isDate() */
        .notEmpty(),
>>>>>>> main
>>>>>>> f033aa4c98017bfa3ca92460a5a643a8c5baddc6
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
<<<<<<< HEAD
    (0, express_validator_1.body)("chat").isString().notEmpty(),
=======
    //body("chat").isString().notEmpty(),
>>>>>>> main
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
<<<<<<< HEAD
            if (req.file) {
                // Delete the file
                (0, FileUpload_1.deleteEventThumbnail)(req.file.path);
            }
            return res.status(400).json({ errors: errors.array() });
        }
        else {
=======
<<<<<<< HEAD
            return res.status(400).json({ errors: errors.array() });
        }
        else {
            /* if (req.file) {
              req.body.thumbnail = `/uploads/${req.file.filename}`;
            } */
            const newEvent = await eventService.createEvent(req.body);
=======
            if (req.file) {
                // Delete the file
                (0, FileUpload_1.deleteEventThumbnail)(req.file.path);
            }
            return res.status(400).json({ errors: errors.array() });
        }
        else {
>>>>>>> f033aa4c98017bfa3ca92460a5a643a8c5baddc6
            if (req.file) {
                req.body.thumbnail = `/uploads/${req.file.filename}`;
            }
            const newEvent = await eventService.createEvent(req.body, req.userId);
>>>>>>> main
            return res.status(201).send(newEvent);
        }
    }
    catch (err) {
        return res.status(500).json({ Error: "Event creation failed" });
    }
});
/**
 * @swagger
 * /api/events/{eventid}/join:
 *   post:
 *     summary: "Join an event"
 *     deprecated: false
 *     description: "The User can join event"
 *     tags:
 *       - "Event"
 *     parameters:
 *       - name: "eventid"
 *         in: "path"
 *         required: true
 *         type: "string"
 *         description: "The ID of the event to join"
 *     responses:
 *       "200":
 *         description: "User joined the event successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties: {}
 *       "409":
 *         description: "User is already participating in the event"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "User is already participating in the event."
 *       "404":
 *         description: "Not Found - Invalid userID"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "No user or event with this ID exists."
 *       "500":
 *         description: "Joining event failed"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "Joining event failed"
 *     security:
 *       - bearerAuth: []
 */
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
/**
 * @swagger
 * /api/events/{eventid}/cancel:
 *   delete:
 *     summary: "Cancel participating in event"
 *     deprecated: false
 *     description: "Canceling of participating in event"
 *     tags:
 *       - "Event"
 *     parameters:
 *       - name: "eventid"
 *         in: "path"
 *         required: true
 *         type: "string"
 *         description: "The ID of the event to cancel participating in"
 *     responses:
 *       "204":
 *         description: "User canceled the participating in the event successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties: {}
 *       "409":
 *         description: "User is not participating in the event or Can not cancel participation as event manager"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "User is not participating in the event or Can not cancel participation as event manager"
 *       "500":
 *         description: "Canceling event failed"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "Canceling event failed"
 *     security:
 *       - bearerAuth: []
 */
EventRouter.delete("/:eventid/cancel", authentication_1.requiresAuthentication, (0, express_validator_1.param)("eventid").isMongoId(), async (req, res, next) => {
    try {
        await eventService.cancelEvent(req.userId, req.params.eventid);
        res.status(204).send();
    }
    catch (err) {
<<<<<<< HEAD
        if (err.message === "User is not participating in the event") {
=======
        if (err.message === "User is not participating in the event" ||
            err.message === "Can not cancel participation as event manager") {
>>>>>>> main
            return res.status(409).json({ Error: err.message });
        }
        else {
            return res.status(500).json({ Error: "Canceling event failed" });
        }
    }
});
<<<<<<< HEAD
/**
 * @swagger
 * /api/events/joined:
 *   get:
 *     summary: "Get all joined events"
 *     deprecated: false
 *     description: "Retrieve all participated events ( Event participant )"
 *     tags:
 *       - "Event"
 *     responses:
 *       '200':
 *         description: Returns all joined events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/IEvent'
 *       '204':
 *         description: No events found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Not found
 *     security:
 *       - bearerAuth: []
 */
=======
<<<<<<< HEAD
=======
>>>>>>> f033aa4c98017bfa3ca92460a5a643a8c5baddc6
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
<<<<<<< HEAD
/**
 * @swagger
 * /api/events/{eventid}/participants:
 *   get:
 *     summary: "Retrieve all participants in event"
 *     deprecated: false
 *     description: "Retrieve a list of all participants in event"
 *     tags:
 *       - "Event"
 *     parameters:
 *       - name: "eventid"
 *         in: "path"
 *         required: true
 *         type: "string"
 *         description: "The ID of the event to cancel participating in"
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               type: "array"
 *               items:
 *                 type: "string"
 *                 description: "User ID of a participant"
 *       404:
 *         description: "Event not found or no participants found for the specified event"
 *       500:
 *         description: "Internal server error"
 */
=======
>>>>>>> main
>>>>>>> f033aa4c98017bfa3ca92460a5a643a8c5baddc6
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
<<<<<<< HEAD
/**
 * @swagger
 * /api/events/{eventid}:
 *   get:
 *     summary: "Retrieve information of an event"
 *     deprecated: false
 *     description: "Retrieve all data of Event with eventid"
 *     tags:
 *       - "Event"
 *     parameters:
 *       - name: "eventid"
 *         in: "path"
 *         required: true
 *         type: "string"
 *         description: "The ID of the event to retrieve the event data"
 *     responses:
 *       200:
 *         description: "Successful response"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties: {}
 *               $ref: '#/components/schemas/IEvent'
 *       400:
 *         description: "Validation error"
 *       404:
 *         description: "Event not found for the specified event"
 *       500:
 *         description: "Internal server error"
 */
=======
<<<<<<< HEAD
EventRouter.delete("/:eventid", authentication_1.requiresAuthentication, (0, express_validator_1.param)("eventid").isMongoId(), async (req, res, next) => {
    try {
        const deleted = await eventService.deleteEvent(req.params.eventid, req.userId);
=======
>>>>>>> f033aa4c98017bfa3ca92460a5a643a8c5baddc6
EventRouter.get("/:eventid", authentication_1.optionalAuthentication, (0, express_validator_1.param)("eventid").isMongoId(), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const event = await eventService.getEvent(req.params.eventid);
        res.status(200).send(event);
    }
    catch (err) {
        res.status(404);
        next(err);
    }
});
EventRouter.put("/:eventid", authentication_1.requiresAuthentication, FileUpload_1.upload.single("thumbnail"), (0, express_validator_1.param)("eventid").isMongoId(), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        if (req.file) {
            // Delete the file
            (0, FileUpload_1.deleteEventThumbnail)(req.file.path);
        }
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const event = await eventService.getEvent(req.params.eventid);
        if (req.file) {
            req.body.thumbnail = `/uploads/${req.file.filename}`;
            if (event.thumbnail)
                (0, FileUpload_1.deleteEventThumbnail)(event.thumbnail);
        }
        const eventResource = req.body;
        const updatedEvent = await eventService.updateEvent(req.params.eventid, eventResource, req.userId);
        res.status(200).send(updatedEvent);
    }
    catch (err) {
        (0, FileUpload_1.deleteEventThumbnail)(req.body.thumbnail);
        res.status(404);
        next(err);
    }
});
/**
 * @swagger
 * /api/events/{eventid}:
 *   delete:
 *     summary: "Delete event"
 *     deprecated: false
 *     description: "Deleting event with eventID as an event manager or admin"
 *     tags:
 *       - "Event"
 *     parameters:
 *       - name: "eventid"
 *         in: "path"
 *         required: true
 *         type: "string"
 *         description: "The ID of the event to delete"
 *     responses:
 *       "204":
 *         description: "Event successfully deleted"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties: {}
 *       "405":
 *         description: "Event could not be deleted"
 *       "404":
 *         description: "Event not found"
 *     security:
 *       - bearerAuth: []
 */
EventRouter.delete("/:eventid", authentication_1.requiresAuthentication, (0, express_validator_1.param)("eventid").isMongoId(), async (req, res, next) => {
    try {
        const event = await eventService.getEvent(req.params.eventid);
        const deleted = await eventService.deleteEvent(req.params.eventid, req.userId);
        if (event.thumbnail)
            (0, FileUpload_1.deleteEventThumbnail)(event.thumbnail);
<<<<<<< HEAD
=======
>>>>>>> main
>>>>>>> f033aa4c98017bfa3ca92460a5a643a8c5baddc6
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
/**
 * @swagger
 * /api/events/creator/{userid}:
 *   get:
 *     summary: Get all created events of a user
 *     deprecated: false
 *     description: "Retrieve all events created by a user where the user is an admin or retrieve events associated with the authenticated user."
 *     tags:
 *       - Event
 *     parameters:
 *       - name: "userid"
 *         in: "path"
 *         required: true
 *         type: "string"
 *         description: "The ID of the user"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Returns all created events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/IEvent'
 *       '204':
 *         description: No events found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '403':
 *         description: Invalid authorization
 *       '404':
 *         description: Not found
 */
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
<<<<<<< HEAD
/**
 * @swagger
 * /api/events/:
 *   get:
 *     summary: Get all events
 *     tags:
 *       - Event
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Returns all events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/IEvent'
 *       '204':
 *         description: No events found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Not found
 */
=======
<<<<<<< HEAD
EventRouter.get("/", async (req, res, next) => {
=======
>>>>>>> f033aa4c98017bfa3ca92460a5a643a8c5baddc6
EventRouter.get("/", authentication_1.optionalAuthentication, async (req, res, next) => {
>>>>>>> main
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
>>>>>>> main
>>>>>>> f033aa4c98017bfa3ca92460a5a643a8c5baddc6
exports.default = EventRouter;
//# sourceMappingURL=EventRoute.js.map