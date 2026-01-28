const express = require("express");
const router = express.Router();
const upload = require("../middleware/imageUpload");

router.post("/", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
    }

    res.status(201).json({
        message: "Image uploaded successfully",
        imageName: req.file.filename,
        imageUrl: `/upload/${req.file.filename}`,
    });
});

module.exports = router;
