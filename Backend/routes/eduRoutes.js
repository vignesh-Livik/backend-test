// const express = require("express");
// const router = express.Router();

// // EduDetails controllers (MATCH EXPORTS EXACTLY)
// const {
//   getAllUsersWithEduDetails,
//   createEduDetails,
//   getEduDetailsByUserId,
//   updateEduDetailsByUserId,
//   deleteEduDetailsByUserId,
// } = require("../controller/eduDetailsController");

// /* =========================
//    EDUCATION ROUTES
//    ========================= */

// // GET all users with education details
// router.get("/users/education", getAllUsersWithEduDetails);

// // CREATE education details for a user
// router.post("/users/:userId/education", createEduDetails);

// // READ education details by userId
// router.get("/users/:userId/education", getEduDetailsByUserId);

// // UPDATE education details by userId
// router.put("/users/:userId/education", updateEduDetailsByUserId);

// // DELETE education details by userId
// router.delete("/users/:userId/education", deleteEduDetailsByUserId);

// module.exports = router;
const express = require("express");
const router = express.Router();

// EduDetails controllers (MATCH EXPORTS EXACTLY)
const {
  getAllUsersWithEduDetails,
  createEduDetails,
  getEduDetailsByUserId,
  updateEduDetailsByUserId,
  deleteEduDetailsByUserId,
  updateEduDetailsById,
  deleteEduDetailsById,
} = require("../controller/eduDetailsController");

/* =========================
   EDUCATION ROUTES
   ========================= */

// 🔹 GET all users with education details
router.get("/users/education", getAllUsersWithEduDetails);

// 🔹 CREATE education details for a user
router.post("/users/:userId/education", createEduDetails);

// 🔹 READ education details by userId
router.get("/users/:userId/education", getEduDetailsByUserId);

// 🔹 UPDATE education details (BULK by userId)
router.put("/users/:userId/education", updateEduDetailsByUserId);

// 🔹 DELETE education details (BULK by userId)
router.delete("/users/:userId/education", deleteEduDetailsByUserId);

// ===================================================
// 🔥 ROW-LEVEL OPERATIONS (THIS FIXES EDIT / DELETE)
// ===================================================

// 🔹 UPDATE single education record by educationId
router.put("/education/:id", updateEduDetailsById);

// 🔹 DELETE single education record by educationId
router.delete("/education/:id", deleteEduDetailsById);

module.exports = router;
