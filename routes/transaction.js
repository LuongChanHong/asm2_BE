const express = require("express");
const router = express.Router();

const tranController = require("../controllers/transaction");

router.post("/create-transaction", tranController.createTransaction);

exports.route = router;
