const Event = require("../models/event");
const Test = require("../models/test");
const { body, validationResult } = require("express-validator");
const req = require("express/lib/request");

exports.index = async function (req, res, next) {
  //   let { location: { country } } = req.query;
  console.log(req.query);
  let query = {};
  if (req.query.accomIncluded) query.accomIncluded = req.query.accomIncluded;
  if (req.query.location) {
    //! get nested property
    console.log("COUNTRY TRUE");
  } else
    try {
      let events = await Event.find(query);
      res.send(events);
    } catch (err) {
      res.status(400).json({ message: err });
      console.log(err);
    }
};

exports.event_search = async function (req, res, next) {
  try {
    console.log(req.query);
    // let results = await Event.find({ req.query.key: } )
  } catch (err) {
    console.log(err);
  }
};

exports.event_get = async function (req, res, next) {
  try {
    console.log(req);
    let event = await Event.findById(req.params.eventId).exec();
    res.send(event);
  } catch (err) {
    console.log(err);
  }
};

exports.test_post = [
  body("eventName", "Event must have a name.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("contactName", "Event must have a contact name.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    let testPost = new Test({
      name: req.body.eventName,
      contactName: req.body.contactName,
    });
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      await testPost.save(function (err) {
        if (err) {
          res.status(500).json({
            status: "Error",
            message: "Database write error.",
          });
          console.log(err);
        }
        res.status(200).json(testPost);
      });
    }
  },
];

exports.event_post = [
  body("eventName", "Event must have a name.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("country", "Event must have a country.").isLength({ min: 1 }).escape(),
  body("city", "Event must have a city.").trim().isLength({ min: 1 }).escape(),
  body("lat", "Event must have a latitude.").trim().isNumeric().escape(),
  body("lon", "Event must have a longitude.").trim().isNumeric().escape(),
  // body("dateStart", "Event must have a start date.")
  //   .isLength({ min: 1 })
  //   .escape(),
  // body("dateEnd", "Event must have an end date.").isLength({ min: 1 }).escape(),
  body("accomIncluded", "Event must specify if accommodations are included.")
    .isLength({ min: 1 })
    .escape(),
  body("ageMin", "Event must have a minimum age.").trim().isNumeric().escape(),
  body("ageMax", "Event must have a maximum age.").trim().isNumeric().escape(),
  body("tempHigh", "Event must have an average high temperature.")
    .trim()
    .isNumeric()
    .escape(),
  body("tempLow", "Event must have an average low temperature.")
    .trim()
    .isNumeric()
    .escape(),
  body("description", "Event must have a description.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("contactName", "Event must have a contact name.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("contactEmail", "Event must have a valid contact email.")
    .trim()
    .isEmail()
    .escape(),
  body("contactFbPage", "Event FB page must be a valid URL.")
    .if((value, { req }) => req.body.contactFbPage)
    .trim()
    .isURL()
    .escape(),
  body("contactWebsite", "Event website must be a valid URL.")
    .if((value, { req }) => req.body.contactWebsite)
    .trim()
    .isURL()
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    let newEvent = new Event({
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
      // cost: {
      // amount: req.body.cost.amount,
      // currency: req.body.cost.currency,
      // },
      // excursions: req.body.excursions,
      description: req.body.description,
      contact: {
        name: req.body.contactName,
        email: req.body.contactEmail,
        website: req.body.contactWebsite,
        fbPage: req.body.contactFbPage,
      },
      // images: {
      //   image1: {
      //     url: req.body.images.image1.url,
      //     cloudinary_id: req.body.images.image1.cloudinary_id,
      //   },
      //   image2: {
      //     url: req.body.images.image2.url,
      //     cloudinary_id: req.body.images.image2.cloudinary_id,
      //   },
      //   image3: {
      //     url: req.body.images.image3.url,
      //     cloudinary_id: req.body.images.image3.cloudinary_id,
      //   },
      // },
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
        res.status(200).json(newEvent);
      });
    }
  },
];
