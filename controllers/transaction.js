const Mongoose = require("mongoose");
const User = require("../models/User");
const Hotel = require("../models/Hotel");
const Transaction = require("../models/Transaction");

exports.getTransactionByUserId = async (request, response) => {
  const userId = request.body.userId;
  //   console.log("userId:", userId);
  try {
    const transactions = await Transaction.find({ "user._id": userId }).select(
      "-user"
    );

    if (transactions.length > 0) {
      response.send(transactions);
    } else {
      response.statusMessage = "No transaction found";
      response.status(404).end();
    }
  } catch (err) {
    console.log("err:", err);
  }
};

exports.getLastestTransaction = async (request, response) => {
  try {
    const lastestList = await Transaction.find()
      .sort({ $natural: -1 })
      .limit(8);
    if (lastestList.length > 0) {
      // console.log("lastestList:", lastestList);
      response.send(lastestList);
    } else {
      response.statusMessage = "No Transaction Found";
      response.status(404).end();
    }
  } catch (err) {
    console.log("err:", err);
  }
};
