const { AnggotaAktivitasMahasiswa, AktivitasMahasiswa, Mahasiswa } = require("../../models");

const getAllAnggotaAktivitasMahasiswa = async (req, res) => {
  try {
    // Ambil semua data anggota_aktivitas_mahasiswa dari database
    const anggota_aktivitas_mahasiswa = await AnggotaAktivitasMahasiswa.findAll({ include: [{ model: AktivitasMahasiswa }, { model: Mahasiswa }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Anggota Aktivitas Mahasiswa Success",
      jumlahData: anggota_aktivitas_mahasiswa.length,
      data: anggota_aktivitas_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getAnggotaAktivitasMahasiswaById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const AnggotaAktivitasMahasiswaId = req.params.id;

    // Cari data anggota_aktivitas_mahasiswa berdasarkan ID di database
    const anggota_aktivitas_mahasiswa = await AnggotaAktivitasMahasiswa.findByPk(AnggotaAktivitasMahasiswaId, {
      include: [{ model: AktivitasMahasiswa }, { model: Mahasiswa }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!anggota_aktivitas_mahasiswa) {
      return res.status(404).json({
        message: `<===== Anggota Aktivitas Mahasiswa With ID ${AnggotaAktivitasMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Anggota Aktivitas Mahasiswa By ID ${AnggotaAktivitasMahasiswaId} Success:`,
      data: anggota_aktivitas_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAnggotaAktivitasMahasiswa,
  getAnggotaAktivitasMahasiswaById,
};
