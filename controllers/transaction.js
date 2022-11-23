const User = require("../models/User");

exports.createTransaction = (request, response) => {
  const tranData = request.body;
  console.log("tranData:", tranData);
};
