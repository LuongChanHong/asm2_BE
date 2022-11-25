const Mongoose = require("mongoose");
const Hotel = require("../models/Hotel");
const Transaction = require("../models/Transaction");
const Room = require("../models/Room");

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
  const result = [];
  const hotelList = await Hotel.find();
  hotelList.forEach((hotel) => {
    let city = hotel.city.replace(/ /g, "");
    if (city.toLowerCase() === location.toLowerCase()) {
      result.push(hotel);
    }
  });
  // console.log("========================");
  // result.forEach((item) => {
  //   console.log("item.name:", item.name);
  //   console.log("item.city:", item.city);
  // });
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

// find checked out hotel rooms
const findCheckedOutRooms = async (date, hotelList) => {
  // startDate = new Date(date[0].startDate);
  // endDate = new Date(date[0].endDate);
  // // calculate the calendar user will stay
  // const stayCalendar = calTimeStay(startDate, endDate);
  // const transactionList = await Transaction.find();
  // const emptyRooms = [];
  // let allDayEmpty = true;
  // // loop each room in transaction in hotel list loop
  // // to find checkout room by time user want to book
  // hotelList.forEach((hotel) => {
  //   transactionList.forEach((tran) => {
  //     if (tran.hotel.toString() == hotel._id.toString()) {
  //       stayCalendar.forEach((date) => {
  //         // so sánh date này với dateEnd của tran
  //         // => nếu date > dateEnd => phòng trống
  //         // => nếu date  = dateEnd => phòng trống
  //         // => nếu date < dateEnd => phòng chưa trống
  //         // nếu phòng trống 3 ngày push tất cả item
  //         // của mảng room tran vào mảng result
  //         // compare 2 date to know is later, earlier or same time
  //         const compare = compareDate(date, tran.dateEnd);
  //         // console.log("compare:", compare);
  //         if (compare === "later" || compare === "same") {
  //           allDayEmpty &= true;
  //         } else {
  //           allDayEmpty &= false;
  //         }
  //       });
  //       // is all day in stayCalendar is that transaction rooms is empty
  //       if (allDayEmpty) {
  //         // console.log("trans.rooms:", trans.rooms);
  //         tran.rooms.forEach((room) =>
  //           emptyRooms.push({
  //             roomId: room._id,
  //             roomNumber: room.roomNumber,
  //             hotelId: tran.hotel,
  //           })
  //         );
  //       }
  //       allDayEmpty = true;
  //     }
  //   });
  // });
  const checkoutRooms = [];
  const checkoutTran = await Transaction.find({ status: "Checkout" });
  checkoutTran.forEach((tran) => {
    tran.rooms.forEach((room) => {
      checkoutRooms.push({
        roomId: room._id,
        roomNumber: room.roomNumber,
        hotelId: tran.hotel,
      });
    });
  });

  const otherStatusRooms = [];
  const otherStatusTran = await Transaction.find({
    $or: [{ status: "Checkin" }, { status: "Booking" }],
  });
  otherStatusTran.forEach((tran) => {
    tran.rooms.forEach((room) => {
      otherStatusRooms.push({
        roomId: room._id,
        roomNumber: room.roomNumber,
        hotelId: tran.hotel,
      });
    });
  });

  checkoutRooms.forEach((cRoom, index) => {
    otherStatusRooms.forEach((oRoom) => {
      if (
        cRoom.hotelId.toString() === oRoom.hotelId.toString() &&
        cRoom.roomId.toString() === oRoom.roomId.toString() &&
        cRoom.roomNumber == oRoom.roomNumber
      ) {
        checkoutRooms.splice(index, 1);
      }
    });
  });
  // console.log("checkoutRooms:", checkoutRooms);

  return checkoutRooms;

  // emptyRooms.forEach((eRoom, index) => {
  //   otherStatusTran.forEach((tran) => {
  //     tran.rooms.forEach((room) => {
  //       if (
  //         tran.hotel.toString() === eRoom.hotelId.toString() &&
  //         room._id.toString() === eRoom.roomId.toString() &&
  //         room.roomNumber == eRoom.roomNumber
  //       ) {
  //         emptyRooms.splice(index, 1);
  //       }
  //     });
  //   });
  // });

  // console.log("emptyRooms.length:", emptyRooms.length);
  // return emptyRooms;
};

//
const addHotelIdToRoomList = (hotelList, roomList) => {
  // create room list that have hotel id
  // for add hotel id to empty room list
  const roomWithHotelId = [];
  hotelList.forEach((hotel) => {
    hotel.rooms.forEach((room) => {
      roomWithHotelId.push({ hotelId: hotel._id, roomId: room });
    });
  });
  // add hotel id to empty room object item
  const _roomList = [...roomList];
  roomWithHotelId.forEach((room) => {
    _roomList.forEach((_room, index) => {
      const roomId = new Mongoose.Types.ObjectId(room.roomId);
      const _roomId = _room.roomId;
      if (_roomId.toString() === roomId.toString()) {
        roomList[index] = {
          ...roomList[index],
          hotelId: room.hotelId,
        };
      }
    });
  });
  // delete room item dont have hotel id after add for some reason
  const result = [];
  roomList.forEach((room) => {
    if (room.hotelId) {
      result.push(room);
    }
  });

  return result;
};

// find all empty hotel rooms
const findOtherEmptyRooms = async (tranEmptyRooms, hotelList) => {
  const roomList = await Room.find();
  const otherEmptyRooms = [];
  // create room item that have only 1 room number in each
  roomList.forEach((room) =>
    room.roomNumbers.forEach((number) => {
      otherEmptyRooms.push({ roomId: room._id, roomNumber: number });
    })
  );

  // console.log("=========================");
  // console.log(" hotelList[0]._id:", hotelList[0]._id);
  // console.log("tranEmptyRooms:", tranEmptyRooms);
  // console.log("otherEmptyRooms:", otherEmptyRooms);
  let result;
  if (hotelList.length === 1) {
    hotelList[0].rooms.forEach((room) => {
      // find rooms that not include in any transaction
      tranEmptyRooms.forEach((emptyRoom) => {
        if (emptyRoom.roomId.toString() == room) {
          tranEmptyRooms.splice(index, 1);
        }
      });
    });
    result = addHotelIdToRoomList(hotelList, tranEmptyRooms);
    console.log("result:", result);
  } else {
    // find rooms that not include in any transaction
    otherEmptyRooms.forEach((hotelRoom, index) => {
      // console.log("hotelRoom.roomId:", hotelRoom.roomId);
      tranEmptyRooms.forEach((emptyRoom) => {
        if (emptyRoom.roomId.toString() === hotelRoom.roomId.toString()) {
          otherEmptyRooms.splice(index, 1);
        }
      });
    });
    result = addHotelIdToRoomList(hotelList, otherEmptyRooms);
  }
  return result;

  // console.log("otherEmptyRooms:", otherEmptyRooms);
};

// find hotels have enough room for user booking request
const findHotelsWithEnoughRooms = async (requireRoom, emptyRoomList) => {
  const peopleQuantity = requireRoom.adult + requireRoom.children;
  const allRoomList = await Room.find();
  const hotelList = await Hotel.find();

  // add capacity to room item in emptyRoomList
  const _emptyRoomList = [...emptyRoomList];
  allRoomList.forEach((room) => {
    _emptyRoomList.forEach((emptyRoom, index) => {
      if (emptyRoom.roomId.toString() === room._id.toString()) {
        emptyRoomList[index] = {
          ...emptyRoomList[index],
          maxPeople: room.maxPeople,
        };
      }
    });
  });

  // create hotel capacity array
  const hotelsCurrentCapacity = hotelList.map((hotel) => {
    return { hotelId: hotel._id, capacity: 0 };
  });

  // calculate each hotel capacity
  hotelsCurrentCapacity.forEach((hotel) => {
    emptyRoomList.forEach((emptyRoom) => {
      if (emptyRoom.hotelId.toString() === hotel.hotelId.toString()) {
        hotel.capacity += emptyRoom.maxPeople;
      }
    });
  });

  // find hotels that have enough capacity
  const result = [];
  hotelList.forEach((hotel) => {
    hotelsCurrentCapacity.forEach((hotelCap) => {
      if (
        hotelCap.capacity >= peopleQuantity &&
        hotelCap.hotelId.toString() === hotel._id.toString()
      ) {
        result.push(hotel);
      }
    });
  });

  return result;
};

exports.searchHotels = async (request, response, next) => {
  const requestData = request.body;
  const requireRoom = requestData.options;
  const date = requestData.date;
  // console.log("===================================");
  // console.log("requestData.date:", requestData.date);

  // delete all whitespace in string
  const location = requestData.destination.replace(/ /g, "").trim();

  const hotelsByLocation = await searchHotelByLocation(location);
  if (hotelsByLocation.length > 0) {
    // update transaction status
    updateTransactionStatus();

    const checkedOutRooms = await findCheckedOutRooms(date, hotelsByLocation);

    const otherEmptyRooms = await findOtherEmptyRooms(
      checkedOutRooms,
      hotelsByLocation
    );

    const allEmptyRooms = checkedOutRooms.concat(otherEmptyRooms);
    // console.log("checkedOutRooms.length:", checkedOutRooms.length);
    // console.log("otherEmptyRooms.length:", otherEmptyRooms.length);

    const validHotels = await findHotelsWithEnoughRooms(
      requireRoom,
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

exports.getRoomsByDate = async (request, response, next) => {
  const requestData = request.body;
  // console.log("requestData:", requestData);
  const date = requestData.date;
  const hotel = [{ ...requestData.hotel }];
  updateTransactionStatus();

  // get all available rooms by request date
  const checkedOutRooms = await findCheckedOutRooms(date, hotel);
  const otherEmptyRooms = await findOtherEmptyRooms(checkedOutRooms, hotel);
  // console.log("========================");
  // console.log("checkedOutRooms:", checkedOutRooms); // chưa xét các phòng được book lại
  // console.log("otherEmptyRooms:", otherEmptyRooms); // đúng

  const allEmptyRooms = checkedOutRooms.concat(otherEmptyRooms);
  // console.log("allEmptyRooms:", allEmptyRooms);

  // filter unique room type id from available room list
  const uniqueRoomId = [...new Set(allEmptyRooms.map((item) => item.roomId))];
  // alternative method
  // return object have unique room id with all attribute
  // const key = "roomId";
  // const _allEmptyRooms = allEmptyRooms.map((item) => [item[key], item]);
  // const uniqueItems = [...new Map(_allEmptyRooms).values()];
  // console.log("uniqueItems:", uniqueItems);

  const resRoomResult = uniqueRoomId.map((id) => {
    return { roomId: id, rooms: [] };
  });

  // push room number to every available room type
  uniqueRoomId.forEach((uniqueId, index) => {
    allEmptyRooms.forEach((room) => {
      if (room.roomId.toString() === uniqueId.toString()) {
        resRoomResult[index].rooms.push(room.roomNumber);
      }
    });
  });

  // add more room type detail for render purpose
  const roomDetail = await Room.find();
  roomDetail.forEach((room) => {
    resRoomResult.forEach((resRoom, index) => {
      if (resRoom.roomId.toString() === room._id.toString()) {
        resRoomResult[index] = {
          ...resRoomResult[index],
          desc: room.desc,
          maxPeople: room.maxPeople,
          price: room.price,
          title: room.title,
        };
      }
    });
  });

  // console.log("resRoomResult:", resRoomResult);

  response.send(resRoomResult);
};
// exports.getRoomsByDate = async (request, response, next) => {
//   await deleteOldCheckoutRooms();
// };
