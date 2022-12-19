const Mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Room = require("../models/Room");
const Hotel = require("../models/Hotel");

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

/**rooms
 * {_id: 6311c083f2fce6ea18172fba
    roomNumber: 101}
 */

// update each room`s roomNumbers`s unAvailableDates
const updateRoomNumbersDate = (roomNumbersIdList, dates) => {
  roomNumbersIdList.forEach(async (id) => {
    await Room.updateOne(
      { "roomNumbers._id": id },
      {
        $push: {
          "roomNumbers.$.unAvailableDates": dates,
        },
      }
    );
  });
};

const deleteDuplicate = (list) => {
  const result = [];
  let isExist = (list, id) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i]._id.toString() === id.toString()) return true;
    }
    return false;
  };

  list.forEach((item) => {
    if (!isExist(result, item._id)) {
      result.push(item);
    }
  });
  return result;
};

const formatRoomList = async (roomIdList) => {
  // get rooms have room number id match booked room number id
  let roomNumbers = await Promise.all(
    roomIdList.map((room) =>
      Room.findOne({ "roomNumbers._id": room }, ["roomNumbers"])
    )
  );
  roomNumbers = deleteDuplicate(roomNumbers);
  // console.log("roomNumbers:", roomNumbers);

  // split each room number into object
  const eachRNumber = [];
  roomNumbers.forEach((room) => {
    room.roomNumbers.forEach((number) => {
      eachRNumber.push({ _id: room._id, roomNumber: number });
    });
  });
  // console.log("eachRNumber:", eachRNumber);

  // format to final result
  let result = [];
  roomIdList.forEach((room) => {
    eachRNumber.forEach((item) => {
      if (item.roomNumber._id.toString() === room.toString()) {
        result.push(item);
      }
    });
  });
  result = result.map((item) => {
    return {
      _id: new Mongoose.Types.ObjectId(),
      roomId: item._id,
      roomNumber: {
        _id: new Mongoose.Types.ObjectId(),
        number: item.roomNumber.number,
      },
    };
  });
  // console.log("result:", result);
  return result;
};

exports.reserve = async (request, response) => {
  const { user, hotel, rooms, dates, price, payment } = request.body;
  //   console.log("request.body:", request.body)
  updateRoomNumbersDate(rooms, dates);
  const bookedRooms = await formatRoomList(rooms);
  const hotelName = await Hotel.findById(hotel).select("name");

  await User.findByIdAndUpdate(user._id, {
    username: user.username,
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    identity: user.identity,
  });

  // console.log("bookedRooms:", bookedRooms);

  const newTran = new Transaction({
    user: user,
    hotel: new Mongoose.Types.ObjectId(hotel),
    hotelName: hotelName.name,
    rooms: bookedRooms,
    dateStart: dates[0],
    dateEnd: dates[dates.length - 1],
    price: price,
    payment: payment,
    status: checkCheckinOrBooked(dates[0]),
  });
  // console.log("=================");
  // console.log("newTran:", newTran);
  newTran.save();
  // console.log("Room controller::User reverve success");
  response.end();
};

exports.getAllRoom = async (request, response) => {
  try {
    const rooms = await Room.find().select("title price maxPeople");
    response.send(rooms);
  } catch (error) {
    console.log("error:", error);
  }
};
