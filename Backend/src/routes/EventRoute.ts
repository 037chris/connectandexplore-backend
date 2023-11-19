import { Router, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { EventService } from "../services/EventService";
import { upload } from "../utils/FileUpload";
import { requiresAuthentication } from "./authentication";

const EventRouter = Router();
const eventService = new EventService();

EventRouter.post(
  "/create",
  requiresAuthentication,
  //upload.single("thumbnail"),
  [
    body("name").isString().notEmpty().withMessage("Event name is required."),
    body("creator").isString().notEmpty(),
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
    body("category")
      .isArray()
      .notEmpty()
      .withMessage("Categories are required."),
    body("chat").isString().notEmpty(),
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
        const newEvent = await eventService.createEvent(req.body);
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
      const userID = req.userId;
      const eventID = req.params.eventid;
      await eventService.cancelEvent(userID, eventID);
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
      const eventID = req.params.eventid;
      const participants = await eventService.getParticipants(
        eventID
      );
      res.status(200).send(participants);
    } catch (err) {
      res.status(404);
      next(err);
    }
  }
);

export { EventRouter };
