const pool = require("../config/neonConfig");

exports.getUsers = async (req, res) => {
    try {
        const userDetails = await pool.query("SELECT * FROM users");

        res.json({
            users: userDetails.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};


exports.healthCheck = async (req, res) => {
    try {
        const result = await pool.query("SELECT 1");

        res.json({
            status: "DB connected",
            result: result.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "DB connection failed" });
    }
};
