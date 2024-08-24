const express = require("express");
const {createCentre} = require("../controller/centreController")
const {createCentreValidator, updateCentreValidator} = require("../helpers/validate")


const router = express.Router();

router.post("/create-centre", createCentreValidator, createCentre);

module.exports = router;