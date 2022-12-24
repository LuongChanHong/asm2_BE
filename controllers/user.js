const User = require("../models/User");

// total phone number character
const phoneNumberChar = 10;

exports.login = async (req, res, next) => {
  const reqData = req.body;
  try {
    // console.log("reqData:", reqData);
    const foundUser = await User.findOne({
      $and: [
        { email: reqData.data.email },
        { password: reqData.data.password },
      ],
    });

    if (foundUser === null) {
      res.statusMessage = "Email or Password wrong";
      res.status(404).end();
    } else {
      res.send(foundUser);
    }
  } catch (err) {
    console.log("err:", err);
  }
};

/**username: từ mail tách ra x
password: user nhập
fullName: từ mail tách ra x 
phoneNumber: hàm random  x
email: user nhập
isAdmin: mặc định false */

const createPhoneNumber = () => {
  let phoneNumber = "0" + Math.floor(Math.random() * phoneNumberChar) + "0";

  // the other phone number characters
  let otherPhoneChar = phoneNumberChar - phoneNumber.length;
  for (let i = 0; i < otherPhoneChar; i++) {
    phoneNumber += Math.floor(Math.random() * phoneNumberChar).toString();
  }
  return phoneNumber;
};

const createIdentityNumber = () => {
  let identity = Math.random();
  // get character index from 2 to 13
  identity = identity.toString().slice(2, 14);
  return identity;
};

exports.signup = async (req, res, next) => {
  const reqData = req.body.data;
  console.log("reqData:", reqData);
  // const name = reqData.email.split("@")[0];

  const newUser = new User({
    username: "",
    password: reqData.password,
    fullName: "",
    phoneNumber: "",
    email: reqData.email,
    isAdmin: false,
    identity: "",
  });

  try {
    // console.log("reqData:", reqData);
    const foundUser = await User.findOne({
      $and: [{ email: reqData.email }, { password: reqData.password }],
    });
    if (foundUser === null) {
      newUser.save();
      res.end();
    } else {
      res.statusMessage = "user exist";
      res.status(404).end();
    }
  } catch (err) {
    console.log("err:", err);
  }
};

exports.findUserByEmail = async (req, res, next) => {
  const email = req.body.data;
  console.log("email:", email);
  try {
    const user = await User.findOne({ email: email });
    res.send(user);
  } catch (err) {
    console.log("err:", err);
  }
};
