const express = require("express");
const {
  applyLeave,
  getLeavesByUser,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave,
} = require("../../controller/leaveManagementController");

const router = express.Router();

// Employee routes
router.post("/", applyLeave);
router.get("/:userId", getLeavesByUser);

// HR/Admin routes
router.get("/all", getAllLeaves);
router.put("/status/:id", updateLeaveStatus);

// Optional
router.delete("/:id", deleteLeave);

// module.exports = router;
// const express = require("express");
// const {
//   applyLeave,
//   getAllLeaves,
// } = require("../../controller/leaveManagementController");

// const router = express.Router();
// router.get("/", getAllLeaves);
// router.post("/", applyLeave);

// module.exports = router;
