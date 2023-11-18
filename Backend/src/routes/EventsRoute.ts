import express from "express";
import { EventService } from "../services/EventService";
import { requiresAuthentication } from "./authentication";
import { eventsResource } from "../Resources";
import { param, query, validationResult } from "express-validator";

const EventsRouter = express.Router();
const eventService = new EventService();

EventsRouter.get(
  "/:userid",
  requiresAuthentication,
  param("userid").isMongoId(),
  async (req, res, next) => {
    if (req.role === "a" || req.params.userid === req.userId) {
      try {
        const userID = req.params.userid;
        const events: eventsResource = await eventService.getEvents(userID);
        if (events.events.length === 0) {
          return res.status(404).json({ message: "No events found." });
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

EventsRouter.get("/", async (req, res, next) => {
  try {
    const events: eventsResource = await eventService.getAllEvents();
    if (events.events.length === 0) {
      return res.status(404).json({ message: "No events found." });
    }
    res.status(200).send(events);
  } catch (err) {
    res.status(404);
    next(err);
  }
});

EventsRouter.get(
  "/search",
  [query("query").isString().notEmpty()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const q = req.query.query as string;
      const events: eventsResource = await eventService.searchEvents(q);
      if (events.events.length === 0) {
        return res
          .status(404)
          .json({ message: "No events found matching the query." });
      }
      res.status(200).send(events);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

EventsRouter.get("/joined", requiresAuthentication, async (req, res, next) => {
  try {
    const events: eventsResource = await eventService.getJoinedEvents(
      req.userId
    );
    if (events.events.length === 0) {
      return res.status(404).json({ message: "No events found." });
    }
    res.status(200).send(events);
  } catch (err) {
    res.status(404);
    next(err);
  }
});

export default EventsRouter;
