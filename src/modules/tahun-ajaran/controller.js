const { TahunAjaran } = require("../../../models");

const getAllTahunAjaran = async (req, res, next) => {
  try {
    // Ambil semua data tahun_ajaran dari database
    const tahun_ajaran = await TahunAjaran.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Tahun Ajaran Success",
      jumlahData: tahun_ajaran.length,
      data: tahun_ajaran,
    });
  } catch (error) {
    next(error);
  }
};

const getTahunAjaranById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const TahunAjaranId = req.params.id;

    // Periksa apakah ID disediakan
    if (!TahunAjaranId) {
      return res.status(400).json({
        message: "Tahun Ajaran ID is required",
      });
    }

    // Cari data tahun_ajaran berdasarkan ID di database
    const tahun_ajaran = await TahunAjaran.findByPk(TahunAjaranId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!tahun_ajaran) {
      return res.status(404).json({
        message: `<===== Tahun Ajaran With ID ${TahunAjaranId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Tahun Ajaran By ID ${TahunAjaranId} Success:`,
      data: tahun_ajaran,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTahunAjaran,
  getTahunAjaranById,
};
