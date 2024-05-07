const { SubstansiKuliah } = require("../../models");

const getAllSubstansiKuliah = async (req, res) => {
  try {
    // Ambil semua data substansi_kuliah dari database
    const substansi_kuliah = await SubstansiKuliah.findAll();

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

const getSubstansiKuliahById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const SubstansiKuliahId = req.params.id;

    // Cari data substansi_kuliah berdasarkan ID di database
    const substansi_kuliah = await SubstansiKuliah.findByPk(SubstansiKuliahId);

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
