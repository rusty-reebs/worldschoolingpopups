const mongoose = require("mongoose");

const Schema = mongooose.Schema();

const UserSchema = new Schema({
  firstname: { type: String, required: true, maxlength: 30 },
  lastname: { type: String, required: true, maxlength: 30 },
  email: { type: String, required: true, maxlength: 30 },
});

module.exports = mongoose.model("User", UserSchema);
