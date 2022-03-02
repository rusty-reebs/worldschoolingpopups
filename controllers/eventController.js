const Event = require("../models/event");
const { body, validationResult } = require("express-validator");
const getUserDetails = require("../src/utils/getUserDetails");

exports.index = async function (req, res, next) {
  let userDetails = "";
  try {
    if (req.signedCookies.jwt) {
      userDetails = getUserDetails(req.signedCookies.jwt);
    }
    let events = await Event.find();
    res.json({ userDetails: userDetails, events: events });
  } catch (err) {
    res.status(400).json({ message: err });
    console.log(err);
  }
};

// exports.event_search = async function (req, res, next) {
// try {
// console.log(req.query);
// let results = await Event.find({ req.query.key: } )
// } catch (err) {
// console.log(err);
// }
// };

exports.event_get = async function (req, res, next) {
  try {
    let event = await Event.findById(req.params.eventId).exec();
    res.send(event);
  } catch (err) {
    console.log(err);
  }
};

exports.event_post = [
  body("eventName", "Event must have a name.").trim().isLength({ min: 1 }),
  body("country", "Event must have a country.").isLength({ min: 1 }),
  body("city", "Event must have a city.").trim().isLength({ min: 1 }),
  body("lat", "Event must have a latitude.").trim().isNumeric().escape(),
  body("lon", "Event must have a longitude.").trim().isNumeric().escape(),
  // body("dateStart", "Event must have a start date.")
  //   .isLength({ min: 1 })
  //   .escape(),
  // body("dateEnd", "Event must have an end date.").isLength({ min: 1 }).escape(),
  body(
    "accomIncluded",
    "Event must specify if accommodations are included."
  ).isLength({ min: 1 }),
  // body("ageMin", "Event must have a minimum age.").trim().isNumeric().escape(),
  // body("ageMax", "Event must have a maximum age.").trim().isNumeric().escape(),
  body("tempHigh", "Temperature must be a number.")
    .if((value, { req }) => req.body.tempHigh)
    .trim()
    // .isNumeric()
    .escape(),
  body("tempLow", "Temperature must be a number.")
    .if((value, { req }) => req.body.tempLow)
    .trim()
    // .isNumeric()
    .escape(),
  body("description", "Event must have a description.")
    .trim()
    .isLength({ min: 1 }),
  body("contactName", "Event must have a contact name.")
    .trim()
    .isLength({ min: 1 }),
  body("contactEmail", "Event must have a valid contact email.")
    .if((value, { req }) => req.body.email)
    .trim()
    .isEmail(),
  body("contactFbPage", "Event FB page must be a valid URL.")
    .if((value, { req }) => req.body.contactFbPage)
    .trim()
    .isURL(),
  body("contactWebsite", "Event website must be a valid URL.")
    .if((value, { req }) => req.body.contactWebsite)
    .trim()
    .isURL(),
  async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    let newEvent = new Event({
      author: req.body.author,
      name: req.body.eventName,
      location: {
        country: req.body.country,
        city: req.body.city,
        lat: req.body.lat,
        lon: req.body.lon,
      },
      date: {
        eventType: req.body.eventType,
        start: req.body.dateStart,
        end: req.body.dateEnd,
      },
      accomIncluded: req.body.accomIncluded,
      age: {
        min: req.body.ageMin,
        max: req.body.ageMax,
      },
      temperature: {
        low: req.body.tempLow,
        high: req.body.tempHigh,
      },
      excursions: req.body.excursions,
      description: req.body.description,
      contact: {
        name: req.body.contactName,
        email: req.body.contactEmail,
        website: req.body.contactWebsite,
        fbPage: req.body.contactFbPage,
      },
      images: req.body.images,
    });
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      await newEvent.save(function (err) {
        if (err) {
          res.status(500).json({
            status: "Error",
            message: "Database write error.",
          });
          console.log(err);
        }
        res.status(200).json({ message: "New event posted!", newEvent });
      });
    }
  },
];
