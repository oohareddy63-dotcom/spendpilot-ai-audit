const express = require("express");
const router = express.Router();
const { generateAudit, getAuditByShareId } = require("../controllers/auditController");

router.post("/", generateAudit);
router.get("/:shareId", getAuditByShareId);

module.exports = router;
