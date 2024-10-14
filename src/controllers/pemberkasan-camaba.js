const { PemberkasanCamaba, BerkasPeriodePendaftaran, Camaba, Role, UserRole, JenisBerkas } = require("../../models");
const fs = require("fs"); // untuk menghapus file
const path = require("path");

const getAllPemberkasanCamaba = async (req, res, next) => {
  try {
    // Ambil semua data pemberkasan_camabas dari database
    const pemberkasan_camabas = await PemberkasanCamaba.findAll({
      include: [{ model: BerkasPeriodePendaftaran, include: [{ model: JenisBerkas, as: "JenisBerkas" }] }, { model: Camaba }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Pemberkasan Camaba Success",
      jumlahData: pemberkasan_camabas.length,
      data: pemberkasan_camabas,
    });
  } catch (error) {
    next(error);
  }
};

const getPemberkasanCamabaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const pemberkasanCamabaId = req.params.id;

    if (!pemberkasanCamabaId) {
      return res.status(400).json({
        message: "Pemberkasan Camaba ID is required",
      });
    }

    // Cari data pemberkasan_camaba berdasarkan ID di database
    const pemberkasan_camaba = await PemberkasanCamaba.findByPk(pemberkasanCamabaId, {
      include: [{ model: BerkasPeriodePendaftaran, include: [{ model: JenisBerkas, as: "JenisBerkas" }] }, { model: Camaba }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!pemberkasan_camaba) {
      return res.status(404).json({
        message: `<===== Pemberkasan Camaba With ID ${pemberkasanCamabaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Pemberkasan Camaba By ID ${pemberkasanCamabaId} Success:`,
      data: pemberkasan_camaba,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPemberkasanCamabaByCamabaActive = async (req, res, next) => {
  try {
    const user = req.user;

    // get role user active
    const roleCamaba = await Role.findOne({
      where: { nama_role: "camaba" },
    });

    if (!roleCamaba) {
      return res.status(404).json({
        message: "Role Camaba not found",
      });
    }

    // mengecek apakah user saat ini memiliki role camaba
    const userRole = await UserRole.findOne({
      where: { id_user: user.id, id_role: roleCamaba.id },
    });

    if (!userRole) {
      return res.status(404).json({
        message: "User is not Camaba",
      });
    }

    // get data camaba aktif
    const camaba = await Camaba.findOne({
      where: { nomor_daftar: user.username },
    });

    // Cari data pemberkasan_camaba berdasarkan camaba yang aktif
    const pemberkasan_camaba = await PemberkasanCamaba.findAll({
      where: { id_camaba: camaba.id },
      include: [{ model: BerkasPeriodePendaftaran, include: [{ model: JenisBerkas, as: "JenisBerkas" }] }, { model: Camaba }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!pemberkasan_camaba) {
      return res.status(404).json({
        message: `<===== Pemberkasan Camaba By Camaba Active Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Pemberkasan Camaba By Camaba Active Success:`,
      jumlahData: pemberkasan_camaba.length,
      data: pemberkasan_camaba,
    });
  } catch (error) {
    next(error);
  }
};

const updatePemberkasanCamabaActiveById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const pemberkasanCamabaId = req.params.id;

    if (!pemberkasanCamabaId) {
      return res.status(400).json({
        message: "Pemberkasan Camaba ID is required",
      });
    }

    // Mengecek apakah user yang sedang aktif merupakan camaba
    const user = req.user;

    // Get role user active
    const roleCamaba = await Role.findOne({
      where: { nama_role: "camaba" },
    });

    if (!roleCamaba) {
      return res.status(404).json({
        message: "Role Camaba not found",
      });
    }

    // Get data camaba
    const camaba = await Camaba.findOne({
      where: { nomor_daftar: user.username },
    });

    if (!camaba) {
      return res.status(404).json({
        message: "Camaba not found",
      });
    }

    // Get data pemberkasan camaba
    const pemberkasan_camaba = await PemberkasanCamaba.findOne({
      where: {
        id: pemberkasanCamabaId,
        id_camaba: camaba.id,
      },
    });

    if (!pemberkasan_camaba) {
      return res.status(404).json({
        message: "Pemberkasan Camaba not found",
      });
    }

    // Simpan path file lama jika ada
    const oldFileBerkasPath = pemberkasan_camaba.file_berkas;

    // Jika ada file berkas baru di-upload
    if (req.file) {
      const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];

      // Cek tipe MIME file yang di-upload
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "File type not supported. Only .jpeg, .jpg, .png, and .pdf files are allowed!" });
      }

      // Generate URL untuk file yang di-upload
      const protocol = process.env.PROTOCOL || "http";
      const host = process.env.HOST || "localhost";
      const port = process.env.PORT || 4000;

      const fileName = req.file.filename;
      const fileUrl = `${protocol}://${host}:${port}/src/storage/camaba/pemberkasan/${fileName}`;

      // Update file_berkas dengan file yang baru di-upload
      pemberkasan_camaba.file_berkas = fileUrl;

      // Hapus file lama jika ada
      if (oldFileBerkasPath) {
        const oldFilePath = path.resolve(__dirname, `../storage/camaba/pemberkasan/${path.basename(oldFileBerkasPath)}`);
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error(`Gagal menghapus file berkas lama: ${err.message}`);
          }
        });
      }
    }

    // Simpan perubahan pemberkasan
    await pemberkasan_camaba.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Pemberkasan Camaba Active By ${pemberkasanCamabaId} Success:`,
      data: pemberkasan_camaba,
    });
  } catch (error) {
    next(error);
  }
};

const validasiPemberkasanCamabaByCamabaId = async (req, res, next) => {
  const { pemberkasan_camabas } = req.body;

  try {
    // Dapatkan ID dari parameter permintaan
    const camabaId = req.params.id_camaba;

    if (!camabaId) {
      return res.status(400).json({
        message: "Camaba ID is required",
      });
    }

    // Get data camaba
    const camaba = await Camaba.findByPk(camabaId);

    if (!camaba) {
      return res.status(404).json({
        message: "Camaba not found",
      });
    }

    // Validasi dan update status setiap berkas camaba
    for (const berkas_camaba of pemberkasan_camabas) {
      // Dapatkan id berkas dan status dari body request
      const { id, status_berkas } = berkas_camaba;

      // Temukan berkas camaba berdasarkan ID
      const pemberkasan_camaba = await PemberkasanCamaba.findOne({
        where: {
          id: id,
          id_camaba: camabaId,
        },
      });

      if (!pemberkasan_camaba) {
        return res.status(404).json({
          message: `Pemberkasan camaba dengan ID ${id} tidak ditemukan`,
        });
      }

      // Perbarui status berkas
      pemberkasan_camaba.status_berkas = status_berkas;

      // Simpan perubahan ke database
      await pemberkasan_camaba.save();
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== VALIDASI Pemberkasan Camaba By Camaba ID ${camabaId} Success:`,
      data: pemberkasan_camabas,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPemberkasanCamaba,
  getPemberkasanCamabaById,
  getAllPemberkasanCamabaByCamabaActive,
  updatePemberkasanCamabaActiveById,
  validasiPemberkasanCamabaByCamabaId,
};
