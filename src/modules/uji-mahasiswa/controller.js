const { UjiMahasiswa, KategoriKegiatan, Dosen, AktivitasMahasiswa } = require("../../../models");

const getUjiMahasiswaByAktivitasId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const aktivitasId = req.params.id_aktivitas;

    if (!aktivitasId) {
      return res.status(400).json({
        message: "Aktivitas Mahasiswa ID is required",
      });
    }

    // Cari data uji_mahasiswa berdasarkan ID di database
    const uji_mahasiswa = await UjiMahasiswa.findAll({
      where: {
        id_aktivitas: aktivitasId,
      },
      include: [{ model: AktivitasMahasiswa }, { model: KategoriKegiatan }, { model: Dosen }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Uji Mahasiswa By Aktivitas ID ${aktivitasId} Success:`,
      jumlahData: uji_mahasiswa.length,
      data: uji_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const createUjiMahasiswa = async (req, res, next) => {
  const { penguji_ke, id_kategori_kegiatan, id_dosen } = req.body;

  if (!penguji_ke) {
    return res.status(400).json({ message: "penguji_ke is required" });
  }
  if (!id_kategori_kegiatan) {
    return res.status(400).json({ message: "id_kategori_kegiatan is required" });
  }
  if (!id_dosen) {
    return res.status(400).json({ message: "id_dosen is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const aktivitasId = req.params.id_aktivitas;

    if (!aktivitasId) {
      return res.status(400).json({
        message: "Aktivitas Mahasiswa ID is required",
      });
    }

    // Gunakan metode create untuk membuat data UjiMahasiswa baru
    const newUjiMahasiswa = await UjiMahasiswa.create({
      penguji_ke: penguji_ke,
      id_aktivitas: aktivitasId,
      id_kategori_kegiatan: id_kategori_kegiatan,
      id_dosen: id_dosen,
    });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Uji Mahasiswa Success",
      data: newUjiMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUjiMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const UjiMahasiswaId = req.params.id;

    if (!UjiMahasiswaId) {
      return res.status(400).json({
        message: "Uji Mahasiswa ID is required",
      });
    }

    // Cari data uji_mahasiswa berdasarkan ID di database
    let uji_mahasiswa = await UjiMahasiswa.findByPk(UjiMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!uji_mahasiswa) {
      return res.status(404).json({
        message: `<===== Uji Mahasiswa With ID ${UjiMahasiswaId} Not Found:`,
      });
    }

    // Hapus data uji_mahasiswa dari database
    await uji_mahasiswa.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Uji Mahasiswa With ID ${UjiMahasiswaId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUjiMahasiswaByAktivitasId,
  createUjiMahasiswa,
  deleteUjiMahasiswaById,
};
