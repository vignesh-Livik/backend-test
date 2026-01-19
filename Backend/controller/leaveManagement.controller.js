// const prisma = require("../prisma/client.js");

// /**
//  * Apply Leave
//  */
// exports.applyLeave = async (req, res) => {
//   try {
//     const { userId, leaveType, startDate, endDate, totalDays, reason } =
//       req.body;

//   const leave = await prisma.leaveManagements.create({
//     data: {
//       leaveType,
//       startDate: new Date(startDate),
//       endDate: new Date(endDate),
//       totalDays,
//       reason,
//       status: "PENDING",

//       // ✅ REQUIRED FIX
//       user: {
//         connect: {
//           id: userId,
//         },
//       },
//     },
//   });

//      res.status(201).json({
//       message: "Leave applied successfully",
//       data: leave,
//      });
//     } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Get leaves by user
//  */
// exports.getLeavesByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const leaves = await prisma.leaveManagements.findMany({
//       where: { userId },
//       include: { user: true },
//     });

//     res.json(leaves);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Get all leaves (HR/Admin)
//  */
// exports.getAllLeaves = async (req, res) => {
//   try {
//     const leaves = await prisma.leaveManagements.findMany({
//       include: {
//         user: true,
//         approver: true,
//       },
//     });

//     res.json(leaves);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Approve / Reject leave
//  */
// exports.updateLeaveStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, approvedBy } = req.body;

//     const updatedLeave = await prisma.leaveManagements.update({
//       where: { id: Number(id) },
//       data: { status, approvedBy },
//     });

//     res.json({
//       message: "Leave status updated",
//       data: updatedLeave,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Delete leave
//  */
// exports.deleteLeave = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await prisma.leaveManagements.delete({
//       where: { id: Number(id) },
//     });

//     res.json({ message: "Leave deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

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

/**
 * Approve / Reject leave
 * approvedBy MUST be User.userId (HR)
 */
exports.updateLeaveStatus = async (req, res) => {
  try {
    const leaveId = Number(req.params.id);
    const { status, approvedBy } = req.body;

    if (isNaN(leaveId)) {
      return res.status(400).json({ error: "Invalid leave ID" });
    }

    if (!approvedBy) {
      return res.status(400).json({ error: "approvedBy is required" });
    }

    const approver = await prisma.user.findUnique({
      where: { userId: approvedBy },
    });

    if (!approver) {
      return res.status(404).json({ error: "Approver not found" });
    }

    const normalizedStatus = status?.toUpperCase();
    const allowedStatus = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"];

    if (!allowedStatus.includes(normalizedStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const existingLeave = await prisma.leaveManagements.findUnique({
      where: { id: leaveId },
    });

    if (!existingLeave) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    const updatedLeave = await prisma.leaveManagements.update({
      where: { id: leaveId },
      data: {
        status: normalizedStatus,
        approvedBy,
      },
    });

    res.json({
      message: "Leave status updated successfully",
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
