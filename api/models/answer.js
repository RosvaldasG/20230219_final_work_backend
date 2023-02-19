const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  answerText: { type: String, required: [true, "can't be blank"] },
  userId: { type: String, required: [true, "can't be blank"] },
  questionId: { type: String, required: [true, "can't be blank"] },
  answerId: { type: String },
  likes: { type: Number },
});

module.exports = mongoose.model("FINAL_answers", questionSchema);
