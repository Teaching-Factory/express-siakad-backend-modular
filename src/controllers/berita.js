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

    if (!beritaId) {
      return res.status(400).json({
        message: "Berita ID is required",
      });
    }

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
  // Destrukturisasi data dari request body
  const { judul_berita, deskripsi_pendek, kategori_berita, share_public, konten_berita } = req.body;

  if (!judul_berita) {
    return res.status(400).json({ message: "judul_berita is required" });
  }
  if (!deskripsi_pendek) {
    return res.status(400).json({ message: "deskripsi_pendek is required" });
  }
  if (!kategori_berita) {
    return res.status(400).json({ message: "kategori_berita is required" });
  }
  if (!share_public) {
    return res.status(400).json({ message: "share_public is required" });
  }
  if (!konten_berita) {
    return res.status(400).json({ message: "konten_berita is required" });
  }

  try {
    // Deklarasi variabel thumbnail
    let thumbnail = null;

    // Jika file di-upload, cek tipe MIME
    if (req.file) {
      if (req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/png") {
        return res.status(400).json({ message: "File type not supported" });
      } else {
        // Jika tipe file valid, bentuk URL file dan set ke variabel thumbnail
        const protocol = process.env.PROTOCOL || "http";
        const host = process.env.DB_HOST || "localhost";
        const port = process.env.PORT || 4000;

        const fileName = req.file.filename;
        const fileUrl = `${protocol}://${host}:${port}/src/storage/berita/${fileName}`;
        thumbnail = fileUrl;
      }
    } else {
      return res.status(400).json({ message: "No file uploaded" });
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
  // Ambil data untuk update dari form-data
  const { judul_berita, deskripsi_pendek, kategori_berita, share_public, konten_berita } = req.body;

  if (!judul_berita) {
    return res.status(400).json({ message: "judul_berita is required" });
  }
  if (!deskripsi_pendek) {
    return res.status(400).json({ message: "deskripsi_pendek is required" });
  }
  if (!kategori_berita) {
    return res.status(400).json({ message: "kategori_berita is required" });
  }
  if (!share_public) {
    return res.status(400).json({ message: "share_public is required" });
  }
  if (!konten_berita) {
    return res.status(400).json({ message: "konten_berita is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const beritaId = req.params.id;

    if (!beritaId) {
      return res.status(400).json({
        message: "Berita ID is required",
      });
    }

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
      // Cek tipe MIME file yang di-upload
      if (req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/png") {
        return res.status(400).json({ message: "File type not supported" });
      } else {
        const protocol = process.env.PROTOCOL || "http";
        const host = process.env.DB_HOST || "localhost";
        const port = process.env.PORT || 4000;

        const fileName = req.file.filename;
        const fileUrl = `${protocol}://${host}:${port}/src/storage/berita/${fileName}`;

        berita.thumbnail = fileUrl;

        // Hapus file gambar lama jika ada
        if (oldThumbnailPath) {
          const oldFilePath = path.resolve(__dirname, `../storage/berita/${path.basename(oldThumbnailPath)}`);
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error(`Gagal menghapus gambar: ${err.message}`);
            }
          });
        }
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

    if (!beritaId) {
      return res.status(400).json({
        message: "Berita ID is required",
      });
    }

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
      const fileUrl = berita.thumbnail;
      const fileName = path.basename(fileUrl);
      const filePath = path.resolve(__dirname, `../storage/berita/${fileName}`);

      // Hapus foto dari sistem file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Gagal menghapus gambar: ${err.message}`);
        }
      });
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
