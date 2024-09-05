const express = require("express");

const {createMachine, getMachines, getMachinesByCentre} = require("../controller/machineController");
const {machineValidator} = require("../helpers/validate");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/register-machine', machineValidator, createMachine);
router.get("/get-all-machines", getMachines);
router.get('/machines/centre/:centreId', authMiddleware(), getMachinesByCentre);

module.exports = router;