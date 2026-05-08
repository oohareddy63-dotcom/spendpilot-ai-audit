const express = require("express");
const router = express.Router();
const { generateAudit } = require("../controllers/auditController");

router.post("/", generateAudit);

module.exports = router;
