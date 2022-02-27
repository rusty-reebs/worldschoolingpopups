const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.register_post = [
  body("email", "You must provide a valid email address.")
    .isEmail()
    .normalizeEmail(),
  body("handle", "You must provide a username.").trim().isLength({ min: 2 }),
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
      handle: req.body.handle,
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
          console.log(user);
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
  body("password", "You must enter a password.").isLength({ min: 1 }),
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
            errors: [{ msg: "Database error." }],
          });
        }
        if (!user) {
          res.status(400).json({
            errors: [{ msg: "Email not found." }],
          });
        } else {
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
              console.log(err);
              res.status(400).json({
                errors: [{ msg: "Password problem." }],
              });
              return done(null, false, {
                errors: [{ msg: "Password problem." }],
              });
            }
            if (result) {
              console.log("You're logged in!");
              next();
            } else {
              res.status(400).json({
                errors: [{ msg: "Check your password." }],
              });
            }
          });
        }
      });
    }
  },
];
