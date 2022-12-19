const express = require("express");
const router = express.Router();

const roomController = require("../controllers/room");

router.post("/reserve", roomController.reserve);
router.get("/get-all-room", roomController.getAllRoom);

exports.route = router;
