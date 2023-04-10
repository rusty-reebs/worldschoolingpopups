// app.js

//TODO fix token expiration. Need to check token, if expired then go to login page.
//TODO "Your session has expired."

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const fromExtractors = ExtractJWT.fromExtractors;
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const User = require("./models/user");

require("dotenv").config();

const eventController = require("./controllers/eventController");
const userController = require("./controllers/userController");
const adminController = require("./controllers/adminController");
const user = require("./models/user");

const isDev = process.env.NODE_ENV === "development";
const mongoDb = isDev ? process.env.MONGO_DEV : process.env.MONGO_URI;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("Error", console.error.bind(console, "Mongo connection error."));

const app = express();

const corsOptions = {
  // origin: true, //! works with this
  origin: isDev
    ? ["http://127.0.0.1:3000", "http://localhost:3000"]
    : ["https://www.worldschoolingpopups.com"],
  preflightContinue: true,
  credentials: true,
  allowedHeaders: "Content-Type, Accept, Authorization",
  optionsSuccessStatus: 200,
};

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        console.log(err);
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Email not found." });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.log(err);
          return done(null, false, { message: "Password problem." });
        }
        if (result) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password." });
        }
      });
    });
  })
);

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.signedCookies[jwtOptions.jwtCookieName];
    // token = req.cookies[jwtOptions.jwtCookieName];
  }
  return token;
};

const jwtOptions = {
  jwtFromRequest: fromExtractors([cookieExtractor]),
  secretOrKey: process.env.TOKEN,
  jwtCookieName: "jwt",
};

passport.use(
  new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
    return User.findById(jwtPayload.user._id)
      .then((user) => {
        return done(null, user);
      })
      .catch((err) => {
        return done(err, false, info);
      });
  })
);

app.use(passport.initialize());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(jwtOptions.secretOrKey));

app.use(cors(corsOptions));

app.get("/events", eventController.index);
app.get("/events/:eventId", eventController.event_get);

app.post(
  "/events",
  passport.authenticate("jwt", { session: false }),
  eventController.event_post
);

app.post(
  "/events/:eventId/update",
  // passport.authenticate("jwt", { session: false }),
  eventController.event_update_post
);

app.post(
  "/events/:eventId/delete",
  passport.authenticate("jwt", { session: false }),
  eventController.event_delete_post
);

app.post(
  "/events/:eventId/archive",
  passport.authenticate("jwt", { session: false }),
  eventController.event_archive_post
);

app.get("/admin", (req, res, next) => {
  !isDev
    ? passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err || !user) return res.status(400).json(info);
        adminController.index(req, res, next);
      })(req, res, next)
    : adminController.index(req, res, next);
});

app.post("/login", userController.login_post, function (req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ message: "Authentication problem.", user: user });
    }
    console.log("USER", user);
    req.login(user, { session: false }, (err) => {
      if (err) {
        console.log("LOGIN ERROR", err);
        res.json(err);
      }
      const token = jwt.sign({ user }, jwtOptions.secretOrKey, {
        // expiresIn: "14d",
        expiresIn: 30,
      });
      return res
        .cookie(jwtOptions.jwtCookieName, token, {
          httpOnly: isDev,
          // secure: process.env.NODE_ENV === "production", //! USE FOR PROD
          // secure: true, //! USE FOR DEVELOPMENT
          secure: isDev ? false : true,
          signed: true,
          sameSite: "none",
        })
        .status(200)
        .json({
          message: "Auth Passed",
        });
    });
  })(req, res);
});

app.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    req.logout();
    return res
      .clearCookie(jwtOptions.jwtCookieName, {
        httpOnly: isDev,
        // secure: process.env.NODE_ENV === "production", //! USE FOR PRODUCTION
        // secure: true, //! USE FOR DEVELOPMENT
        secure: isDev ? false : true,
        sameSite: "none",
      })
      .status(200)
      .json({ message: "Successfully logged out." });
  }
);

// app.post("/register", userController.register_post);

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(process.env.PORT, () =>
  console.log("Listening on port", process.env.PORT)
);
