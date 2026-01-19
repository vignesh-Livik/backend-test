const prisma = require("../prisma/client");

const createEduDetails = async (req, res) => {
  try {
    const {
      userId,
      qualification,
      specialization,
      institution,
      boardOrUniversity,
      yearOfPassing,
      percentage,
    } = req.body;

    if (!userId || !qualification || !institution) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const eduDetails = await prisma.eduDetails.create({
      data: {
        userId,
        qualification,
        specialization,
        institution,
        boardOrUniversity,
        yearOfPassing: Number(yearOfPassing),
        percentage: percentage ? parseFloat(percentage) : null,
      },
    });

    res.status(201).json(eduDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEduDetailsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const eduDetails = await prisma.eduDetails.findMany({
      where: { userId: String(userId) },
    });

    if (!eduDetails || eduDetails.length === 0) {
      return res.status(404).json({ message: "Education details not found" });
    }

    res.json(eduDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllEduDetails = async (req, res) => {
  try {
    const allEduDetails = await prisma.eduDetails.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(allEduDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEduDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedEduDetails = await prisma.eduDetails.updateMany({
      where: { userId: String(userId) },
      data: req.body,
    });

    res.json(updatedEduDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEduDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.eduDetails.deleteMany({
      where: { userId: String(userId) },
    });

    res.json({ message: "Education details deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEduDetails,
  getEduDetailsByUserId,
  updateEduDetails,
  deleteEduDetails,
  getAllEduDetails,
};
