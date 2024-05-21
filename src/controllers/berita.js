const { Berita } = require("../../models");
const fs = require("fs"); // untuk menghapus file
const path = require("path");

const getAllBerita = async (req, res, next) => {
  try {
    // Ambil semua data beritas dari database
    const beritas = await Berita.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Berita Success",
      jumlahData: beritas.length,
      data: beritas,
    });
  } catch (error) {
    next(error);
  }
};

const getBeritaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const beritaId = req.params.id;

    // Cari data berita berdasarkan ID di database
    const berita = await Berita.findByPk(beritaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!berita) {
      return res.status(404).json({
        message: `<===== Berita With ID ${beritaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Berita By ID ${beritaId} Success:`,
      data: berita,
    });
  } catch (error) {
    next(error);
  }
};

const createBerita = async (req, res, next) => {
  try {
    // Destrukturisasi data dari request body
    const { judul_berita, deskripsi_pendek, kategori_berita, share_public, konten_berita } = req.body;

    // Deklarasi variabel thumbnail
    let thumbnail = null;

    // Jika file di-upload, set path file ke variabel thumbnail
    if (req.file) {
      thumbnail = req.file.path; // Path file yang di-upload
    }

    // Buat data berita baru
    const newBerita = await Berita.create({
      judul_berita: judul_berita,
      deskripsi_pendek: deskripsi_pendek,
      kategori_berita: kategori_berita,
      share_public: share_public,
      thumbnail: thumbnail,
      konten_berita: konten_berita,
    });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Berita Success =====>",
      data: newBerita,
    });
  } catch (error) {
    next(error);
  }
};

const updateBeritaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const beritaId = req.params.id;

    // Ambil data untuk update dari form-data
    const { judul_berita, deskripsi_pendek, kategori_berita, share_public, konten_berita } = req.body;

    // Temukan berita yang akan diperbarui berdasarkan ID
    const berita = await Berita.findByPk(beritaId);

    if (!berita) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    // Simpan path gambar lama jika ada
    const oldThumbnailPath = berita.thumbnail;

    // Update data berita
    berita.judul_berita = judul_berita || berita.judul_berita;
    berita.deskripsi_pendek = deskripsi_pendek || berita.deskripsi_pendek;
    berita.kategori_berita = kategori_berita || berita.kategori_berita;
    berita.share_public = share_public || berita.share_public;
    berita.konten_berita = konten_berita || berita.konten_berita;

    // Jika ada file gambar baru di-upload, update path thumbnail dan hapus gambar lama
    if (req.file) {
      berita.thumbnail = req.file.path;

      // Hapus file gambar lama jika ada
      if (oldThumbnailPath) {
        fs.unlink(path.resolve(oldThumbnailPath), (err) => {
          if (err) {
            console.error(`Gagal menghapus gambar: ${err.message}`);
          }
        });
      }
    }

    // Simpan perubahan berita
    await berita.save();

    res.json({
      message: "UPDATE Berita Success",
      dataBerita: berita,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBeritaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const beritaId = req.params.id;

    // Cari data berita berdasarkan ID di database
    let berita = await Berita.findByPk(beritaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!berita) {
      return res.status(404).json({
        message: `<===== Berita With ID ${beritaId} Not Found:`,
      });
    }

    // Hapus foto yang telah disimpan
    if (berita.thumbnail) {
      fs.unlinkSync(berita.thumbnail); // Hapus foto dari sistem file
    }

    // Hapus data berita dari database
    await berita.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Berita With ID ${beritaId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBeritaAktif = async (req, res, next) => {
  try {
    // Ambil semua data beritas dari database
    const beritas = await Berita.findAll({
      where: {
        share_public: true,
      },
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Berita Aktif Success",
      jumlahData: beritas.length,
      data: beritas,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBerita,
  getBeritaById,
  createBerita,
  updateBeritaById,
  deleteBeritaById,
  getAllBeritaAktif,
};
