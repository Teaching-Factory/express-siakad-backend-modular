const { TranskripMahasiswa } = require("../../models");

const getAllTranskripMahasiswa = async (req, res) => {
  try {
    // Ambil semua data transkrip_mahasiswa dari database
    const transkrip_mahasiswa = await TranskripMahasiswa.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Transkrip Mahasiswa Success",
      jumlahData: transkrip_mahasiswa.length,
      data: transkrip_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getTranskripMahasiswaById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const TranskripMahasiswaId = req.params.id;

    // Cari data transkrip_mahasiswa berdasarkan ID di database
    const transkrip_mahasiswa = await TranskripMahasiswa.findByPk(TranskripMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!transkrip_mahasiswa) {
      return res.status(404).json({
        message: `<===== Transkrip Mahasiswa With ID ${TranskripMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Transkrip Mahasiswa By ID ${TranskripMahasiswaId} Success:`,
      data: transkrip_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTranskripMahasiswa,
  getTranskripMahasiswaById,
};
