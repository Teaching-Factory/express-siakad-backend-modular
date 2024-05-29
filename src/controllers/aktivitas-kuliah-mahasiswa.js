const { AktivitasKuliahMahasiswa, Mahasiswa, Semester, Prodi, StatusMahasiswa } = require("../../models");

const getAllAktivitasKuliahMahasiswa = async (req, res) => {
  try {
    // Ambil semua data aktivitas_kuliah_mahasiswa dari database
    const aktivitas_kuliah_mahasiswa = await AktivitasKuliahMahasiswa.findAll({
      include: [{ model: Mahasiswa }, { model: Semester }, { model: Prodi }, { model: StatusMahasiswa }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Aktivitas Kuliah Mahasiswa Success",
      jumlahData: aktivitas_kuliah_mahasiswa.length,
      data: aktivitas_kuliah_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getAktivitasKuliahMahasiswaById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const AktivitasKuliahMahasiswaId = req.params.id;

    // Cari data aktivitas_kuliah_mahasiswa berdasarkan ID di database
    const aktivitas_kuliah_mahasiswa = await AktivitasKuliahMahasiswa.findByPk(AktivitasKuliahMahasiswaId, {
      include: [{ model: Mahasiswa }, { model: Semester }, { model: Prodi }, { model: StatusMahasiswa }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!aktivitas_kuliah_mahasiswa) {
      return res.status(404).json({
        message: `<===== Aktivitas Kuliah Mahasiswa With ID ${AktivitasKuliahMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Aktivitas Kuliah Mahasiswa By ID ${AktivitasKuliahMahasiswaId} Success:`,
      data: aktivitas_kuliah_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getAktivitasKuliahMahasiswaByMahasiswaId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const mahasiswaId = req.params.id_registrasi_mahasiswa;

    // Cari data aktivitas_kuliah_mahasiswa berdasarkan ID di database
    const aktivitasKuliahMahasiswa = await AktivitasKuliahMahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: mahasiswaId,
      },
      include: [{ model: Mahasiswa }, { model: Semester }, { model: Prodi }, { model: StatusMahasiswa }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!aktivitasKuliahMahasiswa || aktivitasKuliahMahasiswa.length === 0) {
      return res.status(404).json({
        message: `<===== Aktivitas Kuliah Mahasiswa With ID ${mahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Aktivitas Kuliah Mahasiswa By ID ${mahasiswaId} Success:`,
      jumlahData: aktivitasKuliahMahasiswa.length,
      data: aktivitasKuliahMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAktivitasKuliahMahasiswa,
  getAktivitasKuliahMahasiswaById,
  getAktivitasKuliahMahasiswaByMahasiswaId,
};
