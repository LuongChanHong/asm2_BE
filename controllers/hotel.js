const mongoose = require("mongoose");
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
  console.log("TRANSACTION UPDATED");
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

const filterHotelByFeature = (hotels) => {
  const result = [];
  hotels.forEach((hotel) => {
    if (hotel.featured) {
      result.push(hotel);
    }
  });
  return result;
};

exports.getHotelsbyArea = (request, response, next) => {
  Hotel.find()
    .then((hotels) => {
      if (hotels.length > 0) {
        const hotelByCity = filterHotelByCity(hotels);
        const propertyByType = filterPropertyByType(hotels);
        const hotelByRating = filterHotelByFeature(hotels);
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

const searchHotelByLocation = (location) => {
  const result = [];
  return Hotel.find()
    .then((hotels) => {
      hotels.forEach((hotel) => {
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
    })
    .catch((err) => console.log("::ERROR:", err));
};

const findRoomList = (hotelId) => {
  Hotel.findOne({ _id: hotelId })
    .then((hotel) => {
      const hotelRooms = hotel.rooms;
      // console.log("hotelRooms:", hotelRooms);
      // hotelRooms.forEach((item) => {
      //   Room.find({ _id: new mongoose.Schema.Types.ObjectId(item) })
      //     .then((rooms) => {
      //       const result = [];
      //       rooms.forEach((room) => {
      //         roomNumbers.forEach((item) => {
      //           result.push({ _id: room._id, roomNumber: item });
      //         });
      //       });
      //       console.log("result:", result);
      //     })
      //     .catch((err) => console.log("::ERROR:", err));
      // });
    })
    .catch((err) => console.log("::ERROR:", err));
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

exports.searchHotels = (request, response, next) => {
  const requestData = request.body;
  const person = requestData.options;
  const date = requestData.date;
  // console.log("===================================");
  // console.log("requestData.date:", requestData.date);

  // convert date string to date object
  // startDate = new Date(Date.UTC(date[0].startDate));
  // endDate = new Date(Date.UTC(date[0].endDate));
  startDate = new Date(date[0].startDate);
  endDate = new Date(date[0].endDate);
  // console.log(
  //   "startDate:",
  //   startDate.getUTCDate(),
  //   "/",
  //   startDate.getUTCMonth() + 1,
  //   "/",
  //   startDate.getUTCFullYear()
  // );

  // delete all whitespace in string
  const location = requestData.destination.replace(/ /g, "").trim();

  // update transaction status
  updateTransactionStatus();

  // calculate the calendar user will stay
  const stayCalendar = calTimeStay(startDate, endDate);
  // console.log("stayCalendar:", stayCalendar);

  // search hotel by user request location
  searchHotelByLocation(location)
    .then((hotels) => {
      // console.log("hotels.length:", hotels.length);
      const emptyRooms = [];
      const emptyRoomFromTran = [];
      let allDayEmpty = true;
      hotels.forEach((hotel) => {
        const rooms = hotel.rooms;
        // console.log("rooms.length:", rooms.length);
        // console.log("=========================");
        Transaction.find({ hotel: hotel._id })
          .then((trans) => {
            if (trans.length > 0) {
              // console.log("trans.length:", trans.length);

              // điều kiện phòng trống:
              // đến ngày 5 phòng đó đã được checkout => phòng trống
              trans.forEach((tran) => {
                stayCalendar.forEach((date) => {
                  // console.log("date:", date);
                  // console.log("tran.dateEnd:", tran.dateEnd);

                  // const roomEmptyToday = true;
                  // so sánh date này với dateEnd của tran
                  // => nếu date > dateEnd => phòng trống
                  // => nếu date  = dateEnd => phòng trống
                  // => nếu date < dateEnd => phòng chưa trống
                  // nếu phòng trống 3 ngày push tất cả item
                  // của mảng room tran vào mảng result
                  // compare 2 date to know is later, earlier or same time
                  const compare = compareDate(date, tran.dateEnd);
                  // console.log("compare:", compare);
                  if (compare === "later" || compare === "same") {
                    allDayEmpty &= true;
                  } else {
                    allDayEmpty &= false;
                  }
                });
                if (allDayEmpty) {
                  // console.log("trans.rooms:", trans.rooms);
                  tran.rooms.forEach((room) => emptyRoomFromTran.push(room));
                }
                allDayEmpty = true;
              });
              console.log("emptyRoomFromTran:", emptyRoomFromTran);
            } else {
              // trường hợp không có tran nào
            }
          })
          .catch((err) => console.log("::ERROR:", err));
      });
    })
    .catch((err) => console.log("::ERROR:", err));
};
