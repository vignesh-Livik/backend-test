const express = require("express");
const {
    getUsers,
    healthCheck,
} = require("../controller/testApiController");

const router = express.Router();

router.get("/users", getUsers);
router.get("/health", healthCheck);

module.exports = router;
