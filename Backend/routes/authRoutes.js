const router = require("express").Router();
const { login, signup } = require("../controller/authController");

router.post("/login", login).post("/signup", signup);

module.exports = router;
