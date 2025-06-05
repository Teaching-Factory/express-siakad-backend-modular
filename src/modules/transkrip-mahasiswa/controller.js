const { TranskripMahasiswa, Mahasiswa, MataKuliah, KelasKuliah, KonversiKampusMerdeka } = require("../../../models");

// overload data
const getAllTranskripMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data transkrip_mahasiswa dari database
    const transkrip_mahasiswa = await TranskripMahasiswa.findAll({ include: [{ model: Mahasiswa }, { model: MataKuliah }, { model: KelasKuliah }, { model: KonversiKampusMerdeka }] });

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

const getTranskripMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const TranskripMahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!TranskripMahasiswaId) {
      return res.status(400).json({
        message: "Transkrip Mahasiswa ID is required",
      });
    }

    // Cari data transkrip_mahasiswa berdasarkan ID di database
    const transkrip_mahasiswa = await TranskripMahasiswa.findByPk(TranskripMahasiswaId, {
      include: [{ model: Mahasiswa }, { model: MataKuliah }, { model: KelasKuliah }, { model: KonversiKampusMerdeka }],
    });

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
