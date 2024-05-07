const { PesertaKelasKuliah } = require("../../models");

const getAllPesertaKelasKuliah = async (req, res) => {
  try {
    // Ambil semua data peserta_kelas_kuliah dari database
    const peserta_kelas_kuliah = await PesertaKelasKuliah.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Peserta Kelas Kuliah Success",
      jumlahData: peserta_kelas_kuliah.length,
      data: peserta_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getPesertaKelasKuliahById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const PesertaKelasKuliahId = req.params.id;

    // Cari data peserta_kelas_kuliah berdasarkan ID di database
    const peserta_kelas_kuliah = await PesertaKelasKuliah.findByPk(PesertaKelasKuliahId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!peserta_kelas_kuliah) {
      return res.status(404).json({
        message: `<===== Peserta Kelas Kuliah With ID ${PesertaKelasKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Peserta Kelas Kuliah By ID ${PesertaKelasKuliahId} Success:`,
      data: peserta_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPesertaKelasKuliah,
  getPesertaKelasKuliahById,
};
