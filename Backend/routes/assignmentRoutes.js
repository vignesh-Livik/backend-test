const express = require("express");
const { createAssignment, deleteAssignment, updateAssignment, getAssignmentsByEditor, getAllAssignments } = require("../controller/assignmentController");

const router = express.Router();

router.post("/", createAssignment);
router.get("/", getAllAssignments);
router.get("/:editorId", getAssignmentsByEditor);
router.put("/:id", updateAssignment);


router.delete("/:id", deleteAssignment);

module.exports = router;