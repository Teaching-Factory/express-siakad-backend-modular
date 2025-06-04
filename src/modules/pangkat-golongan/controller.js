const { PangkatGolongan } = require("../../../models");

const getAllPangkatGolongan = async (req, res, next) => {
  try {
    // Ambil semua data pangkat_golongan dari database
    const pangkat_golongan = await PangkatGolongan.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Pangkat Golongan Success",
      jumlahData: pangkat_golongan.length,
      data: pangkat_golongan,
    });
  } catch (error) {
    next(error);
  }
};

const getPangkatGolonganById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const PangkatGolonganId = req.params.id;

    // Periksa apakah ID disediakan
    if (!PangkatGolonganId) {
      return res.status(400).json({
        message: "Pangkat Golongan ID is required",
      });
    }

    // Cari data pangkat_golongan berdasarkan ID di database
    const pangkat_golongan = await PangkatGolongan.findByPk(PangkatGolonganId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!pangkat_golongan) {
      return res.status(404).json({
        message: `<===== Pangkat Golongan With ID ${PangkatGolonganId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Pangkat Golongan By ID ${PangkatGolonganId} Success:`,
      data: pangkat_golongan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPangkatGolongan,
  getPangkatGolonganById,
};
