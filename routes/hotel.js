const express = require("express");
const router = express.Router();

const hotelController = require("../controllers/hotel");

router.get("/get-hotels-by-area", hotelController.getHotelsbyArea);
router.post("/search-hotels", hotelController.searchHotels);

exports.route = router;
