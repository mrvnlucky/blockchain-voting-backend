const db = require("../models");
const Candidate = db.Candidate;
const cloudinary = require("../config/cloudinary");

// @desc    Add candidate
// @route   POST /api/v1/candidates
// @access  admin
exports.createCandidate = async (req, res) => {
  try {
    const { candidateNo, name, vision, mission } = req.body;

    if (!candidateNo || !name || !vision || !mission) {
      return res.status(400).send({
        success: false,
        message: "Silahkan lengkapi data kandidat",
      });
    }
    if (!(req.file && req.file.path)) {
      return res.status(400).send({
        success: false,
        message: "Silahkan upload foto kandidat",
      });
    }

    const img = await cloudinary.uploader.upload(req.file.path, {
      folder: "Blockvote/candidates",
    });

    const candidate = await Candidate.create({
      candidateNo: candidateNo,
      name: name,
      vision: vision,
      mission: mission,
      img: img.secure_url,
    });

    res.status(201).send({
      success: true,
      message: "Data kandidat berhasil ditambahkan",
      data: candidate,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get candidates
// @route   GET /api/v1/candidates
// @access  admin
exports.getAllCandidates = async (req, res) => {
  try {
    const allCandidates = await Candidate.findAll({
      order: ["candidateNo"],
    });

    const candidates = allCandidates.map((candidate) => ({
      id: candidate.id,
      candidateNo: candidate.candidateNo,
      name: candidate.name,
      vision: candidate.vision,
      mission: candidate.mission,
      img: candidate.img,
    }));

    res.status(200).send({
      success: true,
      message: "Berhasil mengambil data kandidat",
      data: candidates,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get one candidate
// @route   GET /api/v1/candidates/:id
// @access  admin
exports.getOneCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findOne({ where: { id: id } });

    if (!candidate) {
      return res.status(400).send({
        success: false,
        message: "Admin tidak ditemukan",
      });
    }

    res.status(200).send({
      success: true,
      message: "Berhasil mengambil data kandidat",
      data: candidate,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update candidate
// @route   PUT /api/v1/candidates/:id
// @access  admin
exports.updateCandidate = async (req, res) => {
  try {
    const { candidateNo, name, vision, mission } = req.body;
    const { id } = req.params;
    const candidate = await Candidate.findOne({ where: { id: id } });
    if (!candidate) {
      return res.status(400).send({
        success: false,
        message: "Kandidat tidak ditemukan",
      });
    }

    if (req.file) {
      const img = await cloudinary.uploader.upload(req.file.buffer, {
        folder: "Blockvote/candidates",
      });
      await Candidate.update(
        {
          candidateNo: candidateNo,
          name: name,
          vision: vision,
          mission: mission,
          img: img.secure_url,
        },
        { where: { id: id }, returning: true }
      );
    } else {
      await Candidate.update(
        {
          candidateNo: candidateNo,
          name: name,
          vision: vision,
          mission: mission,
        },
        { where: { id: id }, returning: true }
      );
    }

    res.status(200).send({
      success: true,
      message: "Data kandidat berhasil diubah",
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove candidate
// @route   DELETE /api/v1/candidates/:id
// @access  admin
exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findOne({ where: { id: id } });
    if (!candidate) {
      return res.status(400).send({
        success: false,
        message: "Kandidat tidak ditemukan",
      });
    }
    await candidate.destroy({ where: { id: id } });
    res.status(200).json({
      success: true,
      message: "Data kandidat berhasil dihapus",
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};
