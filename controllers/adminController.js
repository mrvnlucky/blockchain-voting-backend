const { contractInstance } = require("../config/blockchainConfig");
const db = require("../models");
const Admin = db.Admin;

const bcrypt = require("bcrypt");
const { encryptText } = require("../utils/encryption");
require("dotenv").config();

// @desc    Add new admin account
// @route   POST /api/v1/admins
// @access  Admin
exports.createAdmin = async (req, res) => {
  try {
    const { username, password, verifyPassword } = req.body;

    if (!username || !password || !verifyPassword) {
      return res.status(400).send({
        success: false,
        message: "Silahkan lengkapi username dan password",
      });
    }

    if (password !== verifyPassword) {
      return res.status(400).send({
        success: false,
        message: "Password tidak sesuai",
      });
    }

    // Check if admin exists
    const adminExists = await Admin.findOne({ where: { username } });
    if (adminExists) {
      return res.status(400).send({
        success: false,
        message: "Username sudah terdaftar",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
      username: username,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Data admin berhasil terdaftar",
      data: admin,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get admins
// @route   GET /api/v1/admins
// @access  Public
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data admin",
      data: admins,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

exports.getOneAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findOne({ where: { id: id } });
    if (!admin) {
      return res.status(400).send({
        success: false,
        message: "Admin tidak ditemukan",
      });
    }
    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data admin",
      data: admin,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const admin = await Admin.findOne({ where: { id: id } });

    if (!admin) {
      return res.status(400).send({
        success: false,
        message: "Admin tidak ditemukan",
      });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedAdmin = await Admin.update(
      {
        username: username,
        password: hashedPassword,
      },
      { where: { id: admin.id } }
    );

    res.status(200).send({
      success: true,
      message: "Data admin berhasil diubah",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findOne({ where: { id: id } });
    if (!admin) {
      return res.status(400).send({
        success: false,
        message: "Admin tidak ditemukan",
      });
    }
    await admin.destroy();

    res.status(200).json({
      success: true,
      message: "Data admin berhasil dihapus",
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};
