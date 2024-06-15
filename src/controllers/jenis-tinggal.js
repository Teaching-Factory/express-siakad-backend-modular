const { JenisTinggal } = require("../../models");

const getAllJenisTinggal = async (req, res, next) => {
  try {
    // Ambil semua data jenis_tinggal dari database
    const jenis_tinggal = await JenisTinggal.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Jenis Tinggal Success",
      jumlahData: jenis_tinggal.length,
      data: jenis_tinggal,
    });
  } catch (error) {
    next(error);
  }
};

const getJenisTinggalById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const JenisTinggalId = req.params.id;

    // Cari data jenis_tinggal berdasarkan ID di database
    const jenis_tinggal = await JenisTinggal.findByPk(JenisTinggalId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenis_tinggal) {
      return res.status(404).json({
        message: `<===== Jenis Tinggal With ID ${JenisTinggalId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Jenis Tinggal By ID ${JenisTinggalId} Success:`,
      data: jenis_tinggal,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJenisTinggal,
  getJenisTinggalById,
};
