const express = require("express");

const {createMachine, getMachines} = require("../controller/machineController");
const {machineValidator} = require("../helpers/validate");

const router = express.Router();

router.post('/register-machine', machineValidator, createMachine);
router.get("/get-all-machines", getMachines)

module.exports = router;