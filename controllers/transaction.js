const Mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const checkCheckinOrBooked = (startDate) => {
  const today = new Date();
  startDate = new Date(startDate);
  if (startDate.getFullYear() > today.getFullYear()) {
    return "Booked";
  } else {
    if (startDate.getMonth() > today.getMonth()) {
      return "Booked";
    } else {
      if (startDate.getDate() > today.getDate()) {
        return "Booked";
      } else if (startDate.getDate() === today.getDate()) {
        return "Checkin";
      }
    }
  }
};

exports.createTransaction = async (request, response) => {
  const { user, hotel, rooms, date, price, payment } = request.body;
  // console.log("request.body:", request.body);

  const foundUser = await User.findById(user._id);
  if (foundUser.username === "" || foundUser.fullName === "") {
    foundUser.username = user.fullName;
    foundUser.fullName = user.fullName;
  }
  if (foundUser.phoneNumber === "") {
    foundUser.phoneNumber = user.phoneNumber;
  }
  if (foundUser.identity === "") {
    foundUser.identity = user.identity;
  }
  await User.findByIdAndUpdate(user._id, {
    username: foundUser.username,
    fullName: foundUser.fullName,
    phoneNumber: foundUser.phoneNumber,
    identity: foundUser.identity,
  });

  const newTran = new Transaction({
    user: user,
    hotel: new Mongoose.Types.ObjectId(hotel),
    rooms: rooms,
    dateStart: date[0].startDate,
    dateEnd: date[0].endDate,
    price: price,
    payment: payment,
    status: checkCheckinOrBooked(date[0].startDate),
  });
  // console.log("=================");
  // console.log("newTran:", newTran);
  // newTran.save();

  response.end();
};
