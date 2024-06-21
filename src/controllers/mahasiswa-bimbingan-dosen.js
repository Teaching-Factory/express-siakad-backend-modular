const { MahasiswaBimbinganDosen, KategoriKegiatan, Dosen, AktivitasMahasiswa } = require("../../models");

const getMahasiswaBimbinganDosenByAktivitasId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const aktivitasId = req.params.id_aktivitas;

    if (!aktivitasId) {
      return res.status(400).json({
        message: "Aktivitas Mahasiswa ID is required",
      });
    }

    // Cari data mahasiswa_bimbingan_dosen berdasarkan ID di database
    const mahasiswa_bimbingan_dosen = await MahasiswaBimbinganDosen.findAll({
      where: {
        id_aktivitas: aktivitasId,
      },
      include: [{ model: AktivitasMahasiswa }, { model: KategoriKegiatan }, { model: Dosen }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!mahasiswa_bimbingan_dosen) {
      return res.status(404).json({
        message: `<===== Mahasiswa Bimbingan Dosen With ID ${aktivitasId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Mahasiswa Bimbingan Dosen By Aktivitas ID ${aktivitasId} Success:`,
      jumlahData: mahasiswa_bimbingan_dosen.length,
      data: mahasiswa_bimbingan_dosen,
    });
  } catch (error) {
    next(error);
  }
};

const createMahasiswaBimbinganDosen = async (req, res, next) => {
  const { pembimbing_ke, id_kategori_kegiatan, id_dosen } = req.body;

  if (!pembimbing_ke) {
    return res.status(400).json({ message: "pembimbing_ke is required" });
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

    // Gunakan metode create untuk membuat data MahasiswaBimbinganDosen baru
    const newMahasiswaBimbinganDosen = await MahasiswaBimbinganDosen.create({
      pembimbing_ke: pembimbing_ke,
      id_aktivitas: aktivitasId,
      id_kategori_kegiatan: id_kategori_kegiatan,
      id_dosen: id_dosen,
    });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Mahasiswa Bimbingan Dosen Success",
      data: newMahasiswaBimbinganDosen,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMahasiswaBimbinganDosenById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const MahasiswaBimbinganDosenId = req.params.id;

    if (!MahasiswaBimbinganDosenId) {
      return res.status(400).json({
        message: "Mahasiswa Bimbingan Dosen ID is required",
      });
    }

    // Cari data mahasiswa_bimbingan_dosen berdasarkan ID di database
    let mahasiswa_bimbingan_dosen = await MahasiswaBimbinganDosen.findByPk(MahasiswaBimbinganDosenId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!mahasiswa_bimbingan_dosen) {
      return res.status(404).json({
        message: `<===== Mahasiswa Bimbingan Dosen With ID ${MahasiswaBimbinganDosenId} Not Found:`,
      });
    }

    // Hapus data mahasiswa_bimbingan_dosen dari database
    await mahasiswa_bimbingan_dosen.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Mahasiswa Bimbingan Dosen With ID ${MahasiswaBimbinganDosenId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMahasiswaBimbinganDosenByAktivitasId,
  createMahasiswaBimbinganDosen,
  deleteMahasiswaBimbinganDosenById,
};
