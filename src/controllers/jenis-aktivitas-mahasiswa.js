const { JenisAktivitasMahasiswa } = require("../../models");

const getAllJenisAktivitasMahasiswa = async (req, res) => {
  try {
    // Ambil semua data jenis_aktivitas_mahasiswa dari database
    const jenis_aktivitas_mahasiswa = await JenisAktivitasMahasiswa.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Jenis Aktivitas Mahasiswa Success",
      jumlahData: jenis_aktivitas_mahasiswa.length,
      data: jenis_aktivitas_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getJenisAktivitasMahasiswaById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const JenisAktivitasMahasiswaId = req.params.id;

    // Cari data jenis_aktivitas_mahasiswa berdasarkan ID di database
    const jenis_aktivitas_mahasiswa = await JenisAktivitasMahasiswa.findByPk(JenisAktivitasMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenis_aktivitas_mahasiswa) {
      return res.status(404).json({
        message: `<===== Jenis Aktivitas Mahasiswa With ID ${JenisAktivitasMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Jenis Aktivitas Mahasiswa By ID ${JenisAktivitasMahasiswaId} Success:`,
      data: jenis_aktivitas_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJenisAktivitasMahasiswa,
  getJenisAktivitasMahasiswaById,
};
