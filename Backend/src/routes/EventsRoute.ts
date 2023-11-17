import express from "express";
import { EventService } from "../services/EventService";
import { requiresAuthentication } from "./authentication";
import { eventsResource } from "../Resources";
import { param } from "express-validator";

const EventsRouter = express.Router();
const eventService = new EventService();

EventsRouter.get(
  "/:userid",
  requiresAuthentication,
  param("userid").isMongoId(),
  async (req, res, next) => {
    try {
      const userID = req.params.userid;
      const events: eventsResource = await eventService.getEvents(userID);
      res.status(200).send(events);
    } catch (err) {
      res.status(404);
      next(err);
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

export default EventsRouter;
