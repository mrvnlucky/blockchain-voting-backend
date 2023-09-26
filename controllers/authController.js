const db = require("../models");
const User = db.User;
const Admin = db.Admin;
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const { decryptText, encryptText } = require("../utils/encryption");

// @desc    Login user
// @route   POST /api/v1/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { nik, password } = req.body;
    // Check for user nik

    if (!nik || !password) {
      return res.status(400).send({
        success: false,
        message: "Silahkan lengkapi NIK dan password Anda",
      });
    }

    const user = await User.findOne({ where: { nik: nik } });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!user || !passwordMatch) {
      return res.status(401).send({
        success: false,
        message: "Silahkan lengkapi NIK dan password Anda",
      });
    }

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Password tidak sesuai",
      });
    }

    const token = generateToken({ id: user.id, role: "user" });

    return res.status(200).send({
      success: true,
      message: "Login berhasil",
      data: { token, user },
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.checkUserAuth = async (req, res) => {
  try {
    const userId = req.user.data.id;
    const user = await User.findOne({ where: { id: userId } });
    return res.status(200).json({
      success: true,
      message: "User authorized",
      data: user,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Authenticate admin account
// @route   POST /api/v1/admins/login
// @access  Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({
        success: false,
        message: "Silahkan lengkapi username dan password Anda",
      });
    }

    // Check for admin username
    const admin = await Admin.findOne({ where: { username: username } });
    if (!admin) {
      return res.status(400).send({
        success: false,
        message: "Akun admin tidak ditemukan",
      });
    }

    const token = generateToken({ id: admin.id, role: "admin" });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      return res.send({
        success: true,
        message: "Login admin berhasil",
        data: { token, admin },
      });
    }
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

exports.checkAdminAuth = async (req, res) => {
  try {
    const adminId = req.user.data.id;

    const admin = await Admin.findOne({ where: { id: adminId } });
    return res.status(200).json({
      success: true,
      message: "Admin authorized",
      data: admin,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};
