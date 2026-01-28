const prisma = require("../prisma/client.js");

const sendMail = require("../utils/emailService.js");

exports.createAssignment = async (req, res) => {
  try {
    const { editorId, viewerId } = req.body;

    if (!editorId || !viewerId) {
      return res.status(400).json({
        message: "editorId and viewerId required",
      });
    }

    const editor = await prisma.user.findUnique({
      where: { userId: editorId },
      select: { role: true, email: true },
    });

    if (!editor) {
      return res.status(404).json({
        message: "Editor not found",
      });
    }

    if (editor.role !== "EDITOR") {
      return res.status(403).json({
        message: "User is not an editor",
      });
    }

    const viewer = await prisma.user.findUnique({
      where: { userId: viewerId },
      select: {
        userId: true,
        email: true,
        // name: true,
      },
    });

    if (!viewer) {
      return res.status(404).json({
        message: "Viewer not found",
      });
    }

    const assignment = await prisma.assignmentsManagement.create({
      data: {
        editorId,
        viewerId,
      },
    });
    await sendMail({
      to: viewer.email,
      subject: "You have been assigned an editor",
      html: `
  <div style="font-family: Arial, Helvetica, sans-serif; color: #333; line-height: 1.6;">
    
    <h3 style="margin-bottom: 12px;">
      Hello ${viewer.email},
    </h3>

    <p>
      You have been <strong>successfully assigned to an editor</strong>.
    </p>

    <p>
      For any profile changes or updates, please contact your editor at 
      <strong>${editor.email}</strong>.
    </p>

    <p>
      Please log in to your dashboard to view the assignment details.
    </p>

    <p style="margin: 16px 0;">
       <a 
        href="https://training-submissions-frontend.vercel.app"
        target="_blank"
        style="color: #1a73e8; font-weight: bold;"
      >
        Go to Dashboard
      </a>
    </p>

    <br />

    <p>
      Thanks,<br />
      <span style="color: #1a73e8; font-weight: bold;">
        Team Livik
      </span>
    </p>

  </div>
`,
    }).catch((err) => {
      console.error("Mail failed:", err.message);
    });
    res.status(201).json({
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Viewer already has an assignment",
      });
    }

    res.status(500).json({
      message: "Failed to create assignment",
      error: error.message,
    });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await prisma.assignmentsManagement.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        // editor: {
        //     select: {
        //         userId: true,
        //         email: true,
        //         role: true,
        //     },
        // },
        user: {
          select: {
            userId: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assignments",
      error: error.message,
    });
  }
};

exports.getAssignmentsByEditor = async (req, res) => {
  try {
    const { editorId } = req.params;

    const assignments = await prisma.assignmentsManagement.findMany({
      where: { editorId },
      include: {
        user: {
          select: {
            userId: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { editorId, viewerId } = req.body;

    if (!editorId && !viewerId) {
      return res.status(400).json({
        message: "At least one field (editorId or viewerId) is required",
      });
    }

    const updatedAssignment = await prisma.assignmentsManagement.update({
      where: { id: Number(id) },
      data: {
        ...(editorId && { editorId }),
        ...(viewerId && { viewerId }),
      },
    });

    res.status(200).json({
      message: "Assignment updated successfully",
      assignment: updatedAssignment,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Viewer already has an assignment",
      });
    }

    res.status(500).json({
      message: "Failed to update assignment",
      error: error.message,
    });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.assignmentsManagement.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
