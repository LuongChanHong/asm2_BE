const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**title: Tên loại phòng
price: Mức giá của loại phòng đó (tính theo ngày)
maxPeople: Số người tối đa
desc: Mô tả về loại phòng
roomNumbers: Danh sách số phòng của loại phòng này
hotelId: id hotel của phòng này
*/

const roomSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  maxPeople: {
    type: Number,
    require: true,
  },
  desc: {
    type: String,
    require: true,
  },
  roomNumbers: [{ number: Number, unAvailableDates: { type: [Date] } }],
});

module.exports = mongoose.model("Room", roomSchema);
