const express = require("express");
const router = express.Router();
const { saveLead } = require("../controllers/leadController");

router.post("/", saveLead);

module.exports = router;
