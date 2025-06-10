const { Sekolah } = require("../../../models");

const getAllSekolah = async (req, res, next) => {
  try {
    // Ambil data sekolahs dari database dengan hanya kolom id dan sekolah
    const sekolahs = await Sekolah.findAll({
      attributes: ["id", "sekolah"]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Sekolah Success",
      jumlahData: sekolahs.length,
      data: sekolahs
    });
  } catch (error) {
    next(error);
  }
};

const getSekolahById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const sekolahId = req.params.id;

    if (!sekolahId) {
      return res.status(400).json({
        message: "Sekolah ID is required"
      });
    }

    // Cari data sekolah berdasarkan ID di database
    const sekolah = await Sekolah.findByPk(sekolahId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!sekolah) {
      return res.status(404).json({
        message: `<===== Sekolah With ID ${sekolahId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Sekolah By ID ${sekolahId} Success:`,
      data: sekolah
    });
  } catch (error) {
    next(error);
  }
};

const getAllSekolahSMK = async (req, res, next) => {
  try {
    // Ambil data sekolah_smk dari database dengan hanya kolom id dan sekolah
    const sekolah_smk = await Sekolah.findAll({
      where: {
        bentuk: "SMK"
      },
      attributes: ["id", "sekolah"]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Sekolah SMK Success",
      jumlahData: sekolah_smk.length,
      data: sekolah_smk
    });
  } catch (error) {
    next(error);
  }
};

const getAllSekolahSMA = async (req, res, next) => {
  try {
    // Ambil data sekolah_sma dari database dengan hanya kolom id dan sekolah
    const sekolah_sma = await Sekolah.findAll({
      where: {
        bentuk: "SMA"
      },
      attributes: ["id", "sekolah"]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Sekolah SMK Success",
      jumlahData: sekolah_sma.length,
      data: sekolah_sma
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSekolah,
  getSekolahById,
  getAllSekolahSMK,
  getAllSekolahSMA
};
