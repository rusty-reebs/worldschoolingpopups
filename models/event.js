const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, maxlength: 300 },
  location: {
    country: { type: String, required: true },
    state: { type: String },
    city: { type: String, required: true, maxlength: 100 },
    lat: { type: Number, required: true, maxlength: 15 },
    lon: { type: Number, required: true, maxlength: 15 },
  },
  date: {
    eventType: { type: Boolean, required: true },
    start: { type: Date },
    end: { type: Date },
  },
  accomIncluded: { type: Boolean, required: true },
  age: {
    min: { type: Number },
    max: { type: Number },
  },
  temperature: {
    high: { type: String },
    low: { type: String },
  },
  excursions: [{ type: String, maxlength: 1000 }],
  description: { type: String, required: true, maxlength: 2000 },
  images: [{ url: String, cloudinary_id: String }],
  contact: {
    name: { type: String, maxlength: 30 },
    email: { type: String, maxlength: 30 },
    website: { type: String, maxlength: 50 },
    fbPage: { type: String, maxlength: 50 },
  },
});

EventSchema.virtual("url").get(function () {
  return "events/" + this._id;
});

module.exports = mongoose.model("Event", EventSchema);
