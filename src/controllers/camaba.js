const {
  Camaba,
  User,
  SettingWSFeeder,
  PeriodePendaftaran,
  Prodi,
  ProdiCamaba,
  JenjangPendidikan,
  Semester,
  Role,
  UserRole,
  BiodataCamaba,
  PemberkasanCamaba,
  BerkasPeriodePendaftaran,
  JalurMasuk,
  SistemKuliah,
  TahapTesPeriodePendaftaran,
  JenisTes,
  TagihanCamaba,
  JenisTagihan,
  SumberPeriodePendaftaran,
  SumberInfoCamaba,
  Sumber,
  Wilayah,
  Agama,
  SettingGlobalSemester,
  JenisPendaftaran,
  Pembiayaan,
} = require("../../models");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const path = require("path");
const ExcelJS = require("exceljs");
const { Op } = require("sequelize");

// admin, admin-pmb
const getAllCamaba = async (req, res, next) => {
  try {
    // Ambil semua data camabas dari database
    const camabas = await Camaba.findAll({
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Camaba Success",
      jumlahData: camabas.length,
      data: camabas,
    });
  } catch (error) {
    next(error);
  }
};

// admin, admin-pmb
const getAllCamabaByFilter = async (req, res, next) => {
  const { id_periode_pendaftaran, status_berkas, status_tes } = req.query;

  if (!id_periode_pendaftaran) {
    return res.status(400).json({ message: "id_periode_pendaftaran is required" });
  }
  if (!status_berkas) {
    return res.status(400).json({ message: "status_berkas is required" });
  }
  if (!status_tes) {
    return res.status(400).json({ message: "status_tes is required" });
  }

  try {
    let status_berkas_now = null;
    let status_tes_now = null;

    // pengecekan status request query
    if (status_berkas === "true") {
      status_berkas_now = 1;
    } else {
      status_berkas_now = 0;
    }

    if (status_tes === "true") {
      status_tes_now = 1;
    } else {
      status_tes_now = 0;
    }

    // Ambil semua data camabas dari database
    const camabas = await Camaba.findAll({
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] },
      ],
      where: {
        id_periode_pendaftaran: id_periode_pendaftaran,
        status_berkas: status_berkas_now,
        status_tes: status_tes_now,
      },
    });

    if (!camabas || camabas.length === 0) {
      return res.status(404).json({
        message: `<===== Camaba Not Found`,
      });
    }

    // Loop melalui setiap camaba untuk mendapatkan prodi pertama mereka
    const camabaWithProdi = await Promise.all(
      camabas.map(async (camaba) => {
        // Ambil prodi pertama berdasarkan id_camaba
        const prodi_camaba = await ProdiCamaba.findOne({
          where: {
            id_camaba: camaba.id,
          },
          order: [["createdAt", "ASC"]], // Mengambil berdasarkan urutan (prodi pertama)
        });

        // Jika prodi_camaba ditemukan, tambahkan ke data camaba
        return {
          ...camaba.toJSON(), // Konversi instance Sequelize menjadi JSON
          ProdiCamaba: prodi_camaba || null, // Tambahkan ProdiCamaba atau null jika tidak ditemukan
        };
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Camaba By Filter Success",
      jumlahData: camabaWithProdi.length,
      data: camabaWithProdi,
    });
  } catch (error) {
    next(error);
  }
};

// admin, admin-pmb, guest
const getCamabaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const camabaId = req.params.id;

    if (!camabaId) {
      return res.status(400).json({
        message: "Camaba ID is required",
      });
    }

    // Cari data camaba berdasarkan ID di database
    const camaba = await Camaba.findByPk(camabaId, {
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }, { model: JalurMasuk }, { model: SistemKuliah }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] },
      ],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!camaba) {
      return res.status(404).json({
        message: `<===== Camaba With ID ${camabaId} Not Found:`,
      });
    }

    // get data Prodi Camaba
    const prodiCamaba = await ProdiCamaba.findAll({
      where: { id_camaba: camabaId },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!prodiCamaba) {
      return res.status(404).json({
        message: `<===== Prodi Camaba With Camaba ID ${camabaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Camaba By ID ${camabaId} Success:`,
      data: camaba,
      prodiCamaba: prodiCamaba,
    });
  } catch (error) {
    next(error);
  }
};

// guest
const createCamaba = async (req, res, next) => {
  const { nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, nomor_hp, email, prodi = [], sumber_periode_pendaftaran = [] } = req.body;

  if (!nama_lengkap) {
    return res.status(400).json({ message: "nama_lengkap is required" });
  }
  if (!tempat_lahir) {
    return res.status(400).json({ message: "tempat_lahir is required" });
  }
  if (!tanggal_lahir) {
    return res.status(400).json({ message: "tanggal_lahir is required" });
  }
  if (!jenis_kelamin) {
    return res.status(400).json({ message: "jenis_kelamin is required" });
  }
  if (!nomor_hp) {
    return res.status(400).json({ message: "nomor_hp is required" });
  }
  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }

  // validasi array prodis camaba (wajib)
  if (prodi.length === 0) {
    return res.status(400).json({ message: "Prodi is required" });
  }
  // validasi array sumber_periode_pendaftarans camaba (wajib)
  if (sumber_periode_pendaftaran.length === 0) {
    return res.status(400).json({ message: "Sumber Periode Pendaftaran is required" });
  }

  try {
    const periodePendaftaranId = req.params.id_periode_pendaftaran;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required",
      });
    }

    const periode_pendaftaran = await PeriodePendaftaran.findOne({
      where: {
        id: periodePendaftaranId,
      },
    });

    if (!periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Periode Pendaftaran With ID ${periodePendaftaranId} Not Found:`,
      });
    }

    const setting_ws_feeder_aktif = await SettingWSFeeder.findOne({
      where: { status: true },
    });

    if (!setting_ws_feeder_aktif) {
      return res.status(404).json({
        message: `<===== Setting WS Feeder Aktif Not Found:`,
      });
    }

    const role = await Role.findOne({
      where: { nama_role: "camaba" },
    });

    if (!role) {
      return res.status(404).json({
        message: `<===== Role Camaba Not Found:`,
      });
    }

    // Fungsi untuk menghasilkan nomor daftar
    const generateNomorDaftar = async (setting_ws_feeder_aktif, periode_pendaftaran) => {
      const usernameFeeder = setting_ws_feeder_aktif.username_feeder;
      const semesterId = periode_pendaftaran.id_semester.toString().slice(-3);

      const lastCamaba = await Camaba.findOne({
        where: { id_periode_pendaftaran: periode_pendaftaran.id },
        order: [["nomor_daftar", "DESC"]],
      });

      let nomorUrut = "0001"; // default jika belum ada
      if (lastCamaba) {
        const lastNomorDaftar = lastCamaba.nomor_daftar;
        const lastNomorUrut = parseInt(lastNomorDaftar.slice(-4));
        nomorUrut = (lastNomorUrut + 1).toString().padStart(4, "0");
      }

      return `${usernameFeeder}${semesterId}${nomorUrut}`;
    };

    // Buat nomor daftar baru
    const nomorDaftar = await generateNomorDaftar(setting_ws_feeder_aktif, periode_pendaftaran);

    // Konversi tanggal_lahir dan enkripsi untuk password
    const tanggal_lahir_format = convertTanggal(tanggal_lahir);
    const hashedPassword = await bcrypt.hash(tanggal_lahir_format, 10);

    // get data jenis tagihan PMB
    const jenis_tagihan_pmb = await JenisTagihan.findOne({
      where: { nama_jenis_tagihan: "PMB" },
    });

    if (!jenis_tagihan_pmb) {
      return res.status(404).json({
        message: `<===== Jenis Tagihan PMB Not Found:`,
      });
    }

    // Buat data camaba baru
    const newCamaba = await Camaba.create({
      nama_lengkap,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      nomor_hp,
      email,
      tanggal_pendaftaran: new Date(),
      nomor_daftar: nomorDaftar,
      hints: tanggal_lahir_format,
      id_periode_pendaftaran: periodePendaftaranId,
    });

    // Buat data user baru
    const newUser = await User.create({
      nama: newCamaba.nama_lengkap,
      username: newCamaba.nomor_daftar,
      password: hashedPassword,
      hints: tanggal_lahir_format,
      email: null,
      status: true,
    });

    await UserRole.create({
      id_role: role.id,
      id_user: newUser.id,
    });

    // Buat data Biodata Camaba
    await BiodataCamaba.create({
      telepon: newCamaba.nomor_hp,
      handphone: newCamaba.nomor_hp,
      email: newCamaba.email,
      id_camaba: newCamaba.id,
    });

    // Get data berkas periode pendaftaran
    const berkas_periode_pendaftaran = await BerkasPeriodePendaftaran.findAll({
      where: {
        id_periode_pendaftaran: periodePendaftaranId,
      },
    });

    // Periksa apakah data ditemukan
    if (!berkas_periode_pendaftaran || berkas_periode_pendaftaran.length === 0) {
      return res.status(404).json({
        message: `<===== Berkas Periode Pendaftaran Not Found:`,
      });
    }

    // Loop untuk setiap berkas yang ditemukan dan buat data pemberkasan camaba
    for (const berkas of berkas_periode_pendaftaran) {
      await PemberkasanCamaba.create({
        file_berkas: null,
        id_berkas_periode_pendaftaran: berkas.id,
        id_camaba: newCamaba.id,
      });
    }

    // Variabel untuk menyimpan prodi yang berhasil ditambahkan
    let prodiCamaba = [];

    // Tambah data Prodi
    if (prodi.length > 0) {
      prodiCamaba = await Promise.all(
        prodi.map(async ({ id_prodi }) => {
          const data_prodi = await Prodi.findOne({
            where: { id_prodi: id_prodi },
          });

          if (data_prodi) {
            await ProdiCamaba.create({
              id_prodi: data_prodi.id_prodi,
              id_camaba: newCamaba.id,
            });
            return data_prodi;
          } else {
            console.error(`Prodi with id_prodi: ${id_prodi} not found`);
            return null;
          }
        })
      );
    }

    // Hanya tambahkan data prodi yang berhasil ditemukan
    prodiCamaba = prodiCamaba.filter((prodi) => prodi !== null);

    // create data tagihan camaba
    await TagihanCamaba.create({
      jumlah_tagihan: periode_pendaftaran.biaya_pendaftaran,
      tanggal_tagihan: periode_pendaftaran.batas_akhir_pembayaran,
      id_jenis_tagihan: jenis_tagihan_pmb.id_jenis_tagihan,
      id_semester: periode_pendaftaran.id_semester,
      id_camaba: newCamaba.id,
      id_periode_pendaftaran: periode_pendaftaran.id,
    });

    // Variabel untuk menyimpan sumber_periode_pendaftaran yang berhasil ditambahkan
    let sumberPeriodePendaftaran = [];

    if (sumber_periode_pendaftaran.length > 0) {
      sumberPeriodePendaftaran = await Promise.all(
        sumber_periode_pendaftaran.map(async ({ id, nama_sumber: namaSumberRequest }) => {
          // tambahkan nama_sumber dari request
          const data_sumber_periode_pendaftaran = await SumberPeriodePendaftaran.findOne({
            where: { id_sumber: id },
            include: [{ model: Sumber }],
          });

          if (data_sumber_periode_pendaftaran) {
            const namaSumber = data_sumber_periode_pendaftaran.Sumber.nama_sumber === "Lainnya" ? namaSumberRequest : data_sumber_periode_pendaftaran.Sumber.nama_sumber;

            await SumberInfoCamaba.create({
              nama_sumber: namaSumber, // menggunakan nama sumber sesuai kondisi
              id_camaba: newCamaba.id,
              id_sumber_periode_pendaftaran: data_sumber_periode_pendaftaran.id,
            });

            return data_sumber_periode_pendaftaran;
          } else {
            console.error(`Sumber Periode Pendaftaran with id: ${id} not found`);
            return null;
          }
        })
      );
    }

    // Hanya tambahkan data sumber info camaba yang berhasil ditemukan
    sumberPeriodePendaftaran = sumberPeriodePendaftaran.filter((sumber_periode_pendaftaran) => sumber_periode_pendaftaran !== null);

    res.status(201).json({
      message: "<===== CREATE Camaba Success",
      dataCamaba: newCamaba,
      dataProdiCamaba: prodiCamaba,
      dataSumberInfoCamaba: sumberPeriodePendaftaran,
    });
  } catch (error) {
    next(error);
  }
};

// camaba
const getCamabaActiveByUser = async (req, res, next) => {
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
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] },
      ],
    });

    if (!camaba) {
      return res.status(404).json({
        message: "Camaba not found",
      });
    }

    // get data Prodi Camaba
    const prodiCamaba = await ProdiCamaba.findAll({
      where: { id_camaba: camaba.id },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!prodiCamaba) {
      return res.status(404).json({
        message: `<===== Prodi Camaba Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Camaba Active Success:`,
      data: camaba,
      prodiCamaba: prodiCamaba,
    });
  } catch (error) {
    next(error);
  }
};

// camaba
const updateProfileCamabaActive = async (req, res, next) => {
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
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] },
      ],
    });

    if (!camaba) {
      return res.status(404).json({
        message: "Camaba not found",
      });
    }

    // Simpan path file lama jika ada
    const originalProfilePath = camaba.foto_profil;

    // Jika ada file baru di-upload, update path profile dan hapus file lama
    if (req.file) {
      // Cek tipe MIME file yang di-upload
      if (req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/png") {
        return res.status(400).json({ message: "File type not supported" });
      } else {
        const protocol = process.env.PROTOCOL || "http";
        const host = process.env.HOST || "localhost";
        const port = process.env.PORT || 4000;

        const fileName = req.file.filename;
        const fileUrl = `${protocol}://${host}:${port}/src/storage/camaba/profile/${fileName}`;

        camaba.foto_profil = fileUrl;

        // Hapus file lama jika ada
        if (originalProfilePath) {
          const oldFilePath = path.resolve(__dirname, `../storage/camaba/profile/${path.basename(originalProfilePath)}`);
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error(`Gagal menghapus gambar: ${err.message}`);
            }
          });
        }
      }
    }

    // Simpan perubahan camaba
    await camaba.save();

    res.json({
      message: "UPDATE Profile Camaba Success",
      data: camaba,
    });
  } catch (error) {
    next(error);
  }
};

// camaba
const finalisasiByCamabaActive = async (req, res, next) => {
  const { finalisasi } = req.body;

  if (!finalisasi) {
    return res.status(400).json({ message: "finalisasi is required" });
  }

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

    // update data finalisasi pada camaba aktif
    camaba.finalisasi = finalisasi;
    await camaba.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== Finalisasi Camaba Active Success:`,
      data: camaba,
    });
  } catch (error) {
    next(error);
  }
};

// admin, admin pmb
const updateStatusKelulusanPendaftar = async (req, res, next) => {
  const { status_berkas, status_tes, id_prodi_diterima, id_pembiayaan, finalisasi, status_akun_pendaftar } = req.body; // nim tidak dilampirkan

  // Mengecek jika variabel undefined atau null, tetapi tetap menerima nilai false
  if (status_berkas === undefined || status_berkas === null) {
    return res.status(400).json({ message: "status_berkas is required" });
  }
  if (status_tes === undefined || status_tes === null) {
    return res.status(400).json({ message: "status_tes is required" });
  }
  if (status_akun_pendaftar === undefined || status_akun_pendaftar === null) {
    return res.status(400).json({ message: "status_akun_pendaftar is required" });
  }
  if (!id_prodi_diterima) {
    return res.status(400).json({ message: "id_prodi_diterima is required" });
  }
  if (!id_pembiayaan) {
    return res.status(400).json({ message: "id_pembiayaan is required" });
  }
  if (!finalisasi) {
    return res.status(400).json({ message: "finalisasi is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const camabaId = req.params.id;

    if (!camabaId) {
      return res.status(400).json({
        message: "Camaba ID is required",
      });
    }

    // Cari data camaba berdasarkan ID di database
    const camaba = await Camaba.findByPk(camabaId);

    // Jika tidak ditemukan, kembalikan error 404
    if (!camaba) {
      return res.status(404).json({
        message: `Camaba with ID ${camabaId} not found`,
      });
    }

    // Update data camaba
    camaba.status_berkas = status_berkas;
    camaba.status_tes = status_tes;
    camaba.id_prodi_diterima = id_prodi_diterima;
    camaba.id_pembiayaan = id_pembiayaan;
    camaba.finalisasi = finalisasi;
    camaba.status_akun_pendaftar = status_akun_pendaftar;

    // Simpan perubahan
    await camaba.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Status Kelulusan Pendaftar By Camaba ID ${camabaId} Success:`,
      data: camaba,
    });
  } catch (error) {
    next(error);
  }
};

// camaba
const cetakFormPendaftaranByCamabaActive = async (req, res, next) => {
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
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }, { model: JalurMasuk }, { model: SistemKuliah }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] },
      ],
    });

    if (!camaba) {
      return res.status(404).json({
        message: "Camaba not found",
      });
    }

    // get data user
    const user_camaba = await User.findOne({
      where: {
        username: camaba.nomor_daftar,
      },
      attributes: ["username", "hints"],
    });

    if (!user_camaba) {
      return res.status(404).json({
        message: "User Camaba not found",
      });
    }

    // get data Prodi Camaba
    const prodiCamaba = await ProdiCamaba.findAll({
      where: { id_camaba: camaba.id },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!prodiCamaba) {
      return res.status(404).json({
        message: `<===== Prodi Camaba Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== Cetak Form Pendaftaran Camaba Active Success:`,
      dataCamaba: camaba,
      dataProdiCamaba: prodiCamaba,
      dataUserCamaba: user_camaba,
    });
  } catch (error) {
    next(error);
  }
};

// camaba
const cetakKartuUjianByCamabaActive = async (req, res, next) => {
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
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }, { model: JalurMasuk }, { model: SistemKuliah }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] },
      ],
    });

    if (!camaba) {
      return res.status(404).json({
        message: "Camaba not found",
      });
    }

    // mengecek apakah camaba sudah melakukan finalisasi atau belum
    if (camaba.finalisasi === true) {
      // get biodata camaba
      const biodata_camaba = await BiodataCamaba.findOne({
        where: {
          id_camaba: camaba.id,
        },
      });

      // Jika data tidak ditemukan, kirim respons 404
      if (!biodata_camaba) {
        return res.status(404).json({
          message: `<===== Biodata Camaba Not Found:`,
        });
      }

      // get data periode pendaftaran
      const periode_pendaftaran = await PeriodePendaftaran.findOne({
        where: {
          id: camaba.id_periode_pendaftaran,
        },
      });

      // Jika data tidak ditemukan, kirim respons 404
      if (!periode_pendaftaran) {
        return res.status(404).json({
          message: `<===== Periode Pendaftaran Not Found:`,
        });
      }

      // get tahap tes periode pendaftaran
      const tahap_tes_periode_pendaftaran = await TahapTesPeriodePendaftaran.findAll({
        where: {
          id_periode_pendaftaran: periode_pendaftaran.id,
        },
        include: [{ model: JenisTes }],
      });

      // Jika data tidak ditemukan, kirim respons 404
      if (!tahap_tes_periode_pendaftaran) {
        return res.status(404).json({
          message: `<===== Tahap Tes Periode Pendaftaran Not Found:`,
        });
      }

      // get data Prodi Camaba
      const prodiCamaba = await ProdiCamaba.findAll({
        where: { id_camaba: camaba.id },
        include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
      });

      // Jika data tidak ditemukan, kirim respons 404
      if (!prodiCamaba) {
        return res.status(404).json({
          message: `<===== Prodi Camaba Not Found:`,
        });
      }

      // Kirim respons JSON jika berhasil
      res.status(200).json({
        message: `<===== Cetak Form Pendaftaran Camaba Active Success:`,
        dataCamaba: camaba,
        dataBiodataCamaba: biodata_camaba,
        dataProdiCamaba: prodiCamaba,
        dataTahapTes: tahap_tes_periode_pendaftaran,
      });
    } else {
      return res.status(404).json({
        message: "Camaba belum melakukan finalisasi",
      });
    }
  } catch (error) {
    next(error);
  }
};

const exportCamabaByPeriodePendaftaranId = async (req, res, next) => {
  try {
    const periodePendaftaranId = req.params.id_periode_pendaftaran;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required",
      });
    }

    // Retrieve data based on Periode Pendaftaran ID
    const camabas = await Camaba.findAll({
      where: {
        id_periode_pendaftaran: periodePendaftaranId,
        finalisasi: true,
        status_berkas: true,
        status_tes: true,
        status_pembayaran: true,
      },
      include: [{ model: PeriodePendaftaran }, { model: Prodi, include: [{ model: JenjangPendidikan }] }],
    });

    if (!camabas || camabas.length === 0) {
      return res.status(404).json({
        message: `<===== Camaba With Periode Pendaftaran ID ${periodePendaftaranId} Not Found:`,
      });
    }

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Camaba Data");

    // Add column headers
    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Nomor Pendaftaran", key: "nomor_daftar", width: 20 },
      { header: "Nama", key: "nama", width: 20 },
      { header: "Nim", key: "nim", width: 20 },
      { header: "Nama Periode Pendaftaran", key: "nama_periode_pendaftaran", width: 20 },
      { header: "Tanggal Pendaftaran", key: "tanggal_pendaftaran", width: 20 },
      { header: "Nomor HP", key: "nomor_hp", width: 20 },
      { header: "Email", key: "email", width: 20 },
      { header: "Prodi Diterima", key: "prodi_diterima", width: 20 },
      { header: "Kode Prodi Diterima", key: "kode_prodi_diterima", width: 20 },
      { header: "Jenjang Pendidikan", key: "jenjang_pendidikan", width: 20 },
      { header: "Status Berkas", key: "status_berkas", width: 20 },
      { header: "Status Tes", key: "status_tes", width: 20 },
      { header: "Status Pembayaran", key: "status_pembayaran", width: 20 },
      { header: "Finalisasi Camaba", key: "finalisasi", width: 20 },
    ];

    // Add data rows
    camabas.forEach((camaba, index) => {
      worksheet.addRow({
        no: index + 1,
        nomor_daftar: camaba.nomor_daftar,
        nama: camaba.nama_lengkap,
        nim: "",
        nama_periode_pendaftaran: camaba.PeriodePendaftaran.nama_periode_pendaftaran,
        tanggal_pendaftaran: camaba.tanggal_pendaftaran,
        nomor_hp: camaba.nomor_hp,
        email: camaba.email,
        prodi_diterima: camaba.Prodi.nama_program_studi,
        kode_prodi_diterima: camaba.Prodi.kode_program_studi,
        jenjang_pendidikan: camaba.Prodi.JenjangPendidikan.nama_jenjang_didik,
        status_berkas: camaba.status_berkas ? "Lulus" : "Tidak Lulus",
        status_tes: camaba.status_tes ? "Lulus" : "Tidak Lulus",
        status_pembayaran: camaba.status_tes ? "Lunas" : "Belum Lunas",
        finalisasi: camaba.status_tes ? "Sudah" : "Belum",
      });
    });

    // Set headers for the response
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=camaba-periode-${periodePendaftaranId}.xlsx`);

    // Write to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

const importCamabaForUpdateNimKolektif = async (req, res, next) => {
  try {
    const periodePendaftaranId = req.params.id_periode_pendaftaran;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error("Worksheet not found in the Excel file");
    }

    let camabaDataNew = []; // Menyimpan hasil update untuk respon
    let promises = []; // Menyimpan promise untuk update database

    // Iterasi setiap baris di worksheet menggunakan for...of
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      const nim = row.getCell(4).value; // Trim untuk menghilangkan spasi
      const nomor_daftar = row.getCell(2).value; // Pastikan format sesuai (string/number)

      // // Log the extracted data for debugging
      // console.log(`Row ${rowNumber}:`, {
      //   nim,
      //   nomor_daftar
      // });

      // Mengambil data camaba
      const camaba = await Camaba.findOne({
        where: {
          nomor_daftar: nomor_daftar,
          id_periode_pendaftaran: periodePendaftaranId,
        },
      });

      if (camaba) {
        // Update data nim camaba
        camaba.nim = nim;

        // Simpan perubahan ke dalam database
        promises.push(
          camaba.save().then((updatedCamaba) => {
            camabaDataNew.push(updatedCamaba); // Tambahkan camaba yang diperbarui ke array
          })
        );
      } else {
        console.warn(`Camaba not found for Nomor Daftar: ${nomor_daftar}`);
      }
    }

    // Tunggu semua promise selesai
    await Promise.all(promises);

    // Hapus file ketika berhasil melakukan import data
    await fs.unlink(filePath);

    res.status(200).json({
      message: "Import and Update Data Nim Camaba Kolektif Success",
      jumlahData: camabaDataNew.length,
      data: camabaDataNew,
    });
  } catch (error) {
    next(error);
  }
};

const exportCamabaForMahasiswaByPeriodePendaftaranId = async (req, res, next) => {
  try {
    const periodePendaftaranId = req.params.id_periode_pendaftaran;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required",
      });
    }

    // get periode pendaftaran
    const periodePendaftaran = await PeriodePendaftaran.findByPk(periodePendaftaranId, {
      include: [{ model: JalurMasuk }],
    });

    if (!periodePendaftaran) {
      return res.status(400).json({
        message: "Periode Pendaftaran Not Found",
      });
    }

    // get data setting global semester
    const setting_global_semester_aktif = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
      include: [{ model: Semester, as: "SemesterAktif" }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!setting_global_semester_aktif) {
      return res.status(404).json({
        message: `<===== Setting Global Semester Aktif Not Found:`,
      });
    }

    // get jenis pendaftaran Peserta Didik Baru
    const jenisPendaftaranPesertaDidikBaru = await JenisPendaftaran.findOne({
      where: {
        nama_jenis_daftar: "Peserta didik baru",
      },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenisPendaftaranPesertaDidikBaru) {
      return res.status(404).json({
        message: `<===== Jenis Pendaftaran Peserta Didik Baru Not Found:`,
      });
    }

    // Retrieve data based on Periode Pendaftaran ID
    const camabas = await Camaba.findAll({
      where: {
        id_periode_pendaftaran: periodePendaftaranId,
        status_export_mahasiswa: false,
        nim: {
          [Op.and]: [{ [Op.not]: null }, { [Op.not]: "" }],
        },
        nama_lengkap: {
          [Op.and]: [{ [Op.not]: null }, { [Op.not]: "" }],
        },
        tempat_lahir: {
          [Op.and]: [{ [Op.not]: null }, { [Op.not]: "" }],
        },
        tanggal_lahir: { [Op.not]: null },
        jenis_kelamin: { [Op.not]: null },
        id_prodi_diterima: { [Op.not]: null },
      },
      include: [{ model: Prodi }, { model: Pembiayaan }, { model: BiodataCamaba, include: [{ model: Wilayah }, { model: Agama }] }],
    });

    if (!camabas || camabas.length === 0) {
      return res.status(404).json({
        message: `<===== Camaba With Periode Pendaftaran ID ${periodePendaftaranId} Not Found:`,
      });
    }

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data Calon Mahasiswa");

    // Add column headers
    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "NIM", key: "nim", width: 20 },
      { header: "NISN", key: "nisn", width: 20 },
      { header: "Nama Mahasiswa", key: "nama_lengkap", width: 20 },
      { header: "NIK", key: "nik", width: 20 },
      { header: "Tempat Lahir", key: "tempat_lahir", width: 20 },
      { header: "Tanggal Lahir", key: "tanggal_lahir", width: 20 },
      { header: "Jenis Kelamin", key: "jenis_kelamin", width: 20 },
      { header: "No. Handphone", key: "nomor_hp", width: 20 },
      { header: "Email", key: "email", width: 20 },
      { header: "Kode Agama", key: "kode_agama", width: 20 },
      { header: "Desa/Kelurahan", key: "kelurahan", width: 20 },
      { header: "Kode Wilayah", key: "kode_wilayah", width: 20 },
      { header: "Nama Ibu Kandung", key: "nama_ibu_kandung", width: 20 },
      { header: "Kode Prodi", key: "kode_prodi", width: 20 },
      { header: "Tanggal Masuk", key: "tanggal_masuk", width: 20 },
      { header: "Semester Masuk", key: "semester_masuk", width: 20 },
      { header: "Jenis Pendaftaran", key: "jenis_pendaftaran", width: 20 },
      { header: "Jalur Pendaftaran", key: "jalur_pendaftaran", width: 20 },
      { header: "Kode PT Asal", key: "kode_pt_asal", width: 20 },
      { header: "Kode Prodi Asal", key: "kode_prodi_asal", width: 20 },
      { header: "Biaya Awal Masuk", key: "biaya_awal_masuk", width: 20 },
      { header: "Jenis Pembiayaan", key: "jenis_pembiayaan", width: 20 },
    ];

    // Format tanggal masuk dengan toLocaleDateString
    const formattedTanggalMasuk = new Date().toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });

    // Add data rows
    camabas.forEach((camaba, index) => {
      const formattedTanggalLahir = new Date(camaba.tanggal_lahir).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });

      // Format biaya_awal_masuk tanpa desimal
      const formattedBiayaAwalMasuk = parseInt(periodePendaftaran.biaya_pendaftaran, 10);

      worksheet.addRow({
        no: index + 1,
        nim: `'${camaba.nim}`,
        nisn: `'${camaba.BiodataCamaba?.nisn || ""}`,
        nama_lengkap: camaba.nama_lengkap,
        nik: `'${camaba.BiodataCamaba?.nik || ""}`,
        tempat_lahir: camaba.tempat_lahir,
        tanggal_lahir: formattedTanggalLahir,
        jenis_kelamin: camaba.jenis_kelamin === "Laki-laki" ? "L" : camaba.jenis_kelamin === "Perempuan" ? "P" : "",
        nomor_hp: camaba.nomor_hp,
        email: camaba.email,
        kode_agama: camaba.BiodataCamaba?.Agama?.id_agama || "",
        kelurahan: camaba.BiodataCamaba?.Wilayah?.nama_wilayah || "",
        kode_wilayah: camaba.BiodataCamaba?.Wilayah?.id_wilayah || "",
        nama_ibu_kandung: camaba.BiodataCamaba?.nama_ibu_kandung || "",
        kode_prodi: camaba.Prodi?.kode_program_studi || "",
        tanggal_masuk: formattedTanggalMasuk,
        semester_masuk: setting_global_semester_aktif.SemesterAktif.id_semester,
        jenis_pendaftaran: jenisPendaftaranPesertaDidikBaru.nama_jenis_daftar,
        jalur_pendaftaran: periodePendaftaran.JalurMasuk.nama_jalur_masuk,
        kode_pt_asal: "",
        kode_prodi_asal: "",
        biaya_awal_masuk: formattedBiayaAwalMasuk,
        jenis_pembiayaan: camaba.Pembiayaan?.nama_pembiayaan || "",
      });
    });

    // Set headers for the response
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=camaba-to-mahasiswa-periode-${periodePendaftaranId}.xlsx`);

    // update kolom status_export_mahasiswa menjadi true
    const promises = camabas.map(async (camaba) => {
      camaba.status_export_mahasiswa = true; // Set status to true
      return camaba.save(); // Save changes
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    // Write to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

const getFinalisasiByCamabaActive = async (req, res, next) => {
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

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Finalisasi Camaba Active Success:`,
      finalisasi_camaba: camaba.finalisasi,
    });
  } catch (error) {
    next(error);
  }
};

// camaba
const getStatusBiodataCamabaByCamabaActive = async (req, res, next) => {
  try {
    let statusBiodataCamaba = false;
    const user = req.user;

    // Dapatkan role camaba
    const roleCamaba = await Role.findOne({
      where: { nama_role: "camaba" },
    });

    if (!roleCamaba) {
      return res.status(404).json({
        message: "Role Camaba not found",
      });
    }

    // Cek apakah user adalah camaba
    const userRole = await UserRole.findOne({
      where: { id_user: user.id, id_role: roleCamaba.id },
    });

    if (!userRole) {
      return res.status(404).json({
        message: "User is not Camaba",
      });
    }

    // Ambil data camaba berdasarkan nomor_daftar
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

    // get biodata camaba
    const biodataCamaba = await BiodataCamaba.findOne({
      where: {
        id_camaba: camaba.id,
      },
    });

    if (!biodataCamaba) {
      return res.status(404).json({
        message: "Biodata Camaba not found",
      });
    }

    // Daftar kolom yang wajib diisi
    const requiredFields = ["nik", "nisn", "kewarganegaraan", "jalan", "dusun", "rt", "rw", "kelurahan", "kode_pos", "nama_ibu_kandung", "id_sekolah", "id_agama", "id_jenis_tinggal"];

    // Cek apakah semua kolom wajib terisi
    statusBiodataCamaba = requiredFields.every((field) => biodataCamaba[field] !== null && biodataCamaba[field] !== "");

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Status Biodata Camaba By Camaba Active Success:`,
      data: statusBiodataCamaba,
    });
  } catch (error) {
    next(error);
  }
};

// camaba
const getStatusUploadFotoByCamabaActive = async (req, res, next) => {
  try {
    let statusUploadFoto = false;
    const user = req.user;

    // Dapatkan role camaba
    const roleCamaba = await Role.findOne({
      where: { nama_role: "camaba" },
    });

    if (!roleCamaba) {
      return res.status(404).json({
        message: "Role Camaba not found",
      });
    }

    // Cek apakah user adalah camaba
    const userRole = await UserRole.findOne({
      where: { id_user: user.id, id_role: roleCamaba.id },
    });

    if (!userRole) {
      return res.status(404).json({
        message: "User is not Camaba",
      });
    }

    // Ambil data camaba berdasarkan nomor_daftar
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

    // Daftar kolom yang wajib diisi
    const requiredFields = ["foto_profil"];

    // Cek apakah semua kolom wajib terisi
    statusUploadFoto = requiredFields.every((field) => camaba[field] !== null && camaba[field] !== "");

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Status Foto Profil By Camaba Active Success:`,
      data: statusUploadFoto,
    });
  } catch (error) {
    next(error);
  }
};

// camaba
const getStatusProdiCamabaByCamabaActive = async (req, res, next) => {
  try {
    let statusProdiCamaba = false;
    const user = req.user;

    // Dapatkan role camaba
    const roleCamaba = await Role.findOne({
      where: { nama_role: "camaba" },
    });

    if (!roleCamaba) {
      return res.status(404).json({
        message: "Role Camaba not found",
      });
    }

    // Cek apakah user adalah camaba
    const userRole = await UserRole.findOne({
      where: { id_user: user.id, id_role: roleCamaba.id },
    });

    if (!userRole) {
      return res.status(404).json({
        message: "User is not Camaba",
      });
    }

    // Ambil data camaba berdasarkan nomor_daftar
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

    // get data prodi camaba
    const prodiCamaba = await ProdiCamaba.findOne({
      where: { id_camaba: camaba.id },
    });

    if (!prodiCamaba) {
      statusProdiCamaba = false;
    } else {
      statusProdiCamaba = true;
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Status Prodi Camaba By Camaba Active Success:`,
      data: statusProdiCamaba,
    });
  } catch (error) {
    next(error);
  }
};

// camaba
const getStatusBerkasCamabaByCamabaActive = async (req, res, next) => {
  try {
    let statusBerkasCamaba = false;
    const user = req.user;

    // Dapatkan role camaba
    const roleCamaba = await Role.findOne({
      where: { nama_role: "camaba" },
    });

    if (!roleCamaba) {
      return res.status(404).json({
        message: "Role Camaba not found",
      });
    }

    // Cek apakah user adalah camaba
    const userRole = await UserRole.findOne({
      where: { id_user: user.id, id_role: roleCamaba.id },
    });

    if (!userRole) {
      return res.status(404).json({
        message: "User is not Camaba",
      });
    }

    // Ambil data camaba berdasarkan nomor_daftar
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

    // Dapatkan data berkas periode pendaftaran
    const berkasPeriodePendaftaran = await BerkasPeriodePendaftaran.findAll({
      where: {
        id_periode_pendaftaran: camaba.id_periode_pendaftaran,
      },
    });

    if (!berkasPeriodePendaftaran || berkasPeriodePendaftaran.length === 0) {
      return res.status(404).json({
        message: "Berkas Periode Pendaftaran not found",
      });
    }

    // Dapatkan data pemberkasan camaba yang telah diupload
    const pemberkasanCamabas = await PemberkasanCamaba.findAll({
      where: {
        id_camaba: camaba.id,
      },
    });

    if (!pemberkasanCamabas || pemberkasanCamabas.length === 0) {
      return res.status(404).json({
        message: "Pemberkasan Camaba not found",
      });
    }

    // Membandingkan ID dari berkasPeriodePendaftaran dan pemberkasanCamabas
    const requiredBerkasIds = berkasPeriodePendaftaran.map((berkas) => berkas.id);
    const uploadedBerkasIds = pemberkasanCamabas.map((pemberkasan) => pemberkasan.id_berkas_periode_pendaftaran);

    // Cek apakah semua berkas yang diperlukan sudah di-upload
    const isAllBerkasUploaded = requiredBerkasIds.length === uploadedBerkasIds.length && requiredBerkasIds.every((id) => uploadedBerkasIds.includes(id));

    // Set statusBerkasCamaba berdasarkan hasil pengecekan
    statusBerkasCamaba = isAllBerkasUploaded;

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Status Berkas Camaba By Camaba Active Success:`,
      data: statusBerkasCamaba,
    });
  } catch (error) {
    next(error);
  }
};

// camaba
const getStatusFinalisasiByCamabaActive = async (req, res, next) => {
  try {
    let statusFinalisasi = false;
    const user = req.user;

    // Dapatkan role camaba
    const roleCamaba = await Role.findOne({
      where: { nama_role: "camaba" },
    });

    if (!roleCamaba) {
      return res.status(404).json({
        message: "Role Camaba not found",
      });
    }

    // Cek apakah user adalah camaba
    const userRole = await UserRole.findOne({
      where: { id_user: user.id, id_role: roleCamaba.id },
    });

    if (!userRole) {
      return res.status(404).json({
        message: "User is not Camaba",
      });
    }

    // Ambil data camaba berdasarkan nomor_daftar
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

    statusFinalisasi = camaba.finalisasi;

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Status Finalisasi By Camaba Active Success:`,
      data: statusFinalisasi,
    });
  } catch (error) {
    next(error);
  }
};

// admin, admin-pmb
const getAllCamabaByPeriodePendaftaranId = async (req, res, next) => {
  try {
    const periodePendaftaranId = req.params.id_periode_pendaftaran;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required",
      });
    }

    // Ambil semua data camabas dari database
    const camabas = await Camaba.findAll({
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] },
      ],
      where: {
        id_periode_pendaftaran: periodePendaftaranId,
      },
    });

    if (!camabas || camabas.length === 0) {
      return res.status(404).json({
        message: `<===== Camaba Not Found`,
      });
    }

    // Loop melalui setiap camaba untuk mendapatkan prodi pertama mereka
    const camabaWithProdi = await Promise.all(
      camabas.map(async (camaba) => {
        // Ambil prodi pertama berdasarkan id_camaba
        const prodi_camaba = await ProdiCamaba.findOne({
          where: {
            id_camaba: camaba.id,
          },
          order: [["createdAt", "ASC"]], // Mengambil berdasarkan urutan (prodi pertama)
        });

        // Jika prodi_camaba ditemukan, tambahkan ke data camaba
        return {
          ...camaba.toJSON(), // Konversi instance Sequelize menjadi JSON
          ProdiCamaba: prodi_camaba || null, // Tambahkan ProdiCamaba atau null jika tidak ditemukan
        };
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Camaba By Periode Pendaftaran ID ${periodePendaftaranId} Success`,
      jumlahData: camabaWithProdi.length,
      data: camabaWithProdi,
    });
  } catch (error) {
    next(error);
  }
};

// admin, admin-pmb
const cetakKartuUjianByCamabaId = async (req, res, next) => {
  try {
    const camabaId = req.params.id_camaba;

    if (!camabaId) {
      return res.status(400).json({
        message: "Camaba ID is required",
      });
    }

    const camaba = await Camaba.findOne({
      where: {
        id: camabaId,
      },
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }, { model: JalurMasuk }, { model: SistemKuliah }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] },
      ],
    });

    if (!camaba) {
      return res.status(404).json({
        message: "Camaba not found",
      });
    }

    // get biodata camaba
    const biodata_camaba = await BiodataCamaba.findOne({
      where: {
        id_camaba: camaba.id,
      },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!biodata_camaba) {
      return res.status(404).json({
        message: `<===== Biodata Camaba Not Found:`,
      });
    }

    // get data periode pendaftaran
    const periode_pendaftaran = await PeriodePendaftaran.findOne({
      where: {
        id: camaba.id_periode_pendaftaran,
      },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Periode Pendaftaran Not Found:`,
      });
    }

    // get tahap tes periode pendaftaran
    const tahap_tes_periode_pendaftaran = await TahapTesPeriodePendaftaran.findAll({
      where: {
        id_periode_pendaftaran: periode_pendaftaran.id,
      },
      include: [{ model: JenisTes }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!tahap_tes_periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Tahap Tes Periode Pendaftaran Not Found:`,
      });
    }

    // get data Prodi Camaba
    const prodiCamaba = await ProdiCamaba.findAll({
      where: { id_camaba: camaba.id },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!prodiCamaba) {
      return res.status(404).json({
        message: `<===== Prodi Camaba Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== Cetak Kartu Ujian By ID Camaba ${camabaId} Success:`,
      dataCamaba: camaba,
      dataBiodataCamaba: biodata_camaba,
      dataProdiCamaba: prodiCamaba,
      dataTahapTes: tahap_tes_periode_pendaftaran,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCamabaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const camabaId = req.params.id_camaba;

    if (!camabaId) {
      return res.status(400).json({
        message: "Camaba ID is required",
      });
    }

    // Cari data camaba berdasarkan ID di database
    let camaba = await Camaba.findByPk(camabaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!camaba) {
      return res.status(404).json({
        message: `<===== Camaba With ID ${camabaId} Not Found:`,
      });
    }

    // Hapus data camaba dari database
    await camaba.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Camaba With ID ${camabaId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

// Fungsi untuk mengkonversi tanggal_lahir
const convertTanggal = (tanggal_lahir) => {
  const dateParts = tanggal_lahir.split("-");
  const tanggal = dateParts[2];
  const bulan = dateParts[1];
  const tahun = dateParts[0];
  return `${tanggal}${bulan}${tahun}`;
};

module.exports = {
  getAllCamaba,
  getAllCamabaByFilter,
  getCamabaById,
  createCamaba,
  getCamabaActiveByUser,
  updateProfileCamabaActive,
  finalisasiByCamabaActive,
  updateStatusKelulusanPendaftar,
  cetakFormPendaftaranByCamabaActive,
  cetakKartuUjianByCamabaActive,
  exportCamabaByPeriodePendaftaranId,
  importCamabaForUpdateNimKolektif,
  exportCamabaForMahasiswaByPeriodePendaftaranId,
  getFinalisasiByCamabaActive,
  getStatusBiodataCamabaByCamabaActive,
  getStatusUploadFotoByCamabaActive,
  getStatusProdiCamabaByCamabaActive,
  getStatusBerkasCamabaByCamabaActive,
  getStatusFinalisasiByCamabaActive,
  getAllCamabaByPeriodePendaftaranId,
  cetakKartuUjianByCamabaId,
  deleteCamabaById,
};
