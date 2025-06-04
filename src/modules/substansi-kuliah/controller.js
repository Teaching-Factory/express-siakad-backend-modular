const { SubstansiKuliah, Substansi } = require("../../../models");

const getAllSubstansiKuliah = async (req, res, next) => {
  try {
    // Ambil semua data substansi_kuliah dari database
    const substansi_kuliah = await SubstansiKuliah.findAll({ include: [{ model: Substansi }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Substansi Kuliah Success",
      jumlahData: substansi_kuliah.length,
      data: substansi_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getSubstansiKuliahById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const SubstansiKuliahId = req.params.id;

    // Periksa apakah ID disediakan
    if (!SubstansiKuliahId) {
      return res.status(400).json({
        message: "Substansi Kuliah ID is required",
      });
    }

    // Cari data substansi_kuliah berdasarkan ID di database
    const substansi_kuliah = await SubstansiKuliah.findByPk(SubstansiKuliahId, {
      include: [{ model: Substansi }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!substansi_kuliah) {
      return res.status(404).json({
        message: `<===== Substansi Kuliah With ID ${SubstansiKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Substansi Kuliah By ID ${SubstansiKuliahId} Success:`,
      data: substansi_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSubstansiKuliah,
  getSubstansiKuliahById,
};
