const { RekapKHSMahasiswa } = require("../../models");

const getAllRekapKHSMahasiswa = async (req, res) => {
  try {
    // Ambil semua data rekap_khs_mahasiswa dari database
    const rekap_khs_mahasiswa = await RekapKHSMahasiswa.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Rekap KHS Mahasiswa Success",
      jumlahData: rekap_khs_mahasiswa.length,
      data: rekap_khs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getRekapKHSMahasiswaById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const RekapKHSMahasiswaId = req.params.id;

    // Cari data rekap_khs_mahasiswa berdasarkan ID di database
    const rekap_khs_mahasiswa = await RekapKHSMahasiswa.findByPk(RekapKHSMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!rekap_khs_mahasiswa) {
      return res.status(404).json({
        message: `<===== Rekap KHS Mahasiswa With ID ${RekapKHSMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Rekap KHS Mahasiswa By ID ${RekapKHSMahasiswaId} Success:`,
      data: rekap_khs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRekapKHSMahasiswa,
  getRekapKHSMahasiswaById,
};
