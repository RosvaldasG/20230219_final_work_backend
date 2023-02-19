const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  title: { type: String, required: [true, "can't be blank"] },
  questionText: { type: String, required: [true, "can't be blank"] },
  userId: { type: String, required: [true, "can't be blank"] },
  answerId: { type: Array },
  id: { type: String },
});

module.exports = mongoose.model("FINAL_questions", questionSchema);
