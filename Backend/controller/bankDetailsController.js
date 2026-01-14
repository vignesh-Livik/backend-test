const prisma = require("../prisma/client");

const createBankDetails = async (req, res) => {
  try {
    const {
      userId,
      bankName,
      accountNo,
      ifscCode,
      branchName,
      branchLocation,
    } = req.body;

    if (!userId || !bankName || !accountNo || !ifscCode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const bankDetails = await prisma.bankDetails.create({
      data: {
        userId,
        bankName,
        accountNo,
        ifscCode,
        branchName,
        branchLocation,
      },
    });

    res.status(201).json(bankDetails);
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "Bank details already exist for this user" });
    }

    res.status(500).json({ error: error.message });
  }
};

const getBankDetailsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const bankDetails = await prisma.bankDetails.findUnique({
      where: { userId },
    });

    if (!bankDetails) {
      return res.status(404).json({ message: "Bank details not found" });
    }

    res.json(bankDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllBankDetails = async (req, res) => {
  try {
    const allBankDetails = await prisma.bankDetails.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(allBankDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBankDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedBankDetails = await prisma.bankDetails.update({
      where: { userId },
      data: req.body,
    });

    res.json(updatedBankDetails);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Bank details not found" });
    }

    res.status(500).json({ error: error.message });
  }
};

const deleteBankDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.bankDetails.delete({
      where: { userId },
    });

    res.json({ message: "Bank details deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Bank details not found" });
    }

    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBankDetails,
  getBankDetailsByUserId,
  updateBankDetails,
  deleteBankDetails,
  getAllBankDetails,
};
