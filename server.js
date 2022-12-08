const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const server = express();
const userRoutes = require("./routes/user");
const hotelRoutes = require("./routes/hotel");
const transactionRoutes = require("./routes/transaction");
const roomRoutes = require("./routes/room");

server.use(cors());
server.use(express.json());

server.get("/test", (request, response, next) => {
  response.write("<h1>SERVER RUN</h1>");
});

server.use(userRoutes.route);
server.use(hotelRoutes.route);
server.use(transactionRoutes.route);
server.use(roomRoutes.route);

mongoose
  .connect(
    "mongodb+srv://mongodb_admin:mongodb_admin@cluster0.e6b0l5j.mongodb.net/hotel?retryWrites=true&w=majority"
  )
  .then(() => {
    server.listen(5000);
  })
  .catch((err) => console.log("::ERROR:", err));
