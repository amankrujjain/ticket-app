const express = require("express");
const { createState,getState, updateState, deleteState, activateState } = require("../controller/stateController");
const authMiddleware = require("../middleware/authMiddleware");
const { stateValidator } = require("../helpers/validate");
const router = express.Router();

router.post('/create-state',stateValidator, createState);
router.get('/get-all-state', getState );
router.put('/update-state/:id',stateValidator, updateState);
router.delete("/delete-state/:id", deleteState);
router.patch("/activate-state/:id", activateState)


module.exports = router;