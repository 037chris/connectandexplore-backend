import { IUser } from "../model/UserModel";
import { Request, Response, NextFunction } from "express";
import { validationResult, body } from "express-validator";

const validateIfPresent = (field: string, validators: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if the field exists in the request body and has a value
    // && req.body[field] !== ""
    if (req.body[field] !== undefined) {
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
    "address.postalCode",
    body("address.postalCode")
      .isNumeric()
      .withMessage("Postal code is required.")
  ),
  validateIfPresent(
    "address.city",
    body("address.city").isString().withMessage("City is required.")
  ),
  validateIfPresent(
    "address.country",
    body("address.country").isString().withMessage("Country is required.")
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
