const express = require("express");
const router = express.Router();

const {roleValidator} = require("../helpers/validate");
const {createRole, getRoles, updateRole, deleteRole, getDeactivatedRoles} = require("../controller/roleController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-role",authMiddleware(['admin']), roleValidator,createRole);
router.get("/roles",authMiddleware(['admin']), getRoles);
router.get("/deactivated-roles",authMiddleware(['admin']),getDeactivatedRoles)
router.put("/update-role/:id", authMiddleware(['admin']), roleValidator, updateRole);
router.delete("/delete-role/:id",authMiddleware(['admin']), deleteRole);


module.exports = router;
