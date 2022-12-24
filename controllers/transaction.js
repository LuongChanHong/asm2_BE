const Mongoose = require("mongoose");
const User = require("../models/User");
const Hotel = require("../models/Hotel");
const Transaction = require("../models/Transaction");

exports.getTransactionByUserId = async (req, res) => {
  const userId = req.body.userId;
  //   console.log("userId:", userId);
  try {
    const transactions = await Transaction.find({ "user._id": userId }).select(
      "-user"
    );

    if (transactions.length > 0) {
      res.send(transactions);
    } else {
      res.statusMessage = "No transaction found";
      res.status(404).end();
    }
  } catch (err) {
    console.log("err:", err);
  }
};

exports.getLastestTransaction = async (req, res) => {
  try {
    const lastestList = await Transaction.find()
      .sort({ $natural: -1 })
      .limit(8);
    if (lastestList.length > 0) {
      // console.log("lastestList:", lastestList);
      res.send(lastestList);
    } else {
      res.statusMessage = "No Transaction Found";
      res.status(404).end();
    }
  } catch (err) {
    console.log("err:", err);
  }
};
