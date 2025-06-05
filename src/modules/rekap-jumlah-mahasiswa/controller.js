const { RekapJumlahMahasiswa, Periode, Prodi } = require("../../../models");

const getAllRekapJumlahMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data rekap_jumlah_mahasiswa dari database
    const rekap_jumlah_mahasiswa = await RekapJumlahMahasiswa.findAll({ include: [{ model: Periode }, { model: Prodi }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Rekap Jumlah Mahasiswa Success",
      jumlahData: rekap_jumlah_mahasiswa.length,
      data: rekap_jumlah_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getRekapJumlahMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const RekapJumlahMahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!RekapJumlahMahasiswaId) {
      return res.status(400).json({
        message: "Rekap Jumlah Mahasiswa ID is required",
      });
    }

    // Cari data rekap_jumlah_mahasiswa berdasarkan ID di database
    const rekap_jumlah_mahasiswa = await RekapJumlahMahasiswa.findByPk(RekapJumlahMahasiswaId, {
      include: [{ model: Periode }, { model: Prodi }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!rekap_jumlah_mahasiswa) {
      return res.status(404).json({
        message: `<===== Rekap Jumlah Mahasiswa With ID ${RekapJumlahMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Rekap Jumlah Mahasiswa By ID ${RekapJumlahMahasiswaId} Success:`,
      data: rekap_jumlah_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRekapJumlahMahasiswa,
  getRekapJumlahMahasiswaById,
};
