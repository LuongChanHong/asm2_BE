const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**user: user object của người đặt phòng
hotel: _Id của khách sạn đã đặt
room: Danh sách các phòng đã đặt
dateStart: Ngày nhận phòng
dateEnd: Ngày trả phòng
price: Chi phí
payment: Hình thức thanh toán (Credit Card, Cash)
status: Tình trạng (Booked, Checkin, Checkout)*/

const transactionSchema = new Schema({
  user: {
    type: Object,
    require: true,
  },
  hotel: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  hotelName: {
    type: String,
    require: true,
  },
  rooms: {
    type: Array,
    require: true,
  },
  dateStart: {
    type: Date,
    require: true,
  },
  dateEnd: {
    type: Date,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  payment: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
