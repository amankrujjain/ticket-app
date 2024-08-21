const express = require("express");
const router = express.Router();

// Imports

const authController = require("../controller/authController");

const {registerValidator, loginValidator} = require("../helpers/validate")

router.post('/register', registerValidator, authController.registerUser);
router.post("/login", loginValidator, authController.loginUser);


module.exports = router;