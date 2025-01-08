const { ProfilPT, PerguruanTinggi, Wilayah } = require("../../models");
const fs = require("fs"); // untuk menghapus file
const path = require("path");

const getAllProfilPT = async (req, res, next) => {
  try {
    // Ambil semua data profil_pt dari database
    const profil_pt = await ProfilPT.findAll({ include: [{ model: PerguruanTinggi }, { model: Wilayah }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Profil PT Success",
      jumlahData: profil_pt.length,
      data: profil_pt,
    });
  } catch (error) {
    next(error);
  }
};

const getProfilPTById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const profilPTId = req.params.id;

    // Periksa apakah ID disediakan
    if (!profilPTId) {
      return res.status(400).json({
        message: "Profil PT ID is required",
      });
    }

    // Cari data profil_pt berdasarkan ID di database
    const profil_pt = await ProfilPT.findByPk(profilPTId, {
      include: [{ model: PerguruanTinggi }, { model: Wilayah }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!profil_pt) {
      return res.status(404).json({
        message: `<===== Profil PT With ID ${profilPTId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Profil PT By ID ${profilPTId} Success:`,
      data: profil_pt,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfilPTById = async (req, res, next) => {
  // Ambil data untuk update dari body permintaan
  const {
    telepon,
    faximile,
    email,
    website,
    jalan,
    dusun,
    rt_rw,
    kelurahan,
    kode_pos,
    lintang_bujur,
    bank,
    unit_cabang,
    nomor_rekening,
    mbs,
    luas_tanah_milik,
    luas_tanah_bukan_milik,
    sk_pendirian,
    tanggal_sk_pendirian,
    id_status_milik,
    nama_status_milik,
    status_perguruan_tinggi,
    sk_izin_operasional,
    tanggal_izin_operasional,
    id_perguruan_tinggi,
    id_wilayah,
  } = req.body;

  // validasi
  if (!kelurahan) {
    return res.status(400).json({ message: "kelurahan is required" });
  }
  if (!mbs) {
    return res.status(400).json({ message: "mbs is required" });
  }
  if (!luas_tanah_milik) {
    return res.status(400).json({ message: "luas_tanah_milik is required" });
  }
  if (!luas_tanah_bukan_milik) {
    return res.status(400).json({ message: "luas_tanah_bukan_milik is required" });
  }
  if (!id_status_milik) {
    return res.status(400).json({ message: "id_status_milik is required" });
  }
  if (!status_perguruan_tinggi) {
    return res.status(400).json({ message: "status_perguruan_tinggi is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const profilPTId = req.params.id;

    // Temukan profil_pt yang akan diperbarui berdasarkan ID
    const profil_pt = await ProfilPT.findByPk(profilPTId);

    if (!profil_pt) {
      return res.status(404).json({ message: "Profil PT tidak ditemukan" });
    }

    // Update data profil_pt
    profil_pt.telepon = telepon || profil_pt.telepon;
    profil_pt.faximile = faximile || profil_pt.faximile;
    profil_pt.email = email || profil_pt.email;
    profil_pt.website = website || profil_pt.website;
    profil_pt.jalan = jalan || profil_pt.jalan;
    profil_pt.dusun = dusun || profil_pt.dusun;
    profil_pt.rt_rw = rt_rw || profil_pt.rt_rw;
    profil_pt.kelurahan = kelurahan || profil_pt.kelurahan;
    profil_pt.kode_pos = kode_pos || profil_pt.kode_pos;
    profil_pt.lintang_bujur = lintang_bujur || profil_pt.lintang_bujur;
    profil_pt.bank = bank || profil_pt.bank;
    profil_pt.unit_cabang = unit_cabang || profil_pt.unit_cabang;
    profil_pt.nomor_rekening = nomor_rekening || profil_pt.nomor_rekening;
    profil_pt.mbs = mbs || profil_pt.mbs;
    profil_pt.luas_tanah_milik = luas_tanah_milik || profil_pt.luas_tanah_milik;
    profil_pt.luas_tanah_bukan_milik = luas_tanah_bukan_milik || profil_pt.luas_tanah_bukan_milik;
    profil_pt.sk_pendirian = sk_pendirian || profil_pt.sk_pendirian;
    profil_pt.tanggal_sk_pendirian = tanggal_sk_pendirian || profil_pt.tanggal_sk_pendirian;
    profil_pt.id_status_milik = id_status_milik || profil_pt.id_status_milik;
    profil_pt.nama_status_milik = nama_status_milik || profil_pt.nama_status_milik;
    profil_pt.status_perguruan_tinggi = status_perguruan_tinggi || profil_pt.status_perguruan_tinggi;
    profil_pt.sk_izin_operasional = sk_izin_operasional || profil_pt.sk_izin_operasional;
    profil_pt.tanggal_izin_operasional = tanggal_izin_operasional || profil_pt.tanggal_izin_operasional;
    profil_pt.id_perguruan_tinggi = id_perguruan_tinggi || profil_pt.id_perguruan_tinggi;
    profil_pt.id_wilayah = id_wilayah || profil_pt.id_wilayah;

    await profil_pt.save();

    res.json({
      message: "UPDATE Profil PT Success",
      dataProfilPT: profil_pt,
    });
  } catch (error) {
    next(error);
  }
};

const getProfilPTActive = async (req, res, next) => {
  try {
    // Ambil semua data profil_pt dari database
    const profil_pt = await ProfilPT.findOne({
      where: {
        id_profil_pt: 1,
      },
      include: [{ model: PerguruanTinggi }, { model: Wilayah }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET Profil PT Active Success",
      data: profil_pt,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfilPTActive = async (req, res, next) => {
  // Ambil data untuk update dari body permintaan
  const { nama_perguruan_tinggi, jalan, telepon, email, kode_pos, faximile, website } = req.body;

  // validasi
  if (!nama_perguruan_tinggi) {
    return res.status(400).json({ message: "nama_perguruan_tinggi is required" });
  }
  if (!jalan) {
    return res.status(400).json({ message: "jalan is required" });
  }
  if (!telepon) {
    return res.status(400).json({ message: "telepon is required" });
  }
  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }
  if (!kode_pos) {
    return res.status(400).json({ message: "kode_pos is required" });
  }
  if (!faximile) {
    return res.status(400).json({ message: "faximile is required" });
  }
  if (!website) {
    return res.status(400).json({ message: "website is required" });
  }

  try {
    // Ambil semua data profil_pt dari database
    const profil_pt = await ProfilPT.findOne({
      where: {
        id_profil_pt: 1,
      },
    });

    const perguruan_tinggi = await PerguruanTinggi.findOne({
      where: {
        id_perguruan_tinggi: profil_pt.id_perguruan_tinggi,
      },
    });

    // update perguruan tinggi
    perguruan_tinggi.nama_perguruan_tinggi = nama_perguruan_tinggi || perguruan_tinggi.nama_perguruan_tinggi;

    await perguruan_tinggi.save();

    // update profil pt
    profil_pt.jalan = jalan || profil_pt.jalan;
    profil_pt.telepon = telepon || profil_pt.telepon;
    profil_pt.email = email || profil_pt.email;
    profil_pt.kode_pos = kode_pos || profil_pt.kode_pos;
    profil_pt.faximile = faximile || profil_pt.faximile;
    profil_pt.website = website || profil_pt.website;

    // update foto profil
    const oldFotoProfilPT = profil_pt.foto_profil_pt;

    // Jika ada file gambar baru di-upload, update path foto profil pt dan hapus gambar lama
    if (req.file) {
      // Cek tipe MIME file yang di-upload
      if (req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/png") {
        return res.status(400).json({ message: "File type not supported" });
      } else {
        const protocol = process.env.PROTOCOL || "http";
        const host = process.env.DB_HOST || "localhost";
        const port = process.env.PORT || 4000;

        const fileName = req.file.filename;
        const fileUrl = `${protocol}://${host}:${port}/src/storage/perguruan-tinggi/profil/${fileName}`;

        profil_pt.foto_profil_pt = fileUrl;

        // Hapus file gambar lama jika ada
        if (oldFotoProfilPT) {
          const oldFilePath = path.resolve(__dirname, `../storage/perguruan-tinggi/profil/${path.basename(oldFotoProfilPT)}`);
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error(`Gagal menghapus gambar: ${err.message}`);
            }
          });
        }
      }
    }

    await profil_pt.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== UPDATE Profil PT Active Success",
      data: profil_pt,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProfilPT,
  getProfilPTById,
  updateProfilPTById,
  getProfilPTActive,
  updateProfilPTActive,
};
