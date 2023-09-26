const router = require("express").Router();
const {
  loginUser,
  checkUserAuth,
  loginAdmin,
  checkAdminAuth,
} = require("../controllers/authController");
const {
  authMiddleware,
  adminAuthMiddleware,
} = require("../middleware/authMiddleware");

router.post("/login", loginUser);
router.get("/", authMiddleware, checkUserAuth);

router.post("/admin/login", loginAdmin);
router.get("/admin", adminAuthMiddleware, checkAdminAuth);

module.exports = router;
