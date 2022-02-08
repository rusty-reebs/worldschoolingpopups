const Event = require("../models/event");

exports.index = async function (req, res, next) {
  try {
    let events = await Event.find({});
    res.send(events);
  } catch (err) {
    console.log(err);
  }
};

exports.event_post = function (req, res, next) {
  const newEvent = new Event({
    name: req.body.name,
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
//     "contact": {
//         "name": "Jaime Salonen",
//         "email": "plan.b.giver@gmail.com"
//     },
//     "website": "www.gpworldschool.com"
// }
