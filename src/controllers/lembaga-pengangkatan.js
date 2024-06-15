const { LembagaPengangkatan } = require("../../models");

const getAllLembagaPengangkatan = async (req, res, next) => {
  try {
    // Ambil semua data lembaga_pengangkatan dari database
    const lembaga_pengangkatan = await LembagaPengangkatan.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Lembaga Pengangkatan Success",
      jumlahData: lembaga_pengangkatan.length,
      data: lembaga_pengangkatan,
    });
  } catch (error) {
    next(error);
  }
};

const getLembagaPengangkatanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const LembagaPengangkatanId = req.params.id;

    // Periksa apakah ID disediakan
    if (!LembagaPengangkatanId) {
      return res.status(400).json({
        message: "Lembaga Pengangkatan ID is required",
      });
    }

    // Cari data lembaga_pengangkatan berdasarkan ID di database
    const lembaga_pengangkatan = await LembagaPengangkatan.findByPk(LembagaPengangkatanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!lembaga_pengangkatan) {
      return res.status(404).json({
        message: `<===== Lembaga Pengangkatan With ID ${LembagaPengangkatanId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Lembaga Pengangkatan By ID ${LembagaPengangkatanId} Success:`,
      data: lembaga_pengangkatan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLembagaPengangkatan,
  getLembagaPengangkatanById,
};
