const { body } = require("express-validator");
exports.signup = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("firstname")
    .isLength({ min: 3 })
    .withMessage("Firstname must be at least 3 characters"),
  body("lastname")
    .isLength({ min: 3 })
    .withMessage("Lastname must be at least 3 characters"),
  body("repassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("RePassword does not match password");
    }
    return true;
  }),
];
