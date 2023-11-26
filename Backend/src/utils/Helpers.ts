import { IUser } from "../model/UserModel";
import { Request, Response, NextFunction } from "express";
import { validationResult, body } from "express-validator";

const validateIfPresent = (field: string, validators: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if the field exists in the request body and has a value
    if (req.body[field] !== undefined && req.body[field] !== "") {
      return validators(req, res, next);
    }
    // If the field is absent or empty, skip the validation
    return next();
  };
};

// Validation middleware
export const validate = [
  validateIfPresent("email", body("email").isEmail()),
  validateIfPresent("name.first", body("name.first").isString()),
  validateIfPresent("name.last", body("name.last").isString()),
  validateIfPresent("password", body("password").isStrongPassword()),
  validateIfPresent("isAdministrator", body("isAdministrator").isBoolean()),
  
  //validateIfPresent("oldPassword", body("oldPassword").isStrongPassword()),
  validateIfPresent(
    "address.street",
    body("address.street").notEmpty().withMessage("Street address is required.")
  ),
  validateIfPresent(
    "address.houseNumber",
    body("address.houseNumber")
      .notEmpty()
      .withMessage("House number is required.")
  ),
  validateIfPresent(
    "address.postalCode",
    body("address.postalCode")
      .notEmpty()
      .withMessage("Postal code is required.")
  ),
  validateIfPresent(
    "address.city",
    body("address.city").notEmpty().withMessage("City is required.")
  ),
  validateIfPresent(
    "address.country",
    body("address.country").notEmpty().withMessage("Country is required.")
  ),
  validateIfPresent(
    "address.stateOrRegion",
    body("address.stateOrRegion")
      .isString()
      .withMessage("invalid State or Region.")
  ),
  validateIfPresent(
    "address.appartmentNumber",
    body("address.appartmentNumber")
      .isString()
      .withMessage("invalid Appartmentnumber.")
  ),
  validateIfPresent("profilePicture", body("profilePicture").isString()),
  validateIfPresent("birthDate", body("birthDate").isString()),
  validateIfPresent("gender", body("gender").isString()),
  validateIfPresent(
    "socialMediaUrls.facebook",
    body("socialMediaUrls.facebook").isString()
  ),
  validateIfPresent(
    'socialMediaUrls.instagram"',
    body("socialMediaUrls.instagram").isString()
  ),
];
