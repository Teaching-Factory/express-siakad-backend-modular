const { RiwayatPendidikanMahasiswa, Mahasiswa, JenisPendaftaran, JalurMasuk, Semester, JenisKeluar, Prodi, Pembiayaan, BidangMinat, PerguruanTinggi } = require("../../models");

const getAllRiwayatPendidikanMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data riwayat_pendidikan_mahasiswa dari database
    const riwayat_pendidikan_mahasiswa = await RiwayatPendidikanMahasiswa.findAll({
      include: [
        { model: Mahasiswa },
        { model: JenisPendaftaran },
        { model: JalurMasuk },
        { model: Semester },
        { model: JenisKeluar }, // Ubah ini menjadi format yang benar
        { model: Prodi },
        { model: Pembiayaan },
        { model: BidangMinat },
        { model: PerguruanTinggi },
      ],
    });

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

const getRiwayatPendidikanMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const RiwayatPendidikanMahasiswaId = req.params.id;

    // Cari data riwayat_pendidikan_mahasiswa berdasarkan ID di database
    const riwayat_pendidikan_mahasiswa = await RiwayatPendidikanMahasiswa.findByPk(RiwayatPendidikanMahasiswaId, {
      include: [{ model: Mahasiswa }, { model: JenisPendaftaran }, { model: JalurMasuk }, { model: Semester }, { model: JenisKeluar }, { model: Prodi }, { model: Pembiayaan }, { model: BidangMinat }, { model: PerguruanTinggi }],
    });

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
