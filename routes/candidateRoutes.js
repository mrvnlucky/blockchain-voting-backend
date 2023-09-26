const router = require("express").Router();
const {
  getAllCandidates,
  createCandidate,
  deleteCandidate,
  getOneCandidate,
  updateCandidate,
} = require("../controllers/candidateController");
const { adminAuthMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

router.get("/", getAllCandidates);
router.get("/:id", getOneCandidate);

// Routes for admin
router.post("/", adminAuthMiddleware, upload.single("img"), createCandidate);
router.delete("/:id", adminAuthMiddleware, deleteCandidate);
router.put("/:id", adminAuthMiddleware, upload.single("img"), updateCandidate);

module.exports = router;
