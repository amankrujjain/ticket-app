const express = require("express");
const { createCity, getCity, getCityById, updateCity, activateCity, deleteCity } = require("../controller/cityController");
const { cityValidator,updateCityValidator } = require("../helpers/validate");

const router = express.Router();

router.post("/create-city",cityValidator, createCity);
router.get("/get-cities", getCity)
router.get("/get-city/:id", getCityById);
router.put("/update-city/:id",updateCityValidator, updateCity );
router.patch("/activate-city/:id",activateCity);
router.delete("/delete-city/:id", deleteCity);

module.exports = router;