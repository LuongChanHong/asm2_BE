const express = require("express");
const router = express.Router();

const hotelController = require("../controllers/hotel");

router.get("/get-hotels-by-area", hotelController.getHotelsbyArea);
router.post("/search-hotels", hotelController.searchHotels);
router.get("/get-hotel-by-id/:id", hotelController.getHotelById);
router.post("/get-rooms-by-date", hotelController.getRoomsByDate);

exports.route = router;
