const { Camaba, User, SettingWSFeeder, PeriodePendaftaran, Prodi, ProdiCamaba, JenjangPendidikan, Semester, Role, UserRole } = require("../../models");
const bcrypt = require("bcrypt");

// admin, admin-pmb
const getAllCamaba = async (req, res, next) => {
  try {
    // Ambil semua data camabas dari database
    const camabas = await Camaba.findAll({
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] }
      ]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Camaba Success",
      jumlahData: camabas.length,
      data: camabas
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
        message: "Camaba ID is required"
      });
    }

    // Cari data camaba berdasarkan ID di database
    const camaba = await Camaba.findByPk(camabaId, {
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] }
      ]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!camaba) {
      return res.status(404).json({
        message: `<===== Camaba With ID ${camabaId} Not Found:`
      });
    }

    // get data Prodi Camaba
    const prodiCamaba = await ProdiCamaba.findAll({
      where: { id_camaba: camabaId },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!prodiCamaba) {
      return res.status(404).json({
        message: `<===== Prodi Camaba With Camaba ID ${camabaId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Camaba By ID ${camabaId} Success:`,
      data: camaba,
      prodiCamaba: prodiCamaba
    });
  } catch (error) {
    next(error);
  }
};

// guest
const createCamaba = async (req, res, next) => {
  const { nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, nomor_hp, email, prodi = [] } = req.body;

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

  try {
    const periodePendaftaranId = req.params.id_periode_pendaftaran;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required"
      });
    }

    const periode_pendaftaran = await PeriodePendaftaran.findOne({
      where: {
        id: periodePendaftaranId
      }
    });

    if (!periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Periode Pendaftaran With ID ${periodePendaftaranId} Not Found:`
      });
    }

    const setting_ws_feeder_aktif = await SettingWSFeeder.findOne({
      where: { status: true }
    });

    if (!setting_ws_feeder_aktif) {
      return res.status(404).json({
        message: `<===== Setting WS Feeder Aktif Not Found:`
      });
    }

    const role = await Role.findOne({
      where: { nama_role: "camaba" }
    });

    if (!role) {
      return res.status(404).json({
        message: `<===== Role Camaba Not Found:`
      });
    }

    // Fungsi untuk menghasilkan nomor daftar
    const generateNomorDaftar = async (setting_ws_feeder_aktif, periode_pendaftaran) => {
      const usernameFeeder = setting_ws_feeder_aktif.username_feeder;
      const semesterId = periode_pendaftaran.id_semester.toString().slice(-3);

      const lastCamaba = await Camaba.findOne({
        where: { id_periode_pendaftaran: periode_pendaftaran.id },
        order: [["nomor_daftar", "DESC"]]
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
      id_periode_pendaftaran: periodePendaftaranId
    });

    // Buat data user baru
    const newUser = await User.create({
      nama: newCamaba.nama_lengkap,
      username: newCamaba.nomor_daftar,
      password: hashedPassword,
      hints: tanggal_lahir_format,
      email: null,
      status: true
    });

    await UserRole.create({
      id_role: role.id,
      id_user: newUser.id
    });

    // Variabel untuk menyimpan prodi yang berhasil ditambahkan
    let prodiCamaba = [];

    // Tambah data Prodi
    if (prodi.length > 0) {
      prodiCamaba = await Promise.all(
        prodi.map(async ({ id_prodi }) => {
          const data_prodi = await Prodi.findOne({
            where: { id_prodi: id_prodi }
          });

          if (data_prodi) {
            await ProdiCamaba.create({
              id_prodi: data_prodi.id_prodi,
              id_camaba: newCamaba.id
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

    res.status(201).json({
      message: "<===== CREATE Camaba Success",
      dataCamaba: newCamaba,
      dataProdiCamaba: prodiCamaba
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
  getCamabaById,
  createCamaba
};
