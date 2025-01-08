const { UserGuidePMB } = require("../../models");
const fs = require("fs"); // untuk menghapus file
const path = require("path");

const getAllUserGuidePMB = async (req, res, next) => {
  try {
    // Ambil semua data user_guide_pmbs dari database
    const user_guide_pmbs = await UserGuidePMB.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All User Guide PMB Success",
      jumlahData: user_guide_pmbs.length,
      data: user_guide_pmbs,
    });
  } catch (error) {
    next(error);
  }
};

const getUserGuidePMBById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const userGuidePMBId = req.params.id;

    if (!userGuidePMBId) {
      return res.status(400).json({
        message: "User Guide PMB ID is required",
      });
    }

    // Cari data user_guide_pmb berdasarkan ID di database
    const user_guide_pmb = await UserGuidePMB.findByPk(userGuidePMBId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!user_guide_pmb) {
      return res.status(404).json({
        message: `<===== User Guide PMB With ID ${userGuidePMBId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET User Guide PMB By ID ${userGuidePMBId} Success:`,
      data: user_guide_pmb,
    });
  } catch (error) {
    next(error);
  }
};

const getUserGuidePMBAktif = async (req, res, next) => {
  try {
    // Ambil data user_guide_pmb_aktif dari database
    const user_guide_pmb_aktif = await UserGuidePMB.findOne({
      where: {
        status: true,
      },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!user_guide_pmb_aktif) {
      return res.status(404).json({
        message: `<===== User Guide PMB Aktif Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET User Guide PMB Aktif Success",
      jumlahData: user_guide_pmb_aktif.length,
      data: user_guide_pmb_aktif,
    });
  } catch (error) {
    next(error);
  }
};

const createUserGuidePMB = async (req, res, next) => {
  // Destrukturisasi data dari request body
  const { type, status } = req.body;

  if (!type) {
    return res.status(400).json({ message: "type is required" });
  }
  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }

  try {
    // Deklarasi variabel file
    let file = null;

    // Jika file di-upload, cek tipe MIME
    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "File type not supported" });
      } else {
        // Jika tipe file valid, bentuk URL file dan set ke variabel file
        const protocol = process.env.PROTOCOL || "http";
        const host = process.env.DB_HOST || "localhost";
        const port = process.env.PORT || 4000;

        const fileName = req.file.filename;
        const fileUrl = `${protocol}://${host}:${port}/src/storage/userguide-pmb/${fileName}`;
        file = fileUrl;
      }
    } else {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Buat data user guide pmb baru
    const newUserGuidePMB = await UserGuidePMB.create({
      type: type,
      file: file,
      status: status,
    });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE User Guide PMB Success =====>",
      data: newUserGuidePMB,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserGuidePMB = async (req, res, next) => {
  // Ambil data untuk update dari form-data
  const { type } = req.body;

  if (!type) {
    return res.status(400).json({ message: "type is required" });
  }

  console.log("Vaidasi lolos");

  try {
    // Temukan user guide pmb yang aktif
    const user_guide_pmb = await UserGuidePMB.findOne({
      where: {
        status: true,
      },
    });

    if (!user_guide_pmb) {
      return res.status(404).json({ message: "User Guide Aktif tidak ditemukan" });
    }

    console.log("Data user guide pmb ditemukan");

    // Simpan path file lama jika ada
    const originalFilePath = user_guide_pmb.file;

    // Update data user_guide_pmb
    user_guide_pmb.type = type || user_guide_pmb.type;

    // Jika ada file baru di-upload, update path file dan hapus file lama
    if (req.file) {
      // Cek tipe MIME file yang di-upload
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "File type not supported" });
      } else {
        const protocol = process.env.PROTOCOL || "http";
        const host = process.env.DB_HOST || "localhost";
        const port = process.env.PORT || 4000;

        const fileName = req.file.filename;
        const fileUrl = `${protocol}://${host}:${port}/src/storage/userguide-pmb/${fileName}`;

        user_guide_pmb.file = fileUrl;

        // Hapus file lama jika ada
        if (originalFilePath) {
          const oldFilePath = path.resolve(__dirname, `../storage/userguide-pmb/${path.basename(originalFilePath)}`);
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error(`Gagal menghapus file: ${err.message}`);
            }
          });
        }
      }
    }

    // Simpan perubahan user_guide_pmb
    await user_guide_pmb.save();

    res.json({
      message: "UPDATE User Guide PMB Success",
      data: user_guide_pmb,
    });
  } catch (error) {
    next(error);
  }
};

const getUserGuidePMBGuestAktif = async (req, res, next) => {
  try {
    // Ambil data user_guide_pmb_aktif dari database
    const user_guide_pmb_aktif = await UserGuidePMB.findOne({
      where: {
        status: true,
      },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!user_guide_pmb_aktif) {
      return res.status(404).json({
        message: `<===== User Guide PMB Aktif Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET User Guide PMB Aktif Success",
      jumlahData: user_guide_pmb_aktif.length,
      data: user_guide_pmb_aktif,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUserGuidePMB,
  getUserGuidePMBById,
  getUserGuidePMBAktif,
  createUserGuidePMB,
  updateUserGuidePMB,
  getUserGuidePMBGuestAktif,
};
