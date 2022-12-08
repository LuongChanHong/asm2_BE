const Mongoose = require("mongoose");
const User = require("../models/User");
const Room = require("../models/Room");

const checkCheckinOrBooked = (startDate) => {
  const today = new Date();
  const date = new Date(startDate);
  //   console.log(
  //     "today:",
  //     today.getUTCDate(),
  //     "-",
  //     today.getUTCMonth(),
  //     "-",
  //     today.getUTCFullYear()
  //   );
  //   console.log(
  //     "date:",
  //     date.getUTCDate() + 1,
  //     "-",
  //     date.getUTCMonth(),
  //     "-",
  //     date.getUTCFullYear()
  //   );
  if (date.getUTCFullYear() > today.getUTCFullYear()) {
    return "Booked";
  } else {
    if (date.getUTCMonth() > today.getUTCMonth()) {
      return "Booked";
    } else {
      if (date.getUTCDate() + 1 > today.getUTCDate()) {
        return "Booked";
      } else if (date.getUTCDate() + 1 === today.getUTCDate()) {
        return "Checkin";
      }
    }
  }
};

exports.reserve = async (request, response) => {
  const { user, hotel, rooms, dates, price, payment } = request.body;
  //   console.log("request.body:", request.body)
  //   rooms.forEach(async (room) => {
  //     console.log("room:", room);
  //     await Room.updateOne(
  //       { "roomNumbers._id": room },
  //       {
  //         $push: {
  //           "roomNumbers.$.unAvailableDates": dates,
  //         },
  //       }
  //     );
  //   });

  //   await User.findByIdAndUpdate(user._id, {
  //     username: user.username,
  //     fullName: user.fullName,
  //     phoneNumber: user.phoneNumber,
  //     identity: user.identity,
  //   });
  const newTran = new Transaction({
    user: user,
    hotel: new Mongoose.Types.ObjectId(hotel),
    rooms: "",
    dateStart: dates[0],
    dateEnd: dates[dates.length],
    price: price,
    payment: payment,
    status: checkCheckinOrBooked(dates[0]),
  });
  // console.log("=================");
  // console.log("newTran:", newTran);
  // newTran.save();
  //   response.end();
};
