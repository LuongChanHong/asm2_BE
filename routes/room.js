const express = require("express");
const router = express.Router();

const roomController = require("../controllers/room");

router.post("/reserve", roomController.reserve);
router.post("/add-new-room", roomController.addNewRoom);
router.post("/delete-room", roomController.deleteRoom);

router.get("/get-all-room", roomController.getAllRoom);

exports.route = router;
