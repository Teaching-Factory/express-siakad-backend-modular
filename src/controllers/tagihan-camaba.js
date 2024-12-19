const { TagihanCamaba, Semester, JenisTagihan, Camaba, UserRole, Role, PeriodePendaftaran } = require("../../models");
const fs = require("fs"); // untuk menghapus file
const path = require("path");

const getAllTagihanCamaba = async (req, res, next) => {
  try {
    // Ambil semua data tagihan_camabas dari database
    const tagihan_camabas = await TagihanCamaba.findAll({
      include: [{ model: Semester }, { model: JenisTagihan }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Tagihan Camaba Success",
      jumlahData: tagihan_camabas.length,
      data: tagihan_camabas,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTagihanCamabaByFilter = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;
    const periodePendaftaranId = req.params.id_periode_pendaftaran;
    const statusTagihan = req.query.status_tagihan; // true (Lunas), false (Belum Bayar)

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }
    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required",
      });
    }

    // Buat kondisi pencarian untuk status tagihan
    let tagihanCondition = {};
    if (statusTagihan !== undefined) {
      // Konversi statusTagihan menjadi boolean
      const isLunas = statusTagihan === "true"; // Ubah string "true" menjadi boolean true

      if (isLunas) {
        tagihanCondition.status_tagihan = "Lunas";
        // console.log("Request dengan status_tagihan: Lunas");
      } else {
        tagihanCondition.status_tagihan = "Belum Bayar";
        // console.log("Request dengan status_tagihan: Belum Bayar");
      }
    }

    // Cari data tagihan_camaba_by_filter berdasarkan ID di database
    const tagihan_camaba_by_filter = await TagihanCamaba.findAll({
      where: {
        id_semester: semesterId,
        id_periode_pendaftaran: periodePendaftaranId,
        ...tagihanCondition,
      },
      include: [{ model: Semester }, { model: JenisTagihan }, { model: Camaba }, { model: PeriodePendaftaran }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!tagihan_camaba_by_filter.length) {
      return res.status(404).json({
        message: "Tagihan Camaba Not Found",
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "GET Tagihan By Filter Camaba Success",
      jumlahData: tagihan_camaba_by_filter.length,
      data: tagihan_camaba_by_filter,
    });
  } catch (error) {
    next(error);
  }
};

const getTagihanCamabaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const tagihanCamabaId = req.params.id;

    if (!tagihanCamabaId) {
      return res.status(400).json({
        message: "Tagihan Camaba ID is required",
      });
    }

    // Cari data tagihan_camaba berdasarkan ID di database
    const tagihan_camaba = await TagihanCamaba.findByPk(tagihanCamabaId, {
      include: [{ model: Semester }, { model: JenisTagihan }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!tagihan_camaba) {
      return res.status(404).json({
        message: `<===== Tagihan Camaba With ID ${tagihanCamabaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Tagihan Camaba By ID ${tagihanCamabaId} Success:`,
      data: tagihan_camaba,
    });
  } catch (error) {
    next(error);
  }
};

const getTagihanCamabaByCamabaActive = async (req, res, next) => {
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

    const camaba = await Camaba.findOne({
      where: {
        nomor_daftar: user.username,
      },
    });

    if (!camaba) {
      return res.status(404).json({
        message: "Camaba not found",
      });
    }

    // Ambil data tagihan_camaba berdasarkan camaba yang aktif dari database
    const tagihan_camaba = await TagihanCamaba.findOne({
      where: {
        id_camaba: camaba.id,
      },
      include: [{ model: Semester }, { model: JenisTagihan }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Tagihan Camaba Active Success",
      data: tagihan_camaba,
    });
  } catch (error) {
    next(error);
  }
};

const uploadBuktiPembayaranByCamabaActive = async (req, res, next) => {
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

    const camaba = await Camaba.findOne({
      where: {
        nomor_daftar: user.username,
      },
    });

    if (!camaba) {
      return res.status(404).json({
        message: "Camaba not found",
      });
    }

    // Ambil data tagihan_camaba berdasarkan camaba yang aktif dari database
    const tagihan_camaba = await TagihanCamaba.findOne({
      where: {
        id_camaba: camaba.id,
      },
    });

    // Simpan path file lama jika ada
    const originalFilePath = tagihan_camaba.upload_bukti;

    // Jika ada file baru di-upload, update path file dan hapus file lama
    if (req.file) {
      // Cek tipe MIME file yang di-upload
      if (req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/png") {
        return res.status(400).json({ message: "File type not supported" });
      } else {
        const protocol = process.env.PROTOCOL || "http";
        const host = process.env.HOST || "localhost";
        const port = process.env.PORT || 4000;

        const fileName = req.file.filename;
        const fileUrl = `${protocol}://${host}:${port}/src/storage/camaba/tagihan-pembayaran/${fileName}`;

        tagihan_camaba.upload_bukti = fileUrl;

        // Hapus file lama jika ada
        if (originalFilePath) {
          const oldFilePath = path.resolve(__dirname, `../storage/camaba/tagihan-pembayaran/${path.basename(originalFilePath)}`);
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error(`Gagal menghapus file: ${err.message}`);
            }
          });
        }
      }
    }

    // Simpan perubahan tagihan_camaba
    await tagihan_camaba.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== Upload Tagihan Camaba Active Success:`,
      data: tagihan_camaba,
    });
  } catch (error) {
    next(error);
  }
};

const validasiTagihanCamabaKolektif = async (req, res, next) => {
  try {
    // Dapatkan array tagihan_camabas dari body permintaan
    const tagihan_camabas = req.body.tagihan_camabas;

    // Pastikan ada tagihan_camabas yang diterima
    if (!Array.isArray(tagihan_camabas) || tagihan_camabas.length === 0) {
      return res.status(400).json({ message: "Tagihan camabas is required" });
    }

    // Lakukan iterasi melalui setiap objek tagihan_camaba
    for (let tagihan_camaba of tagihan_camabas) {
      // Ambil ID registrasi tagihan_camaba dari objek tagihan_mahasiswa saat ini
      let tagihanCamabaId = tagihan_camaba.id;

      // Ambil data Tagihan Camaba berdasarkan id
      let dataTagihanCamaba = await TagihanCamaba.findOne({
        where: {
          id: tagihanCamabaId,
        },
      });

      // Periksa apakah data tagihan camaba ditemukan
      if (!dataTagihanCamaba) {
        return res.status(404).json({
          message: `Tagihan Camaba with ID ${tagihanCamabaId} not found`,
        });
      }

      // Update data status tagihan camaba
      dataTagihanCamaba.status_tagihan = "Lunas";
      dataTagihanCamaba.validasi_tagihan = true;
      dataTagihanCamaba.tanggal_lunas = new Date();

      // Simpan perubahan ke dalam database
      await dataTagihanCamaba.save();

      // update data status_pembayaran milik oleh camaba
      let dataCamaba = await Camaba.findOne({
        where: {
          id: dataTagihanCamaba.id_camaba,
        },
      });

      // Periksa apakah data camaba ditemukan
      if (!dataCamaba) {
        return res.status(404).json({
          message: `Camaba with ID ${dataCamaba.id_camaba} not found`,
        });
      }

      // update data camaba
      dataCamaba.status_pembayaran = true;

      // Simpan perubahan ke dalam database
      await dataCamaba.save();
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Tagihan Camaba Kolektif Success:`,
      data: tagihan_camabas,
    });
  } catch (error) {
    next(error);
  }
};

const getTagihanCamabaByCamabaId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const camabaId = req.params.id_camaba;

    if (!camabaId) {
      return res.status(400).json({
        message: "Camaba ID is required",
      });
    }

    // Cari data tagihan_camaba berdasarkan ID di database
    const tagihan_camaba = await TagihanCamaba.findOne({
      where: {
        id_camaba: camabaId,
      },
      include: [{ model: Semester }, { model: JenisTagihan }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!tagihan_camaba) {
      return res.status(404).json({
        message: `<===== Tagihan Camaba With Camaba ID ${camabaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Tagihan Camaba By Camaba ID ${camabaId} Success:`,
      data: tagihan_camaba,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTagihanCamaba,
  getAllTagihanCamabaByFilter,
  getTagihanCamabaById,
  getTagihanCamabaByCamabaActive,
  uploadBuktiPembayaranByCamabaActive,
  validasiTagihanCamabaKolektif,
  getTagihanCamabaByCamabaId,
};
