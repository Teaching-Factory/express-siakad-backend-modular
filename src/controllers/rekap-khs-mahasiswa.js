const { RekapKHSMahasiswa, Mahasiswa, Prodi, Periode, MataKuliah } = require("../../models");

const getAllRekapKHSMahasiswa = async (req, res) => {
  try {
    // Ambil semua data rekap_khs_mahasiswa dari database
    const rekap_khs_mahasiswa = await RekapKHSMahasiswa.findAll({ include: [{ model: Mahasiswa }, { model: Prodi }, { model: Periode }, { model: MataKuliah }] });

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
    const rekap_khs_mahasiswa = await RekapKHSMahasiswa.findByPk(RekapKHSMahasiswaId, {
      include: [{ model: Mahasiswa }, { model: Prodi }, { model: Periode }, { model: MataKuliah }],
    });

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

const getRekapKHSMahasiswaByMahasiswaId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const idRegistrasiMahasiswa = req.params.id_registrasi_mahasiswa;

    // Cari data rekap_khs_mahasiswa berdasarkan id_registrasi_mahasiswa di database
    const rekapKhsMahasiswaId = await RekapKHSMahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: idRegistrasiMahasiswa,
      },
      include: [{ model: Mahasiswa }, { model: Prodi }, { model: Periode }, { model: MataKuliah }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!rekapKhsMahasiswaId || rekapKhsMahasiswaId.length === 0) {
      return res.status(404).json({
        message: `<===== Rekap KHS Mahasiswa With ID ${idRegistrasiMahasiswa} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Rekap KHS Mahasiswa By ID ${idRegistrasiMahasiswa} Success:`,
      jumlahData: rekapKhsMahasiswaId.length,
      data: rekapKhsMahasiswaId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRekapKHSMahasiswa,
  getRekapKHSMahasiswaById,
  getRekapKHSMahasiswaByMahasiswaId,
};
