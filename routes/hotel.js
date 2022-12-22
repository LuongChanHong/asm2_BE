const express = require("express");
const router = express.Router();

const hotelController = require("../controllers/hotel");

router.post("/search-hotels", hotelController.searchHotels);
router.post("/add-new-hotel", hotelController.addNewHotel);

router.get("/get-hotels-by-area", hotelController.getHotelsbyArea);
router.get("/get-hotel-by-id/:id", hotelController.getHotelById);
router.get("/get-rooms-of-hotel/:id", hotelController.getRoomOfHotel);
router.get("/get-business-info", hotelController.getBusinessInfo);
router.get("/get-all-hotel", hotelController.getAllHotel);
router.post("/delete-hotel", hotelController.deleteHotel);

exports.route = router;
