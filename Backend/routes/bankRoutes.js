const express = require("express");

const {
  createBankDetails,
  getBankDetailsByUserId,
  updateBankDetails,
  deleteBankDetails,
  getAllBankDetails,
} = require("../controller/bankDetailsController");

const router = express.Router();

router.get("/:userId", getBankDetailsByUserId);
router.get("/", getAllBankDetails);
router.post("/", createBankDetails);
router.put("/:userId", updateBankDetails);
router.delete("/:userId", deleteBankDetails);

module.exports = router;
