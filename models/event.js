const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventSchema = new Schema({
  name: { type: String, required: true, maxlength: 300 },
  location: {
    country: { type: String, required: true },
    state: { type: String },
    city: { type: String, required: true, maxlength: 100 },
  },
  date: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  accomIncluded: { type: Boolean, required: true },
  age: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  temperature: {
    min: { type: Number },
    max: { type: Number },
  },
  cost: {
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  excursions: { type: String, maxlength: 1000 },
  description: { type: String, required: true, maxlength: 2000 },
  contact: {
    name: { type: String, required: true, maxlength: 30 },
    email: { type: String, required: true, maxlength: 30 },
  },
  website: { type: String, maxlength: 50 },
});

EventSchema.virtual("url").get(function () {
  return "/events/" + this._id;
});

module.exports = mongoose.model("Event", EventSchema);
