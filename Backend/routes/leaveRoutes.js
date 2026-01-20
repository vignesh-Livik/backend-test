const express = require("express");
const {
  applyLeave,
  getLeavesByUser,
  getAllLeaves,
  updateLeaveDetails,
  deleteLeave,
} = require("../controller/leaveManagementController");

const router = express.Router();

router.post("/", applyLeave);

router.get("/all", getAllLeaves);

router.get("/:userId", getLeavesByUser);
router.put("/:id", updateLeaveDetails);
router.delete("/:id", deleteLeave);

module.exports = router;