const express = require("express");
const { createCity, getCity } = require("../controller/cityController");
const { cityValidator } = require("../helpers/validate");

const router = express.Router();

router.post("/create-city",cityValidator, createCity);
router.get("/get-cities", getCity)

module.exports = router;