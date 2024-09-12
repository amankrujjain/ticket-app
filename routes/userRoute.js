const express = require("express");
const router = express.Router();

const {fetchUsers} = require("../controller/userController");
const authMiddleware = require('../middleware/authMiddleware');

router.get('/all-users', authMiddleware(['admin','sub-admin']), fetchUsers);

module.exports = router;