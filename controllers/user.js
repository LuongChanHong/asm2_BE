const User = require("../models/User");

// total phone number character
const phoneNumberChar = 10;

exports.login = (request, response, next) => {
  const requestData = request.body;
  // console.log("requestData:", requestData);
  User.findOne({ email: requestData.email })
    .then((user) => {
      // console.log("user:", user);
      if (user) {
        response.send({ isUserExist: true });
      } else {
        response.send(null);
      }
    })
    .catch((err) => console.log("::ERROR:", err));
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

exports.signup = (request, response, next) => {
  const requestData = request.body;
  // console.log("requestData:", requestData);
  // const name = requestData.email.split("@")[0];
  const newUser = new User({
    username: "",
    password: requestData.password,
    fullName: "",
    phoneNumber: "",
    email: requestData.email,
    isAdmin: false,
    identity: "",
  });
  User.findOne({ email: newUser.email })
    .then((user) => {
      if (user) {
        // console.log("user:", user);
        response.statusMessage = "user exist";
        response.status(409).end();
      } else {
        newUser.save();
        response.send({ email: newUser.email });
      }
    })
    .catch((err) => console.log("::ERROR:", err));
};

exports.findUserByEmail = async (request, response, next) => {
  const email = request.body.email;
  try {
    const user = await User.findOne({ email: email });
    response.send(user);
  } catch (err) {
    console.log("err:", err);
  }
};
