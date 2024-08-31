const {createIssueValidator, updateCentreValidator} = require('../helpers/validate');
const {createIssue, getIssue, getIssueById, updateIssue, deleteIssue, reactivateIssues} = require("../controller/issueController");

const express = require("express");

const router = express.Router();

router.post("/create-issue", createIssueValidator,createIssue);
router.get("/get-all-issues", getIssue);
router.get("/get-issue/:id", getIssueById);
router.put("/update-issue/:id",updateCentreValidator,updateIssue );
router.delete("/delete-issue/:id", deleteIssue);
router.patch("/reactivate-issue/:id", reactivateIssues);

module.exports = router;