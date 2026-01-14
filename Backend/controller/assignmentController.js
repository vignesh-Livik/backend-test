const prisma = require("../prisma/client.js");

exports.createAssignment = async (req, res) => {
    try {
        const { editorId, viewerId } = req.body;

        if (!editorId || !viewerId) {
            return res.status(400).json({ message: "editorId and viewerId required" });
        }

        const assignment = await prisma.assignmentsManagement.create({
            data: {
                editorId,
                viewerId,
            },
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


exports.getAssignmentsByViewer = async (req, res) => {
    try {
        const { viewerId } = req.params;

        const assignments = await prisma.assignmentsManagement.findMany({
            where: { viewerId },
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


exports.updatePersonalDetails = async (req, res) => {
    const { editorId, viewerId } = req.params;
    const updatedData = req.body;

    try {
        const assignment = await prisma.assignmentsManagement.findFirst({
            where: {
                editorId,
                viewerId,
                assignmentStatus: "pending",
            },
        });
        if (!assignment) {
            return res.status(403).json({
                message: "No active assignment found",
            });
        }
        const updated = await prisma.userPersonalDetails.update({
            where: { userId: viewerId },
            data: updatedData,
        });
        res.status(200).json({
            message: "Personal details updated successfully",
            data: updated,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.updateBankDetails = async (req, res) => {
    const { editorId, viewerId } = req.params;
    const updatedData = req.body;

    try {

        const assignment = await prisma.assignmentsManagement.findFirst({
            where: {
                editorId,
                viewerId,
                assignmentStatus: "pending",
            },
        });

        if (!assignment) {
            return res.status(403).json({
                message: "No active assignment found",
            });
        }
        const updated = await prisma.bankDetails.update({
            where: { userId: viewerId },
            data: updatedData,
        });

        res.status(200).json({
            message: "Bank details updated successfully",
            data: updated,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
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
