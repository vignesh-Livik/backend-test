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
