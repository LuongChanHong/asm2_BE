const Mongoose = require("mongoose");
const User = require("../models/User");
const Hotel = require("../models/Hotel");
const Transaction = require("../models/Transaction");

exports.getTransactionByUserId = async (request, response) => {
  const userId = request.body.userId;
  //   console.log("userId:", userId);
  try {
    let transactions = await Transaction.find({ "user._id": userId }).select(
      "-user"
    );

    const hotelInfo = await Promise.all(
      transactions.map((item) => {
        const info = Hotel.findById(item.hotel).select("name");
        return info;
      })
    );

    transactions = transactions.map((tran, i) => {
      return { ...tran._doc, hotelName: hotelInfo[i].name };
    });

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
