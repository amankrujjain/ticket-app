const express = require("express");
const {createCentre, getCentre, getCentreById} = require("../controller/centreController")
const {createCentreValidator, updateCentreValidator} = require("../helpers/validate")


const router = express.Router();

router.post("/create-centre", createCentreValidator, createCentre);
router.get("/get-all-centres", getCentre);
router.get("/get-centre/:id", getCentreById)

module.exports = router;