const db = require("../models");
const User = db.User;
const Candidate = db.Candidate;
require("dotenv").config();
const { contractInstance } = require("../config/blockchainConfig");
const { setUserContractInstance } = require("../utils/walletService");
const { encryptText, decryptText } = require("../utils/encryption");

// @desc    Vote candidate
// @route   POST /api/v1/vote/:id
// @access  user
exports.voteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const candidateExists = await Candidate.findOne({
      where: { candidateNo: id },
    });

    if (!candidateExists) {
      return res.status(400).send({
        success: false,
        message: "Silahkan pilih kandidat",
      });
    }

    const user = await User.findOne({
      where: { id: req.user.data.id },
    });

    const privateKey = decryptText(user.privateKey);
    const userContractInstance = setUserContractInstance(privateKey);

    const hashedCandidateNo = encryptText(id);

    const tx = await userContractInstance.castVote(hashedCandidateNo);
    await tx.wait();

    res.status(200).send({
      success: true,
      message: "Pemilihan berhasil",
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("You have already voted.")) {
      return res.status(400).send({
        success: false,
        message: "Kamu sudah memilih",
      });
    } else {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }
};

// @desc    Vote candidate
// @route   POST /api/v1/vote/result
// @access  user
exports.getVoteResult = async (req, res) => {
  try {
    const tx_users = await contractInstance.getAllVoters();
    const users = tx_users.map((user) => {
      const candidateNo = parseInt(
        user.hashedCandidateNo !== "" ? decryptText(user.hashedCandidateNo) : ""
      );
      return {
        voterAddress: user.voterAddress,
        isVoted: user.isVoted,
        hashedCandidateNo: user.hashedCandidateNo,
        isAllowed: user.isAllowed,
        candidateNo: candidateNo,
      };
    });

    const allCandidates = await Candidate.findAll();

    const candidates = allCandidates.map((candidate) => {
      const voteCount = users.filter(
        (user) => user.candidateNo === candidate.candidateNo
      ).length;
      return {
        id: candidate.id,
        candidateNo: candidate.candidateNo,
        name: candidate.name,
        vision: candidate.vision,
        mission: candidate.mission,
        img: candidate.img,
        voteCount: voteCount,
      };
    });

    const sortedCandidates = candidates.sort((a, b) => {
      if (b.voteCount === a.voteCount) {
        return a.candidateNo - b.candidateNo;
      }
      return b.voteCount - a.voteCount;
    });

    res.status(200).send({
      success: true,
      message: "Berhasil mengambil data hasil akhir",
      data: sortedCandidates,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).send({
      success: false,
      message: error,
    });
  }
};

// @desc    Start voting
// @route   POST /api/v1/vote/start-vote
// @access  admin
exports.startVoting = async (req, res) => {
  try {
    const tx = await contractInstance.startVoting();
    await tx.wait();
    res.status(200).send({
      success: true,
      message: "Berhasil memulai pemilihan",
    });
  } catch (error) {
    if (error.message.includes("Voting is already running.")) {
      return res.status(400).send({
        success: false,
        message: "Pemilihan sedang berjalan",
      });
    } else {
      console.error(error);

      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }
};

// @desc    Stop voting
// @route   POST /api/v1/stop-vote
// @access  admin
exports.stopVoting = async (req, res) => {
  try {
    const tx = await contractInstance.stopVoting();
    await tx.wait();
    res.status(200).send({
      success: true,
      message: "Berhasil menghentikan pemilihan",
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("Voting is already stopped")) {
      return res.status(400).send({
        success: false,
        message: "Pemilihan sedang tidak berjalan",
      });
    } else {
      return res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }
};

exports.getVotingStatus = async (req, res) => {
  try {
    const tx = await contractInstance.getVotingStatus();
    res.status(200).send({
      success: true,
      message: "Berhasil mengambil statu pemilihan",
      data: tx,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyVote = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.data.id } });

    const userAddress = decryptText(user.walletAddress);

    const tx = await contractInstance.getMyVote(userAddress);

    const candidate = await Candidate.findOne({
      where: { candidateNo: decryptText(tx) },
    });

    if (!candidate) {
      return res.status(400).send({
        success: false,
        message: "Kandidat tidak ditemukan",
      });
    }

    res.status(200).send({
      success: true,
      message: "Berhasil mengambil data pemilihan anda",
      data: candidate,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({
      success: false,
      message: error,
    });
  }
};
