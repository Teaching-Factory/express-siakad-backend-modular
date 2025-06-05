const { AnggotaAktivitasMahasiswa, AktivitasMahasiswa, Mahasiswa, Periode, Prodi, Semester, JenisAktivitasMahasiswa } = require("../../../models");

const getAllAnggotaAktivitasMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data anggota_aktivitas_mahasiswa dari database
    const anggota_aktivitas_mahasiswa = await AnggotaAktivitasMahasiswa.findAll({ include: [{ model: AktivitasMahasiswa }, { model: Mahasiswa, include: [{ model: Prodi }] }] });

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

const getAnggotaAktivitasMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const AnggotaAktivitasMahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!AnggotaAktivitasMahasiswaId) {
      return res.status(400).json({
        message: "Anggota Aktivitas Mahasiswa ID is required",
      });
    }

    // Cari data anggota_aktivitas_mahasiswa berdasarkan ID di database
    const anggota_aktivitas_mahasiswa = await AnggotaAktivitasMahasiswa.findByPk(AnggotaAktivitasMahasiswaId, {
      include: [{ model: AktivitasMahasiswa }, { model: Mahasiswa, include: [{ model: Prodi }] }],
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

const getAnggotaAktivitasMahasiswaByAktivitasId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const aktivitasId = req.params.id_aktivitas;

    // Periksa apakah ID disediakan
    if (!aktivitasId) {
      return res.status(400).json({
        message: "Aktivitas ID is required",
      });
    }

    // Cari data anggota_aktivitas_mahasiswa berdasarkan ID di database
    const anggota_aktivitas_mahasiswa = await AnggotaAktivitasMahasiswa.findAll({
      where: {
        id_aktivitas: aktivitasId,
      },
      include: [{ model: AktivitasMahasiswa }, { model: Mahasiswa, include: [{ model: Prodi }] }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (anggota_aktivitas_mahasiswa.length === 0) {
      return res.status(404).json({
        message: `<===== Anggota Aktivitas Mahasiswa With ID ${aktivitasId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Anggota Aktivitas Mahasiswa By Aktivitas ID ${aktivitasId} Success:`,
      jumlahData: anggota_aktivitas_mahasiswa.length,
      data: anggota_aktivitas_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getAnggotaAktivitasMahasiswaBySemesterProdiAndJenisAktivitasId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;
    const prodiId = req.params.id_prodi;
    const jenisAktivitasId = req.params.id_jenis_aktivitas;

    // Periksa apakah ID disediakan
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }
    if (!jenisAktivitasId) {
      return res.status(400).json({
        message: "Jenis Aktivitas ID is required",
      });
    }

    // Ambil semua data anggota_aktivitas_mahasiswa dari database
    const anggota_aktivitas_mahasiswa = await AnggotaAktivitasMahasiswa.findAll({
      include: [
        {
          model: AktivitasMahasiswa,
          where: {
            id_semester: semesterId,
            id_prodi: prodiId,
            id_jenis_aktivitas: jenisAktivitasId,
          },
        },
        { model: Mahasiswa, include: [{ model: Prodi }] },
        { model: AktivitasMahasiswa, include: [{ model: Prodi }, { model: Semester }, { model: JenisAktivitasMahasiswa }] },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Anggota Aktivitas Mahasiswa By Semester ID ${semesterId}, Prodi ID ${prodiId} And Jenis Aktivitas ID ${jenisAktivitasId} Success`,
      jumlahData: anggota_aktivitas_mahasiswa.length,
      data: anggota_aktivitas_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const createAnggotaAktivitasMahasiswa = async (req, res, next) => {
  const { id_registrasi_mahasiswa, jenis_peran } = req.body;

  if (!id_registrasi_mahasiswa) {
    return res.status(400).json({ message: "id_registrasi_mahasiswa is required" });
  }
  if (!jenis_peran) {
    return res.status(400).json({ message: "jenis_peran is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const aktivitasId = req.params.id_aktivitas;

    // Periksa apakah ID disediakan
    if (!aktivitasId) {
      return res.status(400).json({
        message: "Aktivitas ID is required",
      });
    }

    // Tentukan nama_jenis_peran berdasarkan nilai jenis_peran
    const nama_jenis_peran = jenis_peran == "3" ? "Personal" : "Anggota";

    // Gunakan metode create untuk membuat data AnggotaAktivitasMahasiswa baru
    const newAnggotaAktivitasMahasiswa = await AnggotaAktivitasMahasiswa.create({
      jenis_peran: jenis_peran,
      nama_jenis_peran: nama_jenis_peran,
      id_aktivitas: aktivitasId,
      id_registrasi_mahasiswa: id_registrasi_mahasiswa,
    });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Anggota Aktivitas Mahasiswa Success",
      data: newAnggotaAktivitasMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAnggotaAktivitasMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const anggotaAktivitasMahasiswaId = req.params.id;

    if (!anggotaAktivitasMahasiswaId) {
      return res.status(400).json({
        message: "Anggota Aktvitas Mahasiswa ID is required",
      });
    }

    // Periksa apakah ID disediakan
    if (!anggotaAktivitasMahasiswaId) {
      return res.status(400).json({
        message: "Anggota Aktivitas Mahasiswa ID is required",
      });
    }

    // Cari data anggota_aktivitas_mahasiswa berdasarkan ID di database
    let anggota_aktivitas_mahasiswa = await AnggotaAktivitasMahasiswa.findByPk(anggotaAktivitasMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!anggota_aktivitas_mahasiswa) {
      return res.status(404).json({
        message: `<===== Anggota Aktivitas Mahasiswa With ID ${anggotaAktivitasMahasiswaId} Not Found:`,
      });
    }

    // Hapus data anggota_aktivitas_mahasiswa dari database
    await anggota_aktivitas_mahasiswa.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Anggota Aktivitas Mahasiswa With ID ${anggotaAktivitasMahasiswaId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAnggotaAktivitasMahasiswa,
  getAnggotaAktivitasMahasiswaById,
  getAnggotaAktivitasMahasiswaByAktivitasId,
  getAnggotaAktivitasMahasiswaBySemesterProdiAndJenisAktivitasId,
  createAnggotaAktivitasMahasiswa,
  deleteAnggotaAktivitasMahasiswaById,
};
