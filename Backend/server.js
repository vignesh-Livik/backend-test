const express = require("express");
const cors = require("cors");
require("dotenv").config();
const apiRoutes = require("./routes/testApiRoute");
const authRoutes = require("./routes/authRoutes");
const bankroutes = require("./routes/bankRoutes");
const userRoutes = require("./routes/userRoutes");
const userPersonalDetailsRoutes = require("./routes/userPersonalDetailsRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const leaveRoutes = require("./routes/leave/route");
const eduRoutes = require("./routes/eduRoutes");

const app = express();
const PORT = 3000;
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Server Connected");
});

app.get("/", async (req, res) => {
  res.send("Server Connected");
});

app.use("/api", apiRoutes);
app.use("/api", userPersonalDetailsRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bank", bankroutes);
app.use("/user", userRoutes);
app.use("/api/education", eduRoutes);
app.use("/api/leaves", leaveRoutes);

// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}/`);
// });

module.exports = app;

