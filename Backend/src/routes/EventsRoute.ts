import express from "express";
import { EventService } from "../services/EventService";
import { requiresAuthentication } from "./authentication";
import { eventsResource } from "../Resources";

const EventsRouter = express.Router();
const eventService = new EventService();

EventsRouter.get("/events", requiresAuthentication, async (req, res, next) => {
  try {
    const userID = req.userId;
    const events: eventsResource = await eventService.getEvents(userID);
    res.status(200).send(events);
  } catch (err) {
    res.status(404);
    next(err);
  }
});

export default EventsRouter;
