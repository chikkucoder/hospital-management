const express = require("express");
const router = express.Router();

const { payCash } = require("../controllers/paymentController");

router.post("/cash", payCash);

module.exports = router;