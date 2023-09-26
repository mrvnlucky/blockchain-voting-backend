const router = require("express").Router();

const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");
const candidateRoutes = require("./candidateRoutes");
const voteRoutes = require("./voteRoutes");
const authRoutes = require("./authRoutes");

router.use("/users", userRoutes);
router.use("/admins", adminRoutes);
router.use("/candidates", candidateRoutes);
router.use("/vote", voteRoutes);
router.use("/auth", authRoutes);

module.exports = router;
