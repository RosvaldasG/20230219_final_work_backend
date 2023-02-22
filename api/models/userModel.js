const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, "is invalid"],
    index: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, "is invalid"],
    index: true,
  },
  password: {
    type: String,

    required: [true, "can't be blank"],

    // match: [/([A-Z]|[a-z]|[^<>()[]\/.,;:\s@"]){6,}/, "is invalid"],
  },
  questions: { type: Array },
  answers: { type: Array },
  timeStamp: { type: String },
  id: { type: String },

  // reg_timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FINAL_users", userSchema);
