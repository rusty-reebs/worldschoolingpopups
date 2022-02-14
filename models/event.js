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
  images: {
    image1: { type: String, maxlength: 250 },
    image2: { type: String, maxlength: 250 },
    image3: { type: String, maxlength: 250 },
  },
  contact: {
    name: { type: String, required: true, maxlength: 30 },
    email: { type: String, required: true, maxlength: 30 },
  },
  website: { type: String, maxlength: 50 },
});

EventSchema.virtual("url").get(function () {
  return "events/" + this._id;
});

module.exports = mongoose.model("Event", EventSchema);

// {
//     "name": "My event",
//     "location": {
//         "country": "Canada",
//         "state": "AB",
//         "city": "Grande Prairie"
//     },
//     "date": {
//         "start": "03-01-2022",
//         "end": "03-15-2022"
//     },
//     "accomIncluded": "true",
//     "age": {
//         "min": "6",
//         "max": "18"
//     },
//     "temperature": {
//         "min": "-20",
//         "max": "15"
//     },
//     "cost": {
//         "amount": "500",
//         "currency": "CAD"
//     },
//     "excursions": "Optional day trip to Dinosaur Museum",
//     "description": "Pop up in beautiful GPAB. Come learn about Canada's working city.",
//     "images": {
//       "image1": "https://res.cloudinary.com/dnwnw3z4z/image/upload/v1644442931/worldschoolingpopups/gpab_e9dlky.jpg",
//       "image2": "",
//       "image3": ""
//     }
//     "contact": {
//         "name": "Jaime Salonen",
//         "email": "plan.b.giver@gmail.com"
//     },
//     "website": "www.gpworldschool.com"
// }

// {
//     "name": "Bali Pop Up",
//     "location": {
//         "country": "Indonesia",
//         "state": "Bali",
//         "city": "Ubud"
//     },
//     "date": {
//         "start": "04-01-2022",
//         "end": "04-15-2022"
//     },
//     "accomIncluded": "false",
//     "age": {
//         "min": "10",
//         "max": "16"
//     },
//     "temperature": {
//         "min": "18",
//         "max": "32"
//     },
//     "cost": {
//         "amount": "100",
//         "currency": "USD"
//     },
//     "excursions": "Daily excursions to the yoga studio.",
//     "description": "Come enjoy Bali while you learn.",
//     "images": {
//       "image1": "",
//       "image2": "",
//       "image3": ""
//     },
//     "contact": {
//         "name": "Ketut Mendra",
//         "email": "ketut@gmail.com"
//     },
//     "website": "www.baliworldschool.com"
// }
