const bcrypt = require("bcryptjs");
const { rawListeners } = require("../models/userModel"); //neaišku kam
const jwt = require("jsonwebtoken");

const answerSchema = require("../models/answer");
const questionSchema = require("../models/question");
const userSchema = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

//  + POST ANSWER---------------------------------

module.exports.POST_ANSWER = async (req, res) => {
  const jwt_token = req.headers.user_jwt;
  const tokenInfo = jwt.verify(jwt_token, process.env.JWT_SECRET);
  console.log(tokenInfo.userId);
  const answer = new answerSchema({
    answerText: req.body.answerText,
    userId: tokenInfo.userId,
    questionId: req.params.id,
    timeStamp: new Date(),
    likes: 0,
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
          { _id: tokenInfo.userId },
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
      const countAnswers = results.reduce((counter, obj) => {
        // suskaičiuoja USERS pagal _id
        console.log(counter);
        if (obj._id) counter += 1;
        return counter;
      }, 0);
      console.log(results);
      return res.status(200).json({ results, countAnswers });
    });
};

// // + DELETE ANSWER BY ID-----------------------------------------

// module.exports.DELETE_ANSWER_BY_ID = function (req, res) {
//   answerSchema.deleteOne({ _id: req.params.id }).then((results) => {
//     return res.status(200).json({ status: "Deleted", Answers: results });
//   });
// };

module.exports.DELETE_ANSWER_BY_ID = async function (req, res) {
  try {
    const jwt_token = req.headers.user_jwt;
    if (!jwt_token) {
      return res.status(401).end();
    }
    const tokenInfo = jwt.verify(jwt_token, process.env.JWT_SECRET);

    const answerData = await answerSchema
      .findOne({ _id: req.params.id })
      .exec();

    if (!(tokenInfo.userId === answerData.userId)) return res.status(401).end();

    await answerSchema.deleteOne({ _id: req.params.id }).exec();
    await questionSchema
      .updateOne(
        { _id: answerData.questionId },
        { $pull: { answerId: answerData.answerId } }
      )
      .exec();
    await userSchema
      .updateOne(
        { _id: answerData.userId },
        { $pull: { answers: answerData.answerId } }
      )
      .exec();
    return res.status(200).json({ status: "Deleted" });
  } catch (error) {
    res.status(500).json({ response: "Failed" });
  }
};

module.exports.CHANGE_ANSWER_LIKES = async function (req, res) {
  try {
    // const jwt_token = req.headers.user_jwt;
    // if (!jwt_token) {
    //   return res.status(401).end();
    // }
    // const tokenInfo = jwt.verify(jwt_token, process.env.JWT_SECRET);

    const likes = req.body.likes;

    const answerData = await answerSchema
      .findOne({ _id: req.params.id })
      .exec();
    console.log(answerData.likes, likes);
    // console.log(DateTime.Now("yyyy-MM-dd"));
    const updatedLikes = answerData.likes + likes;

    console.log(updatedLikes);
    // if (!(tokenInfo.userId === answerData.userId)) return res.status(401).end();

    await answerSchema
      .updateOne({ _id: req.params.id }, { likes: updatedLikes })
      .exec();
    return res.status(200).json({ status: "ddd" });
  } catch (error) {
    res.status(500).json({ response: "Failed" });
  }
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
