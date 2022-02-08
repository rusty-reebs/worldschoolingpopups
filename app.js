// app.js

const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const eventController = require("./controllers/eventController");

const mongoDb = process.env.MONGO_URI;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("Error", console.error.bind(console, "Mongo connection error."));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("worldschoolingpopups");
});
app.get("/events", eventController.index);
// app.get("/events/:eventId", eventController.event_get);

app.post("/events", eventController.event_post);

app.listen(process.env.PORT, () =>
  console.log("Listening on port", process.env.PORT)
);
