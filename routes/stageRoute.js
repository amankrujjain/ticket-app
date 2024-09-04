const express = require("express")

const {stageValidator} = require("../helpers/validate");
const {createStage, getAllStage} = require("../controller/stageController");

const router = express.Router();

router.post("/create-stage", stageValidator, createStage);
router.get("/all-stage",getAllStage)

module.exports = router;