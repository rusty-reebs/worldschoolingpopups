const Event = require("../models/event");
const Test = require("../models/test");
const { body, validationResult } = require("express-validator");

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
  async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    let testPost = new Test({
      name: req.body.eventName,
    });
    if (!errors.isEmpty()) {
      res.status(400).send(errors.array());
    } else {
      await testPost.save(function (err) {
        if (err) {
          res.status(500).json({
            status: "Error",
            message: "Database write error.",
          });
          console.log(err);
        }
        res.json(testPost);
      });
    }
    // res.json();
  },
];

exports.event_post = function (req, res, next) {
  const newEvent = new Event({
    name: req.body.eventName,
    location: {
      country: req.body.location.country,
      state: req.body.location.state,
      city: req.body.location.city,
    },
    date: {
      start: req.body.date.start,
      end: req.body.date.end,
    },
    accomIncluded: req.body.accomIncluded,
    age: {
      min: req.body.age.min,
      max: req.body.age.max,
    },
    temperature: {
      min: req.body.temperature.min,
      max: req.body.temperature.max,
    },
    cost: {
      amount: req.body.cost.amount,
      currency: req.body.cost.currency,
    },
    excursions: req.body.excursions,
    description: req.body.description,
    contact: {
      name: req.body.contact.name,
      email: req.body.contact.email,
    },
    website: req.body.website,
  });
  newEvent.save(function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.send("Event saved!");
};
