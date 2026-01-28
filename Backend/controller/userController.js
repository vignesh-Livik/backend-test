const prisma = require("../prisma/client");

/* ================= CREATE USER ================= */
const createUser = async (req, res) => {
  try {
    const { userId, email, password, role, joinDate } = req.body;

    const user = await prisma.user.create({
      data: {
        userId,
        email,
        password,
        role,
        joinDate: new Date(joinDate),
      },
    });

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};
/* ================= GET ALL USERS ================= */
const getAllUsers = async (req, res) => {
  try {
    console.log("GET ALL USERS API HIT");

    const users = await prisma.user.findMany();

    console.log("Users fetched:", users);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET USER BY ID ================= */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { userId: id },
      include: {
        bankDetails: true,
        eduDetails: true,
        userPersonalDetails: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Backend Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/* ================= UPDATE USER ================= */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // this is userId
    const { email, role } = req.body;

    const user = await prisma.user.update({
      where: { userId: id },
      data: { email, role },
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};

/* ================= DELETE USER ================= */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { userId: id },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
};
