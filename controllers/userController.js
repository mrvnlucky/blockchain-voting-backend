const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const { ethers } = require("ethers");
const { decryptText, encryptText } = require("../utils/encryption");
const { contractInstance, signer } = require("../config/blockchainConfig");

// @desc    Create new user
// @route   POST /api/v1/users
// @access  Admin
exports.createUser = async (req, res) => {
  try {
    const { nik, password, verifyPassword } = req.body;
    if (!nik || !password) {
      return res.status(400).send({
        message: "Silahkan lengkapi NIK dan password",
      });
    }

    if (password !== verifyPassword) {
      return res.status(400).send({
        message: "Password tidak sesuai",
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ where: { nik: nik } });
    if (userExists) {
      return res.status(400).send({
        success: false,
        message: "NIK sudah terdaftar",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const wallet = ethers.Wallet.createRandom();
    await contractInstance.addAllowedVoter(wallet.address);

    const tx_sendEth = {
      to: wallet.address,
      value: ethers.utils.parseEther("0.001"),
    };

    await signer.sendTransaction(tx_sendEth);

    const hashedPrivateKey = encryptText(wallet.privateKey);
    const hashedWalletAddress = encryptText(wallet.address);
    // Create user
    const user = await User.create({
      nik: nik,
      password: hashedPassword,
      walletAddress: hashedWalletAddress,
      privateKey: hashedPrivateKey,
    });
    res.status(201).json({
      success: true,
      message: "Data user berhasil ditambahkan",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users
// @route   GET /api/v1/users
// @access   Admin
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.findAll();
    const tx_allUsers = await contractInstance.getAllVoters();

    const tx_users = tx_allUsers.map((tx_user) => ({
      voterAddress: tx_user.voterAddress,
      isVoted: tx_user.isVoted,
      hashedCandidateNo: tx_user.hashedCandidateNo,
      isAllowed: tx_user.isAllowed,
    }));

    const users = allUsers.map((user) => ({
      id: user.id,
      nik: user.nik,
      password: user.password,
      walletAddress: user.walletAddress,
      privateKey: user.privateKey,
    }));

    const combinedData = users.map((user) => {
      const matchingUser = tx_users.find(
        (tx_user) => tx_user.voterAddress === decryptText(user.walletAddress)
      );
      return {
        ...user,
        isVoted: matchingUser ? matchingUser.isVoted : false,
        hashedCandidateNo: matchingUser ? matchingUser.hashedCandidateNo : "",
        isAllowed: matchingUser ? matchingUser.isAllowed : false,
      };
    });

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data user",
      data: combinedData,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get one user
// @route   GET /api/v1/users/:id
// @access   Admin
exports.getOneUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "User tidak ditemukan",
      });
    }
    const user = await User.findOne({ where: { id: id } });
    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data admin",
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update users
// @route   PUT /api/v1/users/:id
// @access  Admin
exports.updateUser = async (req, res) => {
  try {
    const { password } = req.body;
    const { id } = req.params;

    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User tidak ditemukan",
      });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.update(
      {
        password: hashedPassword,
      },
      { where: { id: user.id } }
    );

    res.status(200).json({
      success: true,
      message: "Data user berhasil diubah",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);

    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const userWalletAddress = decryptText(user.walletAddress);

    await contractInstance.deleteVoter(userWalletAddress);
    await user.destroy();

    res.status(200).json({
      success: true,
      message: "Data user berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};
