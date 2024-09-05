const express = require("express");
const { createReason,getReason,getReasonById,updateReason,deleteReason,getReasonsByIssueId } = require("../controller/reasonController");
const { createReasonValidation } = require("../helpers/validate");

const router = express.Router();

router.post("/create-reason",createReasonValidation, createReason);
router.get("/get-reasons", getReason)
router.get("/get-reason/:id", getReasonById);
router.get('/get-reasons-by-issue/:id',getReasonsByIssueId)
router.put("/update-reason/:id", updateReason );
// router.patch("/activate-reason/:id",activate);
router.delete("/delete-reason/:id", deleteReason);

module.exports = router;