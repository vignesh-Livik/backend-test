const express = require("express");
const {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
} = require("../controller/userController");

const router = express.Router();

router.post("/create-user", createUser);
router.get("/get-users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
