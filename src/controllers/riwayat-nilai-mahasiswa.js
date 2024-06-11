const { RiwayatNilaiMahasiswa, Mahasiswa, Periode, KelasKuliah } = require("../../models");

const getAllRiwayatNilaiMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data riwayat_nilai_mahasiswa dari database
    const riwayat_nilai_mahasiswa = await RiwayatNilaiMahasiswa.findAll({
      include: [{ model: Mahasiswa }, { model: Periode }, { model: KelasKuliah }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Riwayat Nilai Mahasiswa Success",
      jumlahData: riwayat_nilai_mahasiswa.length,
      data: riwayat_nilai_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getRiwayatNilaiMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const RiwayatNilaiMahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!RiwayatNilaiMahasiswaId) {
      return res.status(400).json({
        message: "Riwayat Nilai Mahasiswa ID is required",
      });
    }

    // Cari data riwayat_nilai_mahasiswa berdasarkan ID di database
    const riwayat_nilai_mahasiswa = await RiwayatNilaiMahasiswa.findByPk(RiwayatNilaiMahasiswaId, {
      include: [{ model: Mahasiswa }, { model: Periode }, { model: KelasKuliah }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!riwayat_nilai_mahasiswa) {
      return res.status(404).json({
        message: `<===== Riwayat Nilai Mahasiswa With ID ${RiwayatNilaiMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Riwayat Nilai Mahasiswa By ID ${RiwayatNilaiMahasiswaId} Success:`,
      data: riwayat_nilai_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRiwayatNilaiMahasiswa,
  getRiwayatNilaiMahasiswaById,
};
