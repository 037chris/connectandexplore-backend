import express from "express";
import { EventService } from "../services/EventService";
import {
  optionalAuthentication,
  requiresAuthentication,
} from "./authentication";
import { eventResource, eventsResource } from "../Resources";
import {
  body,
  matchedData,
  param,
  query,
  validationResult,
} from "express-validator";
import { upload } from "../utils/FileUpload";
const EventRouter = express.Router();
const eventService = new EventService();

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
 *       '201':
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IEvent'
 *       '400':
 *         description: Bad request, validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       value:
 *                         type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Error:
 *                   type: string
 */

EventRouter.post(
  "/create",
  requiresAuthentication,
  upload.single("thumbnail"),
  [
    body("name").isString().notEmpty().withMessage("Event name is required."),
    //body("creator").isString().notEmpty(),
    body("price").isNumeric().notEmpty(),
    body("description")
      .isString()
      .notEmpty()
      .withMessage("Description is required."),
    body("date").isDate().notEmpty(),
    body("address.street")
      .notEmpty()
      .withMessage("Street address is required."),
    body("address.houseNumber")
      .notEmpty()
      .withMessage("House number is required."),
    body("address.postalCode")
      .notEmpty()
      .withMessage("Postal code is required."),
    body("address.city").notEmpty().withMessage("City is required."),
    body("address.country").notEmpty().withMessage("Country is required."),
    body("address.stateOrRegion")
      .optional()
      .isString()
      .withMessage("Invalid State or Region."),
    body("address.apartmentNumber")
      .optional()
      .isString()
      .withMessage("Invalid Apartment number."),
    body("thumbnail").optional().isString(),
    body("hashtags").optional().isArray(),
    body("category")
      .isArray()
      .notEmpty()
      .withMessage("Categories are required."),
    //body("chat").isString().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        /* if (req.file) {
          req.body.thumbnail = `/uploads/${req.file.filename}`;
        } */
        const newEvent = await eventService.createEvent(req.body, req.userId);
        return res.status(201).send(newEvent);
      }
    } catch (err) {
      return res.status(500).json({ Error: "Event creation failed" });
    }
  }
);

EventRouter.post(
  "/:eventid/join",
  requiresAuthentication,
  param("eventid").isMongoId(),
  async (req, res, next) => {
    try {
      await eventService.joinEvent(req.userId, req.params.eventid);
      res.status(200).json({ message: "User joined the event successfully" });
    } catch (err) {
      if (err.message === "User not found") {
        return res.status(404).json({ Error: err.message });
      } else if (err.message === "Event not found") {
        return res.status(404).json({ Error: err.message });
      } else if (err.message === "User is already participating in the event") {
        return res.status(409).json({ Error: err.message });
      } else {
        return res.status(500).json({ Error: "Joining event failed" });
      }
    }
  }
);

EventRouter.delete(
  "/:eventid/cancel",
  requiresAuthentication,
  param("eventid").isMongoId(),
  async (req, res, next) => {
    try {
      await eventService.cancelEvent(req.userId, req.params.eventid);
      res.status(204).send();
    } catch (err) {
      if (
        err.message === "User is not participating in the event" ||
        err.message === "Can not cancel participation as event manager"
      ) {
        return res.status(409).json({ Error: err.message });
      } else {
        return res.status(500).json({ Error: "Canceling event failed" });
      }
    }
  }
);

EventRouter.get(
  "/:eventid/participants",
  requiresAuthentication,
  param("eventid").isMongoId(),
  async (req, res, next) => {
    try {
      const participants = await eventService.getParticipants(
        req.params.eventid,
        req.userId
      );
      res.status(200).send(participants);
    } catch (err) {
      res.status(404);
      next(err);
    }
  }
);

EventRouter.get(
  "/:eventid",
  optionalAuthentication,
  param("eventid").isMongoId(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const event = await eventService.getEvent(req.params.eventid);
      res.status(200).send(event);
    } catch (err) {
      res.status(404);
      next(err);
    }
  }
);

EventRouter.put(
  "/:eventid",
  requiresAuthentication,
  //upload.single("thumbnail"),
  param("eventid").isMongoId(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      /* if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
      } */
      const eventResource = matchedData(req) as eventResource;
      const updatedEvent = await eventService.updateEvent(
        req.params.eventid,
        eventResource,
        req.userId
      );
      res.status(200).send(updatedEvent);
    } catch (err) {
      res.status(404);
      next(err);
    }
  }
);

EventRouter.delete(
  "/:eventid",
  requiresAuthentication,
  param("eventid").isMongoId(),
  async (req, res, next) => {
    try {
      const deleted = await eventService.deleteEvent(
        req.params.eventid,
        req.userId
      );
      if (deleted) {
        res.status(204).json({ message: "Event successfully deleted" });
      } else {
        res.status(405).json({ error: "Event could not be deleted" });
      }
    } catch (err) {
      res.status(404);
      next(err);
    }
  }
);

EventRouter.get(
  "/creator/:userid",
  requiresAuthentication,
  param("userid").isMongoId(),
  async (req, res, next) => {
    if (req.role === "a" || req.params.userid === req.userId) {
      try {
        const userID = req.params.userid;
        const events: eventsResource = await eventService.getEvents(userID);
        if (events.events.length === 0) {
          return res.status(204).json({ message: "No events found." });
        }
        res.status(200).send(events);
      } catch (err) {
        res.status(404);
        next(err);
      }
    } else {
      res.status(403);
      next(new Error("Invalid authorization"));
    }
  }
);
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
 *                     $ref: '#/components/schemas/EventsResource'
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
EventRouter.get("/", optionalAuthentication, async (req, res, next) => {
  try {
    const events: eventsResource = await eventService.getAllEvents();
    if (events.events.length === 0) {
      return res.status(204).json({ message: "No events found." });
    }
    res.status(200).send(events);
  } catch (err) {
    res.status(404);
    next(err);
  }
});

EventRouter.get(
  "/search",
  optionalAuthentication,
  [query("query").isString().notEmpty()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const term = req.query.query as string;
      const events: eventsResource = await eventService.searchEvents(term);
      if (events.events.length === 0) {
        return res
          .status(204)
          .json({ message: "No events found matching the query." });
      }
      res.status(200).send(events);
    } catch (err) {
      res.status(404);
      next(err);
    }
  }
);

EventRouter.get("/joined", requiresAuthentication, async (req, res, next) => {
  try {
    const events: eventsResource = await eventService.getJoinedEvents(
      req.userId
    );
    if (events.events.length === 0) {
      return res.status(204).json({ message: "No events found." });
    }
    res.status(200).send(events);
  } catch (err) {
    res.status(404);
    next(err);
  }
});

export default EventRouter;
