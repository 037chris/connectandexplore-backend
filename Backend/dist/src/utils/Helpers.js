"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validateIfPresent = (field, validators) => {
    return (req, res, next) => {
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
exports.validate = [
    validateIfPresent("email", (0, express_validator_1.body)("email").isEmail()),
    validateIfPresent("name.first", (0, express_validator_1.body)("name.first").isString()),
    validateIfPresent("name.last", (0, express_validator_1.body)("name.last").isString()),
    validateIfPresent("password", (0, express_validator_1.body)("password").isStrongPassword()),
<<<<<<< HEAD
    validateIfPresent("oldPassword", (0, express_validator_1.body)("oldPassword").isStrongPassword()),
    validateIfPresent("address.street", (0, express_validator_1.body)("address.street")
        .notEmpty()
        .withMessage("Street address is required.")),
=======
    validateIfPresent("isAdministrator", (0, express_validator_1.body)("isAdministrator").isBoolean()),
    //validateIfPresent("oldPassword", body("oldPassword").isStrongPassword()),
    validateIfPresent("address.street", (0, express_validator_1.body)("address.street").isString()),
>>>>>>> main
    validateIfPresent("address.houseNumber", (0, express_validator_1.body)("address.houseNumber")
        .isNumeric()
        .withMessage("houseNumber is required.")),
    validateIfPresent("address.postalCode", (0, express_validator_1.body)("address.postalCode")
        .isNumeric()
        .withMessage("Postal code is required.")),
    validateIfPresent("address.city", (0, express_validator_1.body)("address.city").isString().withMessage("City is required.")),
    validateIfPresent("address.country", (0, express_validator_1.body)("address.country").isString().withMessage("Country is required.")),
    validateIfPresent("address.stateOrRegion", (0, express_validator_1.body)("address.stateOrRegion")
        .isString()
        .withMessage("invalid State or Region.")),
    validateIfPresent("address.appartmentNumber", (0, express_validator_1.body)("address.appartmentNumber")
        .isString()
        .withMessage("invalid Appartmentnumber.")),
    validateIfPresent("profilePicture", (0, express_validator_1.body)("profilePicture").isString()),
    validateIfPresent("birthDate", (0, express_validator_1.body)("birthDate").isString()),
    validateIfPresent("gender", (0, express_validator_1.body)("gender").isString()),
    validateIfPresent("socialMediaUrls.facebook", (0, express_validator_1.body)("socialMediaUrls.facebook").isString()),
    validateIfPresent('socialMediaUrls.instagram"', (0, express_validator_1.body)("socialMediaUrls.instagram").isString()),
];
//# sourceMappingURL=Helpers.js.map