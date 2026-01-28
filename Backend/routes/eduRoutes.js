const express = require("express");

const {
  createEduDetails,
  getEduDetailsByUserId,
  updateEduDetails,
  deleteEduDetails,
  getAllEduDetails,
  updateEduDetailById,
  deleteEduDetailById,
} = require("../controller/eduDetailsController");

const router = express.Router();

router.get("/:userId", getEduDetailsByUserId);
router.get("/", getAllEduDetails);
router.post("/", createEduDetails);
router.put("/:userId", updateEduDetails);
router.delete("/:userId", deleteEduDetails);
router.put("/record/:id", updateEduDetailById);
router.delete("/record/:id", deleteEduDetailById);

module.exports = router;
