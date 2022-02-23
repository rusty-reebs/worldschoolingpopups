const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require("bcryptjs");
const User = require("./models/user");

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

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "tippy_toe",
    },
    function (jwtPayload, cb) {
      //find the user in the db if needed. This function may be omitted if you store everything you need in the JWT payload.
      return User.findById(jwtPayload.id)
        .then((user) => {
          return cb(null, user);
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);
