// app.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const eventController = require("./controllers/eventController");

const mongoDb = process.env.MONGO_URI;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("Error", console.error.bind(console, "Mongo connection error."));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("worldschoolingpopups");
});
app.get("/events", eventController.index);
app.get("/events/:eventId", eventController.event_get);

app.post("/events", eventController.event_post);
app.post("/tests", eventController.test_post);

app.get("/search", eventController.event_search);

app.listen(process.env.PORT, () =>
  console.log("Listening on port", process.env.PORT)
);

// Notes for authentication, how to get the error messages
// //Route

// .post(
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/auth/login",
//     failureMessage: true,
//   })
// );

// //Controller

// exports.handleLogin = (req, res, next) => {
// res.render("login-form", { error: req.session.messages });
// };

// exports.user_login_post = (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) return next(err);
//     if (!user) return res.render('login', { message: info.message });
//     req.login(user, (err) => {
//       if (err) return next(err);

//       res.redirect('/');
//     });
//   })(req, res, next);
// };

// app.post('/form', [
//   check('name').isLength({ min: 3 }),
//   check('email').custom(email => {
//     if (alreadyHaveEmail(email)) {
//       throw new Error('Email already registered')
//     }
//   }),
//   check('age').isNumeric()
// ], (req, res) => {
//   const name  = req.body.name
//   const email = req.body.email
//   const age   = req.body.age
// })
