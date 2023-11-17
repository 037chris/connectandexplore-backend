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

EventsRouter.get("/all", async (req, res) => {
  try {
    const allEvents: eventsResource = await eventService.getAllEvents();
    res.status(200).send(allEvents);
  } catch (error) {
    res.status(404);
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
      const result = req.query.query as string;
      const events: eventsResource =
        await eventService.searchEvents(result);
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

export default EventsRouter;
