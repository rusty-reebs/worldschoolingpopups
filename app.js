// app.js

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
const user = require("./models/user");

const mongoDb = process.env.MONGO_URI;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("Error", console.error.bind(console, "Mongo connection error."));

const app = express();

const corsOptions = {
  origin: [
    "https://www.worldschoolingpopups.com",
    "https://www.worldschoolingpopups.com/",
    "https://www.worldschoolingpopups.com/events",
  ],
  allowedHeaders: "Content-Type",
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
  }
  return token;
};

const jwtOptions = {
  jwtFromRequest: fromExtractors([
    cookieExtractor,
    // fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: process.env.TOKEN,
  jwtCookieName: "jwt",
};

passport.use(
  new JWTStrategy(jwtOptions, (jwtPayload, done) => {
    //find the user in the db if needed. This function may be omitted if you store everything you need in the JWT payload.
    return User.findById(jwtPayload.user._id)
      .then((user) => {
        return done(null, user);
      })
      .catch((err) => {
        return done(err);
      });
  })
);

app.use(passport.initialize());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(jwtOptions.secretOrKey));

// app.use(cors());

app.get("/events", cors(corsOptions), eventController.index);
app.get("/events/:eventId", cors(corsOptions), eventController.event_get);

app.post("/register", cors(corsOptions), userController.register_post);

app.post(
  "/login",
  cors(corsOptions),
  userController.login_post,
  function (req, res, next) {
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
          expiresIn: "14d",
        });
        return res
          .cookie(jwtOptions.jwtCookieName, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            signed: true,
          })
          .status(200)
          .json({
            message: "Auth Passed",
          });
      });
    })(req, res);
  }
);

app.post(
  "/events",
  cors(corsOptions),
  passport.authenticate("jwt", { session: false }),
  eventController.event_post
);

// app.get(
//   "/auth",
//   passport.authenticate("jwt", { session: false }),
//   function (req, res, next) {
//     res.status(200).json({
//       message: "AUTH CALL SUCCESS!",
//       token: true,
//       user: { email: user.email, handle: user.handle, id: user._id },
//     });
//   }
// );

app.get(
  "/logout",
  cors(corsOptions),
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    req.logout();
    return res
      .clearCookie(jwtOptions.jwtCookieName)
      .status(200)
      .json({ message: "Successfully logged out." });
  }
);

app.listen(process.env.PORT, () =>
  console.log("Listening on port", process.env.PORT)
);
