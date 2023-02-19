const bcrypt = require("bcryptjs");
const { rawListeners } = require("../models/userModel"); //neaišku kam
const jwt = require("jsonwebtoken");

const answerSchema = require("../models/answer");
const questionSchema = require("../models/question");
const userSchema = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

//  + POST ANSWER---------------------------------

module.exports.POST_ANSWER = async (req, res) => {
  const answer = new answerSchema({
    answerText: req.body.answerText,
    userId: req.body.userId,
    questionId: req.params.id,
  });

  console.log("id iŠ linijos", req.params.id);

  answer
    .save()
    .then((result) => {
      answerSchema
        .updateOne({ _id: answer._id }, { answerId: answer._id })
        .exec();
      console.log("ID answer", result._id.toString());
      questionSchema
        .updateOne(
          { _id: req.params.id },
          { $push: { answerId: result._id.toString() } }
        )
        .exec();
      userSchema
        .updateOne(
          { _id: req.body.userId },
          { $push: { answers: result._id.toString() } }
        )
        .exec();
      return res.status(200).json({
        response: "Answer was created succses",
        result,
      });
    })
    // .then((result) => {
    //   console.log(result);
    // })
    .catch((err) => {
      console.log("err", err);
      res.status(400).json({ responce: "error" });
    });
};

// + GET ALL ANSWERS BY QUESTION ID -----------------------------------------

module.exports.GET_ALL_ANSWERS_BY_QUESTION_ID = function (req, res) {
  console.log(req.params.id);
  answerSchema
    .find({ questionId: req.params.id })
    .sort({ title: -1 })
    .then((results) => {
      console.log(results);
      return res.status(200).json({ Answers: results });
    });
};

// // + DELETE ANSWER BY ID-----------------------------------------

module.exports.DELETE_ANSWER_BY_ID = function (req, res) {
  answerSchema.deleteOne({ _id: req.params.id }).then((results) => {
    return res.status(200).json({ status: "Deleted", Answers: results });
  });
};

// // BUY TICKET-------------------------------------

// module.exports.BUY_TICKET = async function (req, res) {
//   const ticket = await ticketsSchema
//     .findOne({ _id: req.body.ticket_id })
//     .exec();

//   console.log(ticket.ticket_price);

//   const user = await userSchema.findOne({ _id: req.body.user_id }).exec();

//   console.log(user);

//   const moneyLeft = user.money_balance - ticket.ticket_price;
//   console.log(moneyLeft);

//   if (moneyLeft >= 0) {
//     userSchema
//       .updateOne(
//         { _id: req.body.user_id },
//         { $push: { bought_tickets: ticket._id.toString() } }
//       )
//       .updateOne({ _id: req.body.user_id }, { money_balance: moneyLeft })

//       .then((result) => {
//         res.status(200).json({ Message: "Ticket bought" });
//       });
//   } else {
//     return res.status(400).json({ Message: "not enought money" });
//   }
// };
