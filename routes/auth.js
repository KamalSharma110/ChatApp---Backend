const { body } = require("express-validator");
const express = require("express");

const authControllers = require("../controllers/auth");
const User = require("../models/User");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("name")
      .not()
      .isEmpty()
      .withMessage("Please provide a name for the user"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("email").custom((value, { req }) => {
      return User.getUserByEmail(value).then((user) => {
        if (user) {
          return Promise.reject("User with the same email already exists");
        }
      });
    }),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be minimum 6 characters long"),
  ],
  authControllers.signup
);

router.post("/get-user", isAuth, authControllers.getUser);

router.post("/search-users", isAuth, authControllers.searchUsers);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be minimum 6 characters long"),
  ],
  authControllers.login
);

module.exports = router;
