const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Publication = require("../models/Publication");
const { authenticateToken } = require("../middleware/auth");

// Multer setup for PDF uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  }
});

// ✅ Route: Add a new publication
router.post("/add", authenticateToken, upload.single("pdf"), async (req, res) => {
  try {
    const { title, abstract, publicationDate } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required." });
    }

    const newPublication = new Publication({
      title,
      abstract,
      publicationDate,
      status: "pending",
      author: req.user.id,
      pdfPath: req.file.filename,
      downloadLinks: "", // Placeholder for future use
    });

    const savedPublication = await newPublication.save();
    res.status(201).json(savedPublication);
  } catch (err) {
    console.error("Error adding publication:", err);
    res.status(500).json({ message: "Error adding publication", error: err.message });
  }
});

// ✅ Route: Get publications (admin = all, author = own)
router.get("/mine", authenticateToken, async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { author: req.user.id };

    const publications = await Publication.find(query)
      .populate("author", "name email username") // ✅ Include username
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json(publications);
  } catch (err) {
    console.error("Error fetching publications:", err);
    res.status(500).json({ message: "Error fetching publications", error: err.message });
  }
});

// ✅ Route: Admin can update publication status
router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update status" });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedPublication = await Publication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("author", "name email username") // ✅ Include username
      .select("-__v");

    if (!updatedPublication) {
      return res.status(404).json({ message: "Publication not found" });
    }

    res.status(200).json(updatedPublication);
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
});

module.exports = router;
