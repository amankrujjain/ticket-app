const express = require("express");
const router = express.Router();

const {roleValidator} = require("../helpers/validate");
const {createRole, getRoles} = require("../controller/roleController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-role",authMiddleware(['admin']), roleValidator,createRole);
router.get("/roles",authMiddleware(['admin']), getRoles)

module.exports = router;
