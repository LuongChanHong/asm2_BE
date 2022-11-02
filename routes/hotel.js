const express = require("express");
const router = express.Router();

const hotelController = require("../controllers/hotel");

router.get("/get-hotels-by-area", hotelController.getHotelsbyArea);

exports.route = router;
