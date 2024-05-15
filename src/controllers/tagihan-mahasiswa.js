const { TagihanMahasiswa } = require("../../models");

const getAllTagihanMahasiswa = async (req, res) => {
  try {
    // Ambil semua data tagihan_mahasiswa dari database
    const tagihan_mahasiswa = await TagihanMahasiswa.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Tagihan Mahasiswa Success",
      jumlahData: tagihan_mahasiswa.length,
      data: tagihan_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getTagihanMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const tagihanMahasiswaId = req.params.id;

    // Cari data tagihan_mahasiswa berdasarkan ID di database
    const tagihan_mahasiswa = await TagihanMahasiswa.findByPk(tagihanMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!tagihan_mahasiswa) {
      return res.status(404).json({
        message: `<===== Tagihan Mahasiswa With ID ${tagihanMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Tagihan Mahasiswa By ID ${tagihanMahasiswaId} Success:`,
      data: tagihan_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const createTagihanMahasiswa = async (req, res, next) => {
  try {
    const { jumlah_tagihan, jenis_tagihan, tanggal_tagihan, deadline_tagihan, status_tagihan, id_periode, id_registrasi_mahasiswa } = req.body;

    // Gunakan metode create untuk membuat data tagihan_mahasiswa baru
    const newTagihanMahasiswa = await TagihanMahasiswa.create({ jumlah_tagihan, jenis_tagihan, tanggal_tagihan, deadline_tagihan, status_tagihan, id_periode, id_registrasi_mahasiswa });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Tagihan Mahasiswa Success",
      data: newTagihanMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const updateTagihanMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const tagihanMahasiswaId = req.params.id;

    // Ambil data untuk update dari body permintaan
    const { jumlah_tagihan, jenis_tagihan, tanggal_tagihan, deadline_tagihan, status_tagihan, id_periode, id_registrasi_mahasiswa } = req.body;

    // Temukan tagihan_mahasiswa yang akan diperbarui berdasarkan ID
    const tagihan_mahasiswa = await TagihanMahasiswa.findByPk(tagihanMahasiswaId);

    if (!tagihan_mahasiswa) {
      return res.status(404).json({ message: "Tagihan Mahasiswa tidak ditemukan" });
    }

    // Update data tagihan_mahasiswa
    tagihan_mahasiswa.jumlah_tagihan = jumlah_tagihan || tagihan_mahasiswa.jumlah_tagihan;
    tagihan_mahasiswa.jenis_tagihan = jenis_tagihan || tagihan_mahasiswa.jenis_tagihan;
    tagihan_mahasiswa.tanggal_tagihan = tanggal_tagihan || tagihan_mahasiswa.tanggal_tagihan;
    tagihan_mahasiswa.deadline_tagihan = deadline_tagihan || tagihan_mahasiswa.deadline_tagihan;
    tagihan_mahasiswa.status_tagihan = status_tagihan || tagihan_mahasiswa.status_tagihan;
    tagihan_mahasiswa.id_periode = id_periode || tagihan_mahasiswa.id_periode;
    tagihan_mahasiswa.id_registrasi_mahasiswa = id_registrasi_mahasiswa || tagihan_mahasiswa.id_registrasi_mahasiswa;

    await tagihan_mahasiswa.save();

    res.json({
      message: "UPDATE Tagihan Mahasiswa Success",
      dataTagihanMahasiswa: tagihan_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTagihanMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const tagihanMahasiswaId = req.params.id;

    // Cari data tagihan_mahasiswa berdasarkan ID di database
    let tagihan_mahasiswa = await TagihanMahasiswa.findByPk(tagihanMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!tagihan_mahasiswa) {
      return res.status(404).json({
        message: `<===== Tagihan Mahasiswa With ID ${tagihanMahasiswaId} Not Found:`,
      });
    }

    // Hapus data tagihan_mahasiswa dari database
    await tagihan_mahasiswa.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Tagihan Mahasiswa With ID ${tagihanMahasiswaId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTagihanMahasiswa,
  getTagihanMahasiswaById,
  createTagihanMahasiswa,
  updateTagihanMahasiswaById,
  deleteTagihanMahasiswaById,
};
