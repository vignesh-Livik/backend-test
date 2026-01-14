const prisma = require("../prisma/client");

/* ================= GET ALL USERS WITH EDUCATION ================= */
exports.getAllUsersWithEduDetails = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        eduDetails: true,
      },
    });

    res.status(200).json({
      message: "Users with education details fetched successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= CREATE EDUCATION DETAILS ================= */
exports.createEduDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      qualification,
      specialization,
      institution,
      boardOrUniversity,
      yearOfPassing,
      percentage,
    } = req.body;

    // ensure user exists
    const userExists = await prisma.user.findUnique({
      where: { userId: String(userId) },
    });

    if (!userExists) {
      return res.status(404).json({
        message: "User not found. Please create user first.",
      });
    }

    const eduDetails = await prisma.eduDetails.create({
      data: {
        userId: String(userId),
        qualification: String(qualification),
        specialization: specialization ? String(specialization) : null,
        institution: String(institution),
        boardOrUniversity: String(boardOrUniversity),
        yearOfPassing: Number(yearOfPassing),
        percentage: percentage !== undefined ? Number(percentage) : null,
      },
    });

    res.status(201).json({
      message: "Education details created successfully",
      data: eduDetails,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET EDUCATION BY USER ID ================= */
exports.getEduDetailsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { userId: String(userId) },
      include: {
        eduDetails: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Education details fetched successfully",
      count: user.eduDetails.length,
      data: user.eduDetails,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE EDUCATION (BULK BY USER ID) ================= */
exports.updateEduDetailsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const updated = await prisma.eduDetails.updateMany({
      where: { userId: String(userId) },
      data: {
        qualification: req.body.qualification
          ? String(req.body.qualification)
          : undefined,
        specialization: req.body.specialization
          ? String(req.body.specialization)
          : undefined,
        institution: req.body.institution
          ? String(req.body.institution)
          : undefined,
        boardOrUniversity: req.body.boardOrUniversity
          ? String(req.body.boardOrUniversity)
          : undefined,
        yearOfPassing: req.body.yearOfPassing
          ? Number(req.body.yearOfPassing)
          : undefined,
        percentage:
          req.body.percentage !== undefined
            ? Number(req.body.percentage)
            : undefined,
      },
    });

    res.json({
      message: "Education details updated successfully (bulk)",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE EDUCATION (BULK BY USER ID) ================= */
exports.deleteEduDetailsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.eduDetails.deleteMany({
      where: { userId: String(userId) },
    });

    res.json({
      message: "Education details deleted successfully (bulk)",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE EDUCATION BY EDUCATION ID ================= */
exports.updateEduDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.eduDetails.update({
      where: { id: Number(id) },
      data: {
        qualification: req.body.qualification
          ? String(req.body.qualification)
          : undefined,
        specialization: req.body.specialization
          ? String(req.body.specialization)
          : undefined,
        institution: req.body.institution
          ? String(req.body.institution)
          : undefined,
        boardOrUniversity: req.body.boardOrUniversity
          ? String(req.body.boardOrUniversity)
          : undefined,
        yearOfPassing: req.body.yearOfPassing
          ? Number(req.body.yearOfPassing)
          : undefined,
        percentage:
          req.body.percentage !== undefined
            ? Number(req.body.percentage)
            : undefined,
      },
    });

    res.json({
      message: "Education updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE EDUCATION BY EDUCATION ID ================= */
exports.deleteEduDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.eduDetails.delete({
      where: { id: Number(id) },
    });

    res.json({
      message: "Education deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
