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

const EventRouter = express.Router();
const eventService = new EventService();

EventRouter.post(
  "/create",
  requiresAuthentication,
  //upload.single("thumbnail"),
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
      if (err.message === "User is not participating in the event") {
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
