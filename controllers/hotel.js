const Mongoose = require("mongoose");
const Hotel = require("../models/Hotel");
const Transaction = require("../models/Transaction");
const Room = require("../models/Room");
const { request } = require("express");

// compare 2 date to know is later, earlier or same time
const compareDate = (dateA, dateB) => {
  if (dateA.getUTCFullYear() > dateB.getUTCFullYear()) {
    return "later";
  } else if (dateA.getUTCFullYear() < dateB.getUTCFullYear()) {
    return "earlier";
  } else {
    if (dateA.getUTCMonth() > dateB.getUTCMonth()) {
      return "later";
    } else if (dateA.getUTCMonth() < dateB.getUTCMonth()) {
      return "earlier";
    } else {
      if (dateA.getUTCDate() > dateB.getUTCDate()) {
        return "later";
      } else if (dateA.getUTCDate() < dateB.getUTCDate()) {
        return "earlier";
      } else {
        return "same";
      }
    }
  }
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

// update transaction status until today
const updateTransactionStatus = () => {
  // console.log("TRANSACTION UPDATED");
  const toDay = new Date();
  Transaction.find()
    .then((trans) => {
      trans.forEach((tran) => {
        const compateDateStart = compareDate(toDay, tran.dateStart);
        const compateDateEnd = compareDate(toDay, tran.dateEnd);

        if (compateDateStart === "earlier" && compateDateEnd === "earlier") {
          Transaction.findByIdAndUpdate(tran._id, { status: "Booked" })
            .then((result) => {
              // console.log("Booked:", result);
            })
            .catch((err) => console.log("::ERROR:", err));
        }
        if (compateDateStart === "later" && compateDateEnd === "later") {
          Transaction.findByIdAndUpdate(tran._id, { status: "Checkout" })
            .then((result) => {
              // console.log("Checkout:", result);
            })
            .catch((err) => console.log("::ERROR:", err));
        }
        if (
          (compateDateStart === "same" && compateDateEnd === "earlier") ||
          (compateDateStart === "later" && compateDateEnd === "earlier")
        ) {
          Transaction.findByIdAndUpdate(tran._id, { status: "Checkin" })
            .then((result) => {
              // console.log("Checkin:", result);
            })
            .catch((err) => console.log("::ERROR:", err));
        }
      });
    })
    .catch((err) => console.log("::ERROR:", err));
};

const filterHotelByCity = (hotels) => {
  const result = [
    {
      cityName: "Ho Chi Minh",
      imageUrl:
        "https://lp-cms-production.imgix.net/2021-01/shutterstockRF_718619590.jpg",
      quantity: 0,
    },
    {
      cityName: "Ha Noi",
      imageUrl:
        "https://cdn3.ivivu.com/2022/07/h%E1%BB%93-g%C6%B0%C6%A1m-du-l%E1%BB%8Bch-H%C3%A0-N%E1%BB%99i-ivivu.jpg",
      quantity: 0,
    },
    {
      cityName: "Da Nang",
      imageUrl:
        "https://cdn1.vietnamtourism.org.vn/images/content/934a27a870ce686ce1672a7b7117e576.jpg",
      quantity: 0,
    },
  ];

  hotels.forEach((hotel) => {
    const cityName = hotel.city;
    const index = result.findIndex((item) => item.cityName === cityName);
    if (index > -1) {
      result[index].quantity++;
    }
  });
  return result;
};

const filterPropertyByType = (hotels) => {
  const result = [
    {
      type: "hotel",
      imageUrl:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWwlMjByb29tfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
      quantity: 0,
    },
    {
      type: "apartment",
      imageUrl:
        "https://furnishrcdn-134f8.kxcdn.com/wp-content/uploads/2020/02/Sandy_apartment_daylight-e1584735599779.jpg",
      quantity: 0,
    },
    {
      type: "resort",
      imageUrl:
        "https://media.cntraveler.com/photos/5f89a04c832eef138f7b94e9/16:9/w_1280,c_limit/Dorado%20Beach,%20a%20Ritz-Carlton%20Reserve.jpg",
      quantity: 0,
    },
    {
      type: "villa",
      imageUrl:
        "https://e8rbh6por3n.exactdn.com/sites/uploads/2020/05/villa-la-gi-thumbnail.jpg?strip=all&lossy=1&ssl=1",
      quantity: 0,
    },
    {
      type: "cabin",
      imageUrl:
        "https://images.ctfassets.net/gxwgulxyxxy1/0Bu5ExcClizeeLLxT0tiB/999893b65383b25aa67e28e82dd53519/1c1d81b0-162b-4f81-a742-271cd4e64204.lg1.jpg",
      quantity: 0,
    },
  ];
  hotels.forEach((hotel) => {
    const type = hotel.type;
    const index = result.findIndex((item) => item.type === type);
    if (index > -1) {
      result[index].quantity++;
    }
  });
  return result;
};

const filterHotelByRating = (hotels) => {
  // const result = hotels.sort((a, b) => (a.rating > b.rating ? -1 : 1));
  const result = hotels.sort((a, b) => b.rating - a.rating);
  // console.log("========================");
  // result.forEach((hotel) => console.log("hotel.rating:", hotel.rating));
  return result;
};

exports.getHotelsbyArea = (request, response, next) => {
  Hotel.find()
    .then((hotels) => {
      if (hotels.length > 0) {
        const hotelByCity = filterHotelByCity(hotels);
        const propertyByType = filterPropertyByType(hotels);
        const hotelByRating = filterHotelByRating(hotels);
        response.send({
          hotelByCity: hotelByCity,
          propertyByType: propertyByType,
          hotelByRating: hotelByRating,
        });
      } else {
        response.statusMessage = "No hotels found";
        response.status(404).end();
      }
    })
    .catch((err) => console.log("::ERROR:", err));
};

const searchHotelByLocation = async (location) => {
  const result = await Hotel.find({ city: location });
  return result;
};

// calculate the calendar user will stay
const calTimeStay = (start, end) => {
  // console.log("start:", start);
  // console.log("end:", end);

  // convert date object to string
  const dateToString = (date) => {
    return (
      date.getUTCFullYear().toString() +
      "-" +
      (date.getUTCMonth() + 1).toString() +
      "-" +
      date.getUTCDate().toString()
    );
  };

  const stayCalendar = [dateToString(start)];

  // set number of day
  const daysNumber = end.getUTCDate() - start.getUTCDate() - 1;
  for (let i = 1; i <= daysNumber; i++) {
    let date = start;
    // add date of date object to 1
    date.setDate(date.getUTCDate() + 2);

    stayCalendar[i] = dateToString(date);
  }

  // add the last day user stay
  stayCalendar[stayCalendar.length] = dateToString(end);

  // convert date string items to date object items
  stayCalendar.forEach((item, i) => (stayCalendar[i] = new Date(item)));
  // console.log("stayCalendar:", stayCalendar);

  return stayCalendar;
};

//
const addHotelIdToRoomList = async (roomList) => {
  // create room list that have hotel id
  // for add hotel id to empty room list
  const _allHotelRooms = [];
  const allHotelRooms = await Hotel.find({}).select("rooms");
  allHotelRooms.forEach((hotel) => {
    hotel.rooms.forEach((room) => {
      _allHotelRooms.push({ hotelId: hotel._id, roomId: room });
    });
  });
  // add hotel id to empty room object item
  listA = [...roomList];

  _allHotelRooms.forEach((item) => {
    listA.forEach((aRoom, index) => {
      if (aRoom.roomId.toString() === item.roomId.toString()) {
        roomList[index] = {
          ...roomList[index],
          hotelId: item.hotelId,
        };
      }
    });
  });
  return roomList;
};

// find checked out hotel rooms
const findCheckedOutRooms = async () => {
  // find all checkout room
  _allCheckoutRoom = [];
  const checkoutTran = await Transaction.find({ status: "Checkout" }).select(
    "_id rooms hotel"
  );
  // console.log("checkoutTran[3]:", checkoutTran[3]);

  checkoutTran.forEach((item) => {
    item.rooms.forEach((room) => {
      const pushItem = {
        roomId: room.roomId,
        roomNumber: room.roomNumber,
        hotelId: item.hotel,
      };
      const isExist = _allCheckoutRoom.find(
        (item) =>
          item.roomNumber._id.toString() === room.roomNumber._id.toString()
      );
      if (!isExist) {
        _allCheckoutRoom.push(pushItem);
      }
    });
  });

  // console.log("_allCheckoutRoom:", _allCheckoutRoom);

  // find all other status rooms
  _otherStatusRoom = [];
  const otherStatusTran = await Transaction.find({
    $or: [{ status: "Checkin" }, { status: "Booking" }],
  });
  otherStatusTran.forEach((tran) => {
    tran.rooms.forEach((room) => {
      _otherStatusRoom.push({
        roomId: room.roomId,
        roomNumber: room.roomNumber,
        hotelId: tran.hotel,
      });
    });
  });

  // exclude old checkout rooms being booked again
  _allCheckoutRoom.forEach((cRoom, index) => {
    _otherStatusRoom.forEach((oRoom) => {
      if (
        cRoom.hotelId.toString() === oRoom.hotelId.toString() &&
        cRoom.roomId.toString() === oRoom.roomId.toString() &&
        cRoom.roomNumber == oRoom.roomNumber
      ) {
        _allCheckoutRoom.splice(index, 1);
      }
    });
  });

  return _allCheckoutRoom;
};

// find all empty rooms not include in any transaction
const findOtherEmptyRooms = async () => {
  const roomList = await Room.find().select("roomNumbers");
  const tranList = await Transaction.find().select("rooms");
  let _roomList = [];
  let _tranList = [];
  // create room item that have only 1 room number in each
  roomList.forEach((room) =>
    room.roomNumbers.forEach((number) => {
      _roomList.push({ roomId: room._id, roomNumber: number });
    })
  );

  // get all room in transaction list
  tranList.forEach((tran) => {
    tran.rooms.forEach((room) => {
      _tranList.push({
        roomId: room.roomId,
        roomNumber: room.roomNumber,
      });
    });
  });

  // get all rooms that not include in any transaction
  for (let i = 0; i < _roomList.length; i++) {
    let roomItem = _roomList[i];
    _tranList.forEach((tranRoom) => {
      if (
        roomItem.roomNumber._id.toString() ===
        tranRoom.roomNumber._id.toString()
      ) {
        _roomList.splice(i, 1);
      }
    });
  }
  _roomList = await addHotelIdToRoomList(_roomList);
  return _roomList;
};

// find hotels have enough room for user booking request
const findHotelsWithEnoughRooms = async (require, emptyRoomList) => {
  let hotelList = await Hotel.find({ city: require.destination }).select(
    "_id city"
  );

  hotelList = hotelList.map((hotel) => {
    return { ...hotel._doc, emptyRooms: 0 };
  });
  // Count total empty room for each hotel
  hotelList.forEach((hotel) => {
    emptyRoomList.forEach((room) => {
      if (hotel._id.toString() === room.hotelId.toString()) {
        hotel.emptyRooms += 1;
      }
    });
  });
  // Delete hotel that don't have enough room by user require
  hotelList.forEach((hotel, i) => {
    if (hotelList.emptyRooms > require.options.room) {
      hotel.splice(i, 1);
    }
  });
  // Fetch hotel detail for output
  hotelList = await Promise.all(
    hotelList.map((hotel) => {
      return Hotel.findById(hotel._id);
    })
  );

  return hotelList;
};

exports.searchHotels = async (request, response, next) => {
  const hardData = await Hotel.find();

  const requireData = request.body;

  const hotelsByLocation = await searchHotelByLocation(requireData.destination);
  // console.log("hotelsByLocation:", hotelsByLocation);
  if (hotelsByLocation.length > 0) {
    // update transaction status
    updateTransactionStatus();

    const checkedOutRooms = await findCheckedOutRooms(
      requireData.date,
      hotelsByLocation
    );

    const otherEmptyRooms = await findOtherEmptyRooms();

    // console.log("===================");
    // console.log("checkedOutRooms.length:", checkedOutRooms.length);
    // console.log("otherEmptyRooms.length:", otherEmptyRooms.length);

    const allEmptyRooms = checkedOutRooms.concat(otherEmptyRooms);

    const validHotels = await findHotelsWithEnoughRooms(
      requireData,
      allEmptyRooms
    );

    // console.log("validHotels.length:", validHotels.length);
    response.send(validHotels);
  } else {
    response.statusMessage = "not found hotels";
    response.status(404).end();
  }
};

exports.getHotelById = (request, response, next) => {
  const id = request.params.id;
  Hotel.findById(new Mongoose.Types.ObjectId(id))
    .then((hotel) => {
      if (hotel) {
        response.send(hotel);
      } else {
        response.statusMessage = "not found hotel";
        response.status(404).end();
      }
    })
    .catch((err) => console.log("::ERROR:", err));
};

exports.getRoomOfHotel = async (request, response, next) => {
  const hotelId = request.params.id;
  // console.log("request.params:", request.params);
  const hotel = await Hotel.findById(hotelId);
  const rooms = await Promise.all(
    hotel.rooms.map((room) => {
      const roomDetail = Room.findById(room);
      return roomDetail;
    })
  );

  if (rooms.length > 0) {
    response.send(rooms);
  } else {
    response.statusMessage = "no rooms found";
    response.status(404).end();
  }
};
