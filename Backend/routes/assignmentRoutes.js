const express = require("express");
const { createAssignment, deleteAssignment, getAssignmentsByViewer, updatePersonalDetails, updateBankDetails } = require("../controller/assignmentController");

const router = express.Router();

router.post("/create", createAssignment);
router.get("/viewer/:viewerId", getAssignmentsByViewer);
router.patch("/:editorId/user/:viewerId/personal-details", updatePersonalDetails)
router.patch("/:editorId/user/:viewerId/bank-details", updateBankDetails)
router.delete("/:id", deleteAssignment);

module.exports = router;