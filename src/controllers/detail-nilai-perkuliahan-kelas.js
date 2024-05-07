const { DetailNilaiPerkuliahanKelas } = require("../../models");

const getAllDetailNilaiPerkuliahanKelas = async (req, res) => {
  try {
    // Ambil semua data detail_nilai_perkuliahan_kelas dari database
    const detail_nilai_perkuliahan_kelas = await DetailNilaiPerkuliahanKelas.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Nilai Perkuliahan Kelas Success",
      jumlahData: detail_nilai_perkuliahan_kelas.length,
      data: detail_nilai_perkuliahan_kelas,
    });
  } catch (error) {
    next(error);
  }
};

const getDetailNilaiPerkuliahanKelasById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const DetailNilaiPerkuliahanKelasId = req.params.id;

    // Cari data detail_nilai_perkuliahan_kelas berdasarkan ID di database
    const detail_nilai_perkuliahan_kelas = await DetailNilaiPerkuliahanKelas.findByPk(DetailNilaiPerkuliahanKelasId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!detail_nilai_perkuliahan_kelas) {
      return res.status(404).json({
        message: `<===== Detail Nilai Perkuliahan Kelas With ID ${DetailNilaiPerkuliahanKelasId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Detail Nilai Perkuliahan Kelas By ID ${DetailNilaiPerkuliahanKelasId} Success:`,
      data: detail_nilai_perkuliahan_kelas,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDetailNilaiPerkuliahanKelas,
  getDetailNilaiPerkuliahanKelasById,
};
