const { SkalaNilaiProdi } = require("../../models");

const getAllSkalaNilaiProdi = async (req, res) => {
  try {
    // Ambil semua data skala_nilai_prodi dari database
    const skala_nilai_prodi = await SkalaNilaiProdi.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Skala Nilai Prodi Kelas Success",
      jumlahData: skala_nilai_prodi.length,
      data: skala_nilai_prodi,
    });
  } catch (error) {
    next(error);
  }
};

const getSkalaNilaiProdiById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const SkalaNilaiProdiId = req.params.id;

    // Cari data skala_nilai_prodi berdasarkan ID di database
    const skala_nilai_prodi = await SkalaNilaiProdi.findByPk(SkalaNilaiProdiId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!skala_nilai_prodi) {
      return res.status(404).json({
        message: `<===== Skala Nilai Prodi Kelas With ID ${SkalaNilaiProdiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Skala Nilai Prodi Kelas By ID ${SkalaNilaiProdiId} Success:`,
      data: skala_nilai_prodi,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSkalaNilaiProdi,
  getSkalaNilaiProdiById,
};
