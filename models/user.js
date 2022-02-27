const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, maxlength: 30 },
  handle: { type: String, required: true, maxlength: 30 },
  password: { type: String, required: true, maxlength: 100 },
  username: { type: String, required: true, maxlength: 30 },
});

module.exports = mongoose.model("User", UserSchema);
