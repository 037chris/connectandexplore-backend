import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { EventService } from "../services/EventService";
import { upload } from "../utils/FileUpload";

const EventRouter = Router();
const eventService = new EventService();

EventRouter.post(
  "/create",
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
        return res.status(201).json(newEvent);
      }
    } catch (error) {
      return res.status(500).json({ Error: "Event creation failed" });
    }
  }
);

export { EventRouter };
