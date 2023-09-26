const router = require("express").Router();
const {
  createAdmin,
  getAllAdmins,
  getOneAdmin,
  deleteAdmin,
  updateAdmin,
} = require("../controllers/adminController");
const { adminAuthMiddleware } = require("../middleware/authMiddleware");

router.get("/", adminAuthMiddleware, getAllAdmins);
router.get("/:id", adminAuthMiddleware, getOneAdmin);

router.post("/", adminAuthMiddleware, createAdmin);
router.put("/:id", adminAuthMiddleware, updateAdmin);
router.delete("/:id", adminAuthMiddleware, deleteAdmin);

module.exports = router;
