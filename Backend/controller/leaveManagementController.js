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
    const { startDate, endDate, leaveType, reason, totalDays, status, approvedBy } = req.body;

    const data = {};
    if (startDate) data.startDate = new Date(startDate);
    if (endDate) data.endDate = new Date(endDate);
    if (leaveType) data.leaveType = leaveType;
    if (reason) data.reason = reason;
    if (totalDays) data.totalDays = totalDays;
    if (status) data.status = status;
    if (approvedBy !== undefined) data.approvedBy = approvedBy;
    if (req.body.rejectedBy !== undefined) data.rejectedBy = req.body.rejectedBy;

    console.log('[DEBUG] updateLeaveDetails - rejectedBy:', req.body.rejectedBy);
    console.log('[DEBUG] updateLeaveDetails - data object:', data);

    const updatedLeave = await prisma.leaveManagements.update({
      where: { id: leaveId },
      data,
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

exports.approveLeave = async (req, res) => {
  try {
    const leaveId = Number(req.params.id);
    const { approvedBy } = req.body;

    const updatedLeave = await prisma.leaveManagements.update({
      where: { id: leaveId },
      data: {
        status: "APPROVED",
        approvedBy: approvedBy || null,
      },
    });

    res.json({
      message: "Leave approved successfully",
      data: updatedLeave,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectLeave = async (req, res) => {
  try {
    const leaveId = Number(req.params.id);

    console.log('[DEBUG] rejectLeave - req.body:', req.body);
    console.log('[DEBUG] rejectLeave - rejectedBy:', req.body.rejectedBy);

    const updatedLeave = await prisma.leaveManagements.update({
      where: { id: leaveId },
      data: {
        status: "REJECTED",
        rejectedBy: req.body.rejectedBy || null,
      },
    });

    console.log('[DEBUG] rejectLeave - updatedLeave:', updatedLeave);

    res.json({
      message: "Leave rejected successfully",
      data: updatedLeave,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
