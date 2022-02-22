const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");

exports.register_post = [
  body("email", "You must provide a valid email address.")
    .isEmail()
    .normalizeEmail(),
  body("password", "Your password must contain at least 6 characters.")
    .trim()
    .isLength({ min: 6 }),
  body("confirm", "Your passwords must match.").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Your passwords must match.");
    }
    return true;
  }),
  async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    let user = new User({
      email: req.body.email,
      username: req.body.email,
      password: req.body.password,
    });
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      let userExists = await User.findOne({ email: user.email });
      if (userExists) {
        res
          .status(400)
          .json({ status: "Error", message: "Email already exists." });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
          if (err) {
            return res
              .status(500)
              .json({ status: "Error", message: "Password problem." });
          }
          user.password = hashedPassword;
          console.log(user.password);
          user.save(function (err) {
            if (err) {
              console.log(err);
              return res.status(500).json({
                status: "Error",
                message: "Database write error.",
              });
            }
            res.status(201).json({ newUser: user, message: "Success!" });
          });
        });
      }
    }
  },
];

exports.login_post = [
  body("username", "You must enter a valid email address.")
    .isEmail()
    .normalizeEmail(),

  (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    let username = req.body.username;
    let password = req.body.password;

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      User.findOne({ username: username }).exec(function (err, user) {
        if (err) {
          return res.status(500).json({
            status: "Error",
            message: "Database error.",
          });
        }
        if (!user) {
          res
            .status(400)
            .json({ status: "Error", message: "Email not found." });
        } else {
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
              console.log(err);
              res
                .status(400)
                .json({ status: "Error", message: "Password problem." });
              return done(null, false, { message: "Password problem." });
            }
            if (result) {
              console.log("You're logged in!");
              res.status(200).json({ message: "You're in!" });
              //   next();
            } else {
              res
                .status(400)
                .json({ status: "Error", message: "Check your password." });
            }
          });
        }
      });
    }
  },
];
