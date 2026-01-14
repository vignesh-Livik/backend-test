const express = require("express");
const {
  applyLeave,
  getLeavesByUser,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave,
} = require("../../controller/leaveManagement.controller");

const router = express.Router();

// Employee routes
router.post("/", applyLeave);
router.get("/user/:userId", getLeavesByUser);

// HR/Admin routes
router.get("/all", getAllLeaves);
router.put("/status/:id", updateLeaveStatus);

// Optional
router.delete("/:id", deleteLeave);

module.exports = router;
