const prisma = require("../prisma/client.js");

exports.applyLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, totalDays, reason } =
      req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const leave = await prisma.leaveManagements.create({
      data: {
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalDays,
        reason,
        status: "PENDING",
        user: {
          connect: {
            userId,
          },
        },
      },
    });

    res.status(201).json({
      message: "Leave applied successfully",
      data: leave,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getLeavesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const leaves = await prisma.leaveManagements.findMany({
      where: { userId },
      include: { user: true },
    });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await prisma.leaveManagements.findMany({
      include: {
        user: true,
        approver: true,
      },
    });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLeaveDetails = async (req, res) => {
  try {
    const leaveId = Number(req.params.id);
    const { startDate, endDate, leaveType, reason, totalDays } = req.body;

    const updatedLeave = await prisma.leaveManagements.update({
      where: { id: leaveId },
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        leaveType,
        reason,
        totalDays,
      },
    });

    res.json({
      message: "Leave updated successfully",
      data: updatedLeave,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.leaveManagements.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Leave deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};