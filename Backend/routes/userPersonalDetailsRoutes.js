const express = require("express");
const router = express.Router();

const {
  createPersonalDetails,
  getUserProfile,
  updatePersonalDetails,
  deletePersonalDetails,
  getAllUsersWithPersonalDetails
} = require("../controller/userPersonalDetailsController");

router.post("/:userId", createPersonalDetails);
router.get("/", getAllUsersWithPersonalDetails);
router.get("/:userId", getUserProfile);
router.put("/:userId", updatePersonalDetails);
router.delete("/:userId", deletePersonalDetails);

module.exports = router;
