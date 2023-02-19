const bcrypt = require("bcryptjs");
const { rawListeners } = require("../models/userModel"); //neaišku kam
const jwt = require("jsonwebtoken");

const questionSchema = require("../models/question");
const userSchema = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

//  + CREATE QUESTION---------------------------------

module.exports.POST_QUESTION = async (req, res) => {
  const question = new questionSchema({
    title: req.body.title,
    questionText: req.body.questionText,
    userId: req.body.userId,
    answerId: [],
  });

  question
    .save()
    .then((result) => {
      questionSchema
        .updateOne({ _id: question._id }, { id: question._id })
        .exec();
      return res.status(200).json({
        response: "Ticket was created succses",
        result,
      });
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(400).json({ responce: "error" });
    });
};

// + GET ALL QUESTIONS -----------------------------------------

module.exports.GET_ALL_QUESTIONS = function (req, res) {
  questionSchema
    .find()
    .sort({ title: -1 })
    .then((results) => {
      return res.status(200).json({ Questions: results });
    });
};

// + DELETE QUESTION BY ID-----------------------------------------

module.exports.DELETE_QUESTION_BY_ID = function (req, res) {
  questionSchema.deleteOne({ _id: req.params.id }).then((results) => {
    return res.status(200).json({ status: "Deleted", Questions: results });
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
