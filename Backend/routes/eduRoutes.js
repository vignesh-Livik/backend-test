const express = require("express");

const {
  createEduDetails,
  getEduDetailsByUserId,
  updateEduDetails,
  deleteEduDetails,
  getAllEduDetails,
} = require("../controller/eduDetailsController");

const router = express.Router();

router.get("/:userId", getEduDetailsByUserId);
router.get("/", getAllEduDetails);
router.post("/", createEduDetails);
router.put("/:userId", updateEduDetails);
router.delete("/:userId", deleteEduDetails);

module.exports = router;
