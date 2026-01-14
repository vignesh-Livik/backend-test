const express = require("express");
const router = express.Router();

const {
  createPersonalDetails,
  getUserProfile,
  updatePersonalDetails,
  deletePersonalDetails,
  getAllUsersWithPersonalDetails
} = require("../controller/userPersonalDetailsController");

router.post("/users/:userId/personal-details", createPersonalDetails);
router.get("/users/personal-details", getAllUsersWithPersonalDetails);
router.get("/users/:userId/personal-details", getUserProfile);
router.put("/users/:userId/personal-details", updatePersonalDetails);
router.delete("/users/:userId/personal-details", deletePersonalDetails);

module.exports = router;
