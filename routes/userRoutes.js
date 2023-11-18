const router = require("express").Router();
const {
  getAllUsers,
  getOneUser,
  createUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const { adminAuthMiddleware } = require("../middleware/authMiddleware");

// Routes for admin
router.get("/", getAllUsers);
router.get("/:id", getOneUser);
router.post("/", adminAuthMiddleware, createUser);
router.delete("/:id", adminAuthMiddleware, deleteUser);
router.put("/:id", adminAuthMiddleware, updateUser);

module.exports = router;
