const express = require("express");
const router = express.Router();

const tranController = require("../controllers/transaction");

router.post(
  "/get-transaction-by-user-id",
  tranController.getTransactionByUserId
);

router.get("/get-lastest-transaction", tranController.getLastestTransaction);

exports.route = router;
