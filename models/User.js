const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**username: Tên đăng nhập
password: Mật khẩu người dùng
fullName: Họ và tên của người dùng
phoneNumber: Số điện thoại của người dùng
email: Email của người dùng
isAdmin: Người dùng này có phải Admin không */

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  fullName: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: Number,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    require: true,
  },
  // array chứa các instance transaction
  transactions: {
    type: Array,
    require: true,
  },
});

module.exports = mongoose.model("User", userSchema);
