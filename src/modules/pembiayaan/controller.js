const { Pembiayaan } = require("../../../models");

const getAllPembiayaan = async (req, res, next) => {
  try {
    // Ambil semua data pembiayaan dari database
    const pembiayaan = await Pembiayaan.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Pembiayaan Success",
      jumlahData: pembiayaan.length,
      data: pembiayaan,
    });
  } catch (error) {
    next(error);
  }
};

const getPembiayaanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const PembiayaanId = req.params.id;

    // Periksa apakah ID disediakan
    if (!PembiayaanId) {
      return res.status(400).json({
        message: "Pembiayaan ID is required",
      });
    }

    // Cari data pembiayaan berdasarkan ID di database
    const pembiayaan = await Pembiayaan.findByPk(PembiayaanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!pembiayaan) {
      return res.status(404).json({
        message: `<===== Pembiayaan With ID ${PembiayaanId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Pembiayaan By ID ${PembiayaanId} Success:`,
      data: pembiayaan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPembiayaan,
  getPembiayaanById,
};
