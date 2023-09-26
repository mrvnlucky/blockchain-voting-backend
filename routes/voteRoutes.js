const router = require("express").Router();
const {
  voteCandidate,
  startVoting,
  stopVoting,
  getVoteResult,
  getVotingStatus,
  getMyVote,
} = require("../controllers/voteController");
const {
  authMiddleware,
  adminAuthMiddleware,
} = require("../middleware/authMiddleware");

router.get("/result", getVoteResult);
router.get("/", getVotingStatus);

router.post("/cast/:id", authMiddleware, voteCandidate);
router.get("/me", authMiddleware, getMyVote);

router.post("/start", adminAuthMiddleware, startVoting);
router.post("/stop", adminAuthMiddleware, stopVoting);

module.exports = router;
