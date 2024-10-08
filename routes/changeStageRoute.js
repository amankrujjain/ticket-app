const express = require("express");
const {changeStage, getStageTracking, getStageTrackingByStatus} = require("../controller/changeStageController");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/ticket/change-stage',authMiddleware(['admin','sub-admin','engineer']), changeStage);

// query filter by id
// router.get('/ticket-filter-by-id/:id?', getStageTracking);
router.get('/ticket/stage-history/:ticketId', getStageTracking)
// router.get('/ticket-filter-stage-tracking', getStageTrackingByStatus); Errro in this

module.exports = router;