const User = require("../models/User");

exports.login = (request, response, next) => {
  const user = request.body;
  console.log("user:", user);
  User.findOne({ email: user.email })
    .then((user) => {
      console.log("user:", user);
      if (user) {
        response.send({ isUserExist: true });
      } else {
        response.send(null);
      }
    })
    .catch((err) => console.log("::ERROR:", err));
};
