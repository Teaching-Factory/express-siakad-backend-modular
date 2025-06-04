const { Pekerjaan } = require("../../../models");

const getAllPekerjaan = async (req, res, next) => {
  try {
    // Ambil semua data pekerjaan dari database
    const pekerjaan = await Pekerjaan.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Pekerjaan Success",
      jumlahData: pekerjaan.length,
      data: pekerjaan,
    });
  } catch (error) {
    next(error);
  }
};

const getPekerjaanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const PekerjaanId = req.params.id;

    // Periksa apakah ID disediakan
    if (!PekerjaanId) {
      return res.status(400).json({
        message: "Pekerjaan ID is required",
      });
    }

    // Cari data pekerjaan berdasarkan ID di database
    const pekerjaan = await Pekerjaan.findByPk(PekerjaanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!pekerjaan) {
      return res.status(404).json({
        message: `<===== Pekerjaan With ID ${PekerjaanId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Pekerjaan By ID ${PekerjaanId} Success:`,
      data: pekerjaan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPekerjaan,
  getPekerjaanById,
};
