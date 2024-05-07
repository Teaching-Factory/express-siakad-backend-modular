const { KelasKuliah } = require("../../models");

const getAllKelasKuliah = async (req, res) => {
  try {
    // Ambil semua data kelas_kuliah dari database
    const kelas_kuliah = await KelasKuliah.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Kelas Kuliah Success",
      jumlahData: kelas_kuliah.length,
      data: kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getKelasKuliahById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const KelasKuliahId = req.params.id;

    // Cari data kelas_kuliah berdasarkan ID di database
    const kelas_kuliah = await KelasKuliah.findByPk(KelasKuliahId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!kelas_kuliah) {
      return res.status(404).json({
        message: `<===== Kelas Kuliah With ID ${KelasKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Kelas Kuliah By ID ${KelasKuliahId} Success:`,
      data: kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKelasKuliah,
  getKelasKuliahById,
};
