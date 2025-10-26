require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");

// Middleware import
const { protect } = require("./middlewares/authMiddlewares");

// AI Controllers
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");

const app = express();

// --------------------- MIDDLEWARE ---------------------
// CORS for frontend dev on 5173
app.use(
  cors({
    origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON body parser
app.use(express.json());

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------------------- API ROUTES ---------------------
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

// AI routes (protected)
app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateConceptExplanation);

// --------------------- FRONTEND SERVING (Production only) ---------------------
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../Frontend/dist");
  app.use(express.static(frontendPath));

  // SPA fallback
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// --------------------- DATABASE & SERVER ---------------------
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
