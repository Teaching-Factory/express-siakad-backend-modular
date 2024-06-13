const { RekapKRSMahasiswa, Prodi, Periode, Mahasiswa, MataKuliah, Semester } = require("../../models");

const getAllRekapKRSMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data rekap_krs_mahasiswa dari database
    const rekap_krs_mahasiswa = await RekapKRSMahasiswa.findAll({ include: [{ model: Prodi }, { model: Periode }, { model: Mahasiswa }, { model: MataKuliah }, { model: Semester }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Rekap KRS Mahasiswa Success",
      jumlahData: rekap_krs_mahasiswa.length,
      data: rekap_krs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getRekapKRSMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const RekapKRSMahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!RekapKRSMahasiswaId) {
      return res.status(400).json({
        message: "Rekap KRS Mahasiswa ID is required",
      });
    }

    // Cari data rekap_krs_mahasiswa berdasarkan ID di database
    const rekap_krs_mahasiswa = await RekapKRSMahasiswa.findByPk(RekapKRSMahasiswaId, {
      include: [{ model: Prodi }, { model: Periode }, { model: Mahasiswa }, { model: MataKuliah }, { model: Semester }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!rekap_krs_mahasiswa) {
      return res.status(404).json({
        message: `<===== Rekap KRS Mahasiswa With ID ${RekapKRSMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Rekap KRS Mahasiswa By ID ${RekapKRSMahasiswaId} Success:`,
      data: rekap_krs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRekapKRSMahasiswa,
  getRekapKRSMahasiswaById,
};
