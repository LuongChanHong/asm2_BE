const User = require("../models/User");

// total phone number character
const phoneNumberChar = 10;

exports.login = async (request, response, next) => {
  const requestData = request.body;
  try {
    // console.log("requestData:", requestData);
    const foundUser = await User.findOne({
      $and: [
        { email: requestData.data.email },
        { password: requestData.data.password },
      ],
    });

    if (foundUser === null) {
      response.statusMessage = "user not exist";
      response.status(404).end();
    } else {
      response.send(foundUser);
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

exports.signup = async (request, response, next) => {
  const requestData = request.body.data;
  console.log("requestData:", requestData);
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

  try {
    // console.log("requestData:", requestData);
    const foundUser = await User.findOne({
      $and: [{ email: requestData.email }, { password: requestData.password }],
    });
    if (foundUser === null) {
      newUser.save();
      response.end();
    } else {
      response.statusMessage = "user exist";
      response.status(404).end();
    }
  } catch (err) {
    console.log("err:", err);
  }
};

exports.findUserByEmail = async (request, response, next) => {
  // const email = request.body.email;
  // try {
  //   const user = await User.findOne({ email: email });
  //   response.send(user);
  // } catch (err) {
  //   console.log("err:", err);
  // }
  response.send(request);
};
