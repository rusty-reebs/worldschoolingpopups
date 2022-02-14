const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TestSchema = new Schema({
  name: { type: String, required: true, maxlength: 300 },
});

TestSchema.virtual("url").get(function () {
  return "tests/" + this._id;
});

module.exports = mongoose.model("Test", TestSchema);
