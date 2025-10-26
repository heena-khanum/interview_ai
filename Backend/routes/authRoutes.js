const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddlewares");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Setup multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

// Upload route
router.post("/upload-image", upload.single("image"), (req, res) => { 
    if (!req.file) return res.status(400).json({ message: "No file uploaded" }); 
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl }); 
});

module.exports = router;
