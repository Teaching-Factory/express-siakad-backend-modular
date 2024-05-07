const { DetailPerkuliahanMahasiswa } = require("../../models");

const getAllDetailPerkuliahanMahasiswa = async (req, res) => {
  try {
    // Ambil semua data detail_perkuliahan_mahasiswa dari database
    const detail_perkuliahan_mahasiswa = await DetailPerkuliahanMahasiswa.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Perkuliahan Mahasiswa Success",
      jumlahData: detail_perkuliahan_mahasiswa.length,
      data: detail_perkuliahan_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getDetailPerkuliahanMahasiswaById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const DetailPerkuliahanMahasiswaId = req.params.id;

    // Cari data detail_perkuliahan_mahasiswa berdasarkan ID di database
    const detail_perkuliahan_mahasiswa = await DetailPerkuliahanMahasiswa.findByPk(DetailPerkuliahanMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!detail_perkuliahan_mahasiswa) {
      return res.status(404).json({
        message: `<===== Detail Perkuliahan Mahasiswa With ID ${DetailPerkuliahanMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Detail Perkuliahan Mahasiswa By ID ${DetailPerkuliahanMahasiswaId} Success:`,
      data: detail_perkuliahan_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDetailPerkuliahanMahasiswa,
  getDetailPerkuliahanMahasiswaById,
};
