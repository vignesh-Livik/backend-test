const express = require("express");
const {
  applyLeave,
  getLeavesByUser,
  getAllLeaves,
  updateLeaveDetails,
  deleteLeave,
  approveLeave,
  rejectLeave,
} = require("../controller/leaveManagementController");

const router = express.Router();

router.post("/", applyLeave);

router.get("/all", getAllLeaves);

router.get("/:userId", getLeavesByUser);
router.put("/:id", updateLeaveDetails);
router.put("/:id/approve", approveLeave);
router.put("/:id/reject", rejectLeave);
router.delete("/:id", deleteLeave);

module.exports = router;
