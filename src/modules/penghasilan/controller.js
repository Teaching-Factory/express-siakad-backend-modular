const { Penghasilan } = require("../../../models");

const getAllPenghasilan = async (req, res, next) => {
  try {
    // Ambil semua data penghasilan dari database
    const penghasilan = await Penghasilan.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Penghasilan Success",
      jumlahData: penghasilan.length,
      data: penghasilan,
    });
  } catch (error) {
    next(error);
  }
};

const getPenghasilanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const PenghasilanId = req.params.id;

    // Periksa apakah ID disediakan
    if (!PenghasilanId) {
      return res.status(400).json({
        message: "Penghasilan ID is required",
      });
    }

    // Cari data penghasilan berdasarkan ID di database
    const penghasilan = await Penghasilan.findByPk(PenghasilanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!penghasilan) {
      return res.status(404).json({
        message: `<===== Penghasilan With ID ${PenghasilanId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Penghasilan By ID ${PenghasilanId} Success:`,
      data: penghasilan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPenghasilan,
  getPenghasilanById,
};
