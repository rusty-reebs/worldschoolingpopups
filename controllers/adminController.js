const Event = require("../models/event");
const { body, validationResult } = require("express-validator");
const getUserDetails = require("../src/utils/getUserDetails");

exports.index = async function (req, res, next) {
  try {
    let events = await Event.find()
      .sort({ "date.eventType": 1 })
      .sort({ "date.start": 1 });

    // get total record count
    let records = await Event.countDocuments();
    res.json({
      events: events,
      records: records,
    });
  } catch (err) {
    res.status(400).json({ message: err });
    console.log(err);
  }
};
