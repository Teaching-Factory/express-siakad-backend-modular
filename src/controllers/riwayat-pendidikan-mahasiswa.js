const { RiwayatPendidikanMahasiswa } = require("../../models");

const getAllRiwayatPendidikanMahasiswa = async (req, res) => {
  try {
    // Ambil semua data riwayat_pendidikan_mahasiswa dari database
    const riwayat_pendidikan_mahasiswa = await RiwayatPendidikanMahasiswa.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Riwayat Pendidikan Mahasiswa Success",
      jumlahData: riwayat_pendidikan_mahasiswa.length,
      data: riwayat_pendidikan_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getRiwayatPendidikanMahasiswaById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const RiwayatPendidikanMahasiswaId = req.params.id;

    // Cari data riwayat_pendidikan_mahasiswa berdasarkan ID di database
    const riwayat_pendidikan_mahasiswa = await RiwayatPendidikanMahasiswa.findByPk(RiwayatPendidikanMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!riwayat_pendidikan_mahasiswa) {
      return res.status(404).json({
        message: `<===== Riwayat Pendidikan Mahasiswa With ID ${RiwayatPendidikanMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Riwayat Pendidikan Mahasiswa By ID ${RiwayatPendidikanMahasiswaId} Success:`,
      data: riwayat_pendidikan_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRiwayatPendidikanMahasiswa,
  getRiwayatPendidikanMahasiswaById,
};
