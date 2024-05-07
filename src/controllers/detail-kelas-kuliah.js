const { DetailKelasKuliah } = require("../../models");

const getAllDetailKelasKuliah = async (req, res) => {
  try {
    // Ambil semua data detail_kelas_kuliah dari database
    const detail_kelas_kuliah = await DetailKelasKuliah.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Kelas Kuliah Success",
      jumlahData: detail_kelas_kuliah.length,
      data: detail_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getDetailKelasKuliahById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const DetailKelasKuliahId = req.params.id;

    // Cari data detail_kelas_kuliah berdasarkan ID di database
    const detail_kelas_kuliah = await DetailKelasKuliah.findByPk(DetailKelasKuliahId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!detail_kelas_kuliah) {
      return res.status(404).json({
        message: `<===== Detail Kelas Kuliah With ID ${DetailKelasKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Detail Kelas Kuliah By ID ${DetailKelasKuliahId} Success:`,
      data: detail_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDetailKelasKuliah,
  getDetailKelasKuliahById,
};
