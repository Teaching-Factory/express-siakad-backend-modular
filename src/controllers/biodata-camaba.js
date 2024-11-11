const { BiodataCamaba, Camaba, Sekolah, Wilayah, JenisTinggal, JenjangPendidikan, Pekerjaan, Penghasilan, Agama, Role, UserRole, JalurMasuk, SistemKuliah, Prodi, ProdiCamaba, PeriodePendaftaran, Semester } = require("../../models");

const getAllBiodataCamaba = async (req, res, next) => {
  try {
    // Ambil semua data biodata_camabas dari database
    const biodata_camabas = await BiodataCamaba.findAll({
      include: [
        { model: Camaba },
        { model: Sekolah },
        { model: Agama },
        { model: Wilayah },
        { model: JenisTinggal },
        {
          model: Penghasilan,
          as: "PenghasilanAyah", // Alias untuk penghasilan ayah
          foreignKey: "id_penghasilan_ayah",
        },
        {
          model: Penghasilan,
          as: "PenghasilanIbu", // Alias untuk penghasilan ibu
          foreignKey: "id_penghasilan_ibu",
        },
        {
          model: Penghasilan,
          as: "PenghasilanWali", // Alias untuk penghasilan wali
          foreignKey: "id_penghasilan_wali",
        },
        {
          model: Pekerjaan,
          as: "PekerjaanAyah", // Alias untuk pekerjaan ayah
          foreignKey: "id_pekerjaan_ayah",
        },
        {
          model: Pekerjaan,
          as: "PekerjaanIbu", // Alias untuk pekerjaan ibu
          foreignKey: "id_pekerjaan_ibu",
        },
        {
          model: Pekerjaan,
          as: "PekerjaanWali", // Alias untuk pekerjaan wali
          foreignKey: "id_pekerjaan_wali",
        },
        {
          model: JenjangPendidikan,
          as: "PendidikanAyah", // Alias untuk pendidikan ayah
          foreignKey: "id_pendidikan_ayah",
        },
        {
          model: JenjangPendidikan,
          as: "PendidikanIbu", // Alias untuk pendidikan ibu
          foreignKey: "id_pendidikan_ibu",
        },
        {
          model: JenjangPendidikan,
          as: "PendidikanWali", // Alias untuk pendidikan wali
          foreignKey: "id_pendidikan_wali",
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Biodata Camaba Success",
      jumlahData: biodata_camabas.length,
      data: biodata_camabas,
    });
  } catch (error) {
    next(error);
  }
};

const getBiodataCamabaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const biodataCamabaId = req.params.id;

    if (!biodataCamabaId) {
      return res.status(400).json({
        message: "Biodata Camaba ID is required",
      });
    }

    // Cari data biodata_camaba berdasarkan ID di database
    const biodata_camaba = await BiodataCamaba.findByPk(biodataCamabaId, {
      include: [
        { model: Camaba },
        { model: Sekolah },
        { model: Agama },
        { model: Wilayah },
        { model: JenisTinggal },
        {
          model: Penghasilan,
          as: "PenghasilanAyah", // Alias untuk penghasilan ayah
          foreignKey: "id_penghasilan_ayah",
        },
        {
          model: Penghasilan,
          as: "PenghasilanIbu", // Alias untuk penghasilan ibu
          foreignKey: "id_penghasilan_ibu",
        },
        {
          model: Penghasilan,
          as: "PenghasilanWali", // Alias untuk penghasilan wali
          foreignKey: "id_penghasilan_wali",
        },
        {
          model: Pekerjaan,
          as: "PekerjaanAyah", // Alias untuk pekerjaan ayah
          foreignKey: "id_pekerjaan_ayah",
        },
        {
          model: Pekerjaan,
          as: "PekerjaanIbu", // Alias untuk pekerjaan ibu
          foreignKey: "id_pekerjaan_ibu",
        },
        {
          model: Pekerjaan,
          as: "PekerjaanWali", // Alias untuk pekerjaan wali
          foreignKey: "id_pekerjaan_wali",
        },
        {
          model: JenjangPendidikan,
          as: "PendidikanAyah", // Alias untuk pendidikan ayah
          foreignKey: "id_pendidikan_ayah",
        },
        {
          model: JenjangPendidikan,
          as: "PendidikanIbu", // Alias untuk pendidikan ibu
          foreignKey: "id_pendidikan_ibu",
        },
        {
          model: JenjangPendidikan,
          as: "PendidikanWali", // Alias untuk pendidikan wali
          foreignKey: "id_pendidikan_wali",
        },
      ],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!biodata_camaba) {
      return res.status(404).json({
        message: `<===== Biodata Camaba With ID ${biodataCamabaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Biodata Camaba By ID ${biodataCamabaId} Success:`,
      data: biodata_camaba,
    });
  } catch (error) {
    next(error);
  }
};

const getBiodataCamabaByActiveUser = async (req, res, next) => {
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

    const biodata_camaba = await BiodataCamaba.findOne({
      include: [
        {
          model: Camaba,
          where: {
            nomor_daftar: user.username,
          },
        },
        { model: Sekolah },
        { model: Agama },
        { model: Wilayah },
        { model: JenisTinggal },
        {
          model: Penghasilan,
          as: "PenghasilanAyah", // Alias untuk penghasilan ayah
          foreignKey: "id_penghasilan_ayah",
        },
        {
          model: Penghasilan,
          as: "PenghasilanIbu", // Alias untuk penghasilan ibu
          foreignKey: "id_penghasilan_ibu",
        },
        {
          model: Penghasilan,
          as: "PenghasilanWali", // Alias untuk penghasilan wali
          foreignKey: "id_penghasilan_wali",
        },
        {
          model: Pekerjaan,
          as: "PekerjaanAyah", // Alias untuk pekerjaan ayah
          foreignKey: "id_pekerjaan_ayah",
        },
        {
          model: Pekerjaan,
          as: "PekerjaanIbu", // Alias untuk pekerjaan ibu
          foreignKey: "id_pekerjaan_ibu",
        },
        {
          model: Pekerjaan,
          as: "PekerjaanWali", // Alias untuk pekerjaan wali
          foreignKey: "id_pekerjaan_wali",
        },
        {
          model: JenjangPendidikan,
          as: "PendidikanAyah", // Alias untuk pendidikan ayah
          foreignKey: "id_pendidikan_ayah",
        },
        {
          model: JenjangPendidikan,
          as: "PendidikanIbu", // Alias untuk pendidikan ibu
          foreignKey: "id_pendidikan_ibu",
        },
        {
          model: JenjangPendidikan,
          as: "PendidikanWali", // Alias untuk pendidikan wali
          foreignKey: "id_pendidikan_wali",
        },
      ],
    });

    if (!biodata_camaba) {
      return res.status(404).json({
        message: "Biodata Camaba not found",
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Biodata Camaba Active Success:`,
      data: biodata_camaba,
    });
  } catch (error) {
    next(error);
  }
};

const updateDataDiriCamabaByCamabaActive = async (req, res, next) => {
  const {
    // kolom camaba
    nama_lengkap,
    tempat_lahir,
    tanggal_lahir,
    jenis_kelamin,
    // nomor_hp
    // email

    // kolom biodata camaba
    id_agama,
    nama_ibu_kandung,
    nik,
    nisn,
    npwp,
    kewarganegaraan,
    jalan,
    dusun,
    rt,
    rw,
    kelurahan,
    id_wilayah,
    kode_pos,
    telepon,
    handphone, // update nomor_hp di camaba
    email, // update email di camaba
    id_jenis_tinggal,
    id_sekolah,
  } = req.body;

  if (!nama_lengkap) {
    return res.status(400).json({ message: "nama_lengkap is required" });
  }
  if (!tempat_lahir) {
    return res.status(400).json({ message: "tempat_lahir is required" });
  }
  if (!tanggal_lahir) {
    return res.status(400).json({ message: "tanggal_lahir is required" });
  }
  if (!nik) {
    return res.status(400).json({ message: "nik is required" });
  }
  if (!nisn) {
    return res.status(400).json({ message: "nisn is required" });
  }
  if (!kewarganegaraan) {
    return res.status(400).json({ message: "kewarganegaraan is required" });
  }
  if (!kelurahan) {
    return res.status(400).json({ message: "kelurahan is required" });
  }
  if (!id_wilayah) {
    return res.status(400).json({ message: "id_wilayah is required" });
  }
  if (!id_agama) {
    return res.status(400).json({ message: "id_agama is required" });
  }
  if (!nama_ibu_kandung) {
    return res.status(400).json({ message: "nama_ibu_kandung is required" });
  }
  if (!email) {
    return res.status(400).json({ message: "email is required" });
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

    // get data camaba
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
    const biodata_camaba = await BiodataCamaba.findOne({
      where: {
        id_camaba: camaba.id,
      },
    });

    if (!biodata_camaba) {
      return res.status(404).json({
        message: "Biodata Camaba not found",
      });
    }

    // update data camaba
    camaba.nama_lengkap = nama_lengkap;
    camaba.tempat_lahir = tempat_lahir;
    camaba.tanggal_lahir = tanggal_lahir;
    camaba.jenis_kelamin = jenis_kelamin;
    camaba.email = email;
    camaba.nomor_hp = handphone;

    // Simpan perubahan data camaba ke dalam database
    await camaba.save();

    // update data biodata_camaba
    biodata_camaba.id_agama = id_agama;
    biodata_camaba.nama_ibu_kandung = nama_ibu_kandung;
    biodata_camaba.nik = nik;
    biodata_camaba.nisn = nisn;
    biodata_camaba.npwp = npwp;
    biodata_camaba.kewarganegaraan = kewarganegaraan;
    biodata_camaba.jalan = jalan;
    biodata_camaba.dusun = dusun;
    biodata_camaba.rt = rt;
    biodata_camaba.rw = rw;
    biodata_camaba.kelurahan = kelurahan;
    biodata_camaba.id_wilayah = id_wilayah;
    biodata_camaba.kode_pos = kode_pos;
    biodata_camaba.telepon = telepon;
    biodata_camaba.handphone = handphone;
    biodata_camaba.email = email;
    biodata_camaba.id_jenis_tinggal = id_jenis_tinggal;
    biodata_camaba.id_sekolah = id_sekolah;

    // Simpan perubahan data biodata_camaba ke dalam database
    await biodata_camaba.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Data Diri Camaba Success:`,
      camabaNew: camaba,
      biodataCamabaNew: biodata_camaba,
    });
  } catch (error) {
    next(error);
  }
};

const updateDataOrtuCamabaByCamabaActive = async (req, res, next) => {
  const {
    // data orang tua,
    // data ayah,
    nik_ayah,
    nama_ayah,
    tanggal_lahir_ayah,
    id_pendidikan_ayah,
    id_pekerjaan_ayah,
    id_penghasilan_ayah,

    //data ibu
    nik_ibu,
    tanggal_lahir_ibu,
    id_pendidikan_ibu,
    id_pekerjaan_ibu,
    id_penghasilan_ibu,

    // data wali
    nama_wali,
    tanggal_lahir_wali,
    id_pendidikan_wali,
    id_pekerjaan_wali,
    id_penghasilan_wali,
  } = req.body;

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

    // get biodata camaba
    const biodata_camaba = await BiodataCamaba.findOne({
      include: [
        {
          model: Camaba,
          where: {
            nomor_daftar: user.username,
          },
        },
      ],
    });

    if (!biodata_camaba) {
      return res.status(404).json({
        message: "Biodata Camaba not found",
      });
    }

    // update data biodata_camaba
    biodata_camaba.nik_ayah = nik_ayah;
    biodata_camaba.nama_ayah = nama_ayah;
    biodata_camaba.tanggal_lahir_ayah = tanggal_lahir_ayah;
    biodata_camaba.id_pendidikan_ayah = id_pendidikan_ayah;
    biodata_camaba.id_pekerjaan_ayah = id_pekerjaan_ayah;
    biodata_camaba.id_penghasilan_ayah = id_penghasilan_ayah;

    biodata_camaba.nik_ibu = nik_ibu;
    biodata_camaba.tanggal_lahir_ibu = tanggal_lahir_ibu;
    biodata_camaba.id_pendidikan_ibu = id_pendidikan_ibu;
    biodata_camaba.id_pekerjaan_ibu = id_pekerjaan_ibu;
    biodata_camaba.id_penghasilan_ibu = id_penghasilan_ibu;

    biodata_camaba.nama_wali = nama_wali;
    biodata_camaba.tanggal_lahir_wali = tanggal_lahir_wali;
    biodata_camaba.id_pendidikan_wali = id_pendidikan_wali;
    biodata_camaba.id_pekerjaan_wali = id_pekerjaan_wali;
    biodata_camaba.id_penghasilan_wali = id_penghasilan_wali;

    // Simpan perubahan data biodata_camaba ke dalam database
    await biodata_camaba.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Data Ortu Camaba Success:`,
      biodataCamabaNew: biodata_camaba,
    });
  } catch (error) {
    next(error);
  }
};

// camaba
const cetakBiodataByCamabaActive = async (req, res, next) => {
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

    // get biodata camaba
    const biodata_camaba = await BiodataCamaba.findOne({
      where: {
        id_camaba: camaba.id,
      },
      include: [
        { model: Sekolah },
        { model: Agama },
        { model: Wilayah },
        { model: JenisTinggal },
        {
          model: Penghasilan,
          as: "PenghasilanAyah", // Alias untuk penghasilan ayah
          foreignKey: "id_penghasilan_ayah",
        },
        {
          model: Penghasilan,
          as: "PenghasilanIbu", // Alias untuk penghasilan ibu
          foreignKey: "id_penghasilan_ibu",
        },
        {
          model: Penghasilan,
          as: "PenghasilanWali", // Alias untuk penghasilan wali
          foreignKey: "id_penghasilan_wali",
        },
        {
          model: Pekerjaan,
          as: "PekerjaanAyah", // Alias untuk pekerjaan ayah
          foreignKey: "id_pekerjaan_ayah",
        },
        {
          model: Pekerjaan,
          as: "PekerjaanIbu", // Alias untuk pekerjaan ibu
          foreignKey: "id_pekerjaan_ibu",
        },
        {
          model: Pekerjaan,
          as: "PekerjaanWali", // Alias untuk pekerjaan wali
          foreignKey: "id_pekerjaan_wali",
        },
        {
          model: JenjangPendidikan,
          as: "PendidikanAyah", // Alias untuk pendidikan ayah
          foreignKey: "id_pendidikan_ayah",
        },
        {
          model: JenjangPendidikan,
          as: "PendidikanIbu", // Alias untuk pendidikan ibu
          foreignKey: "id_pendidikan_ibu",
        },
        {
          model: JenjangPendidikan,
          as: "PendidikanWali", // Alias untuk pendidikan wali
          foreignKey: "id_pendidikan_wali",
        },
      ],
    });

    if (!biodata_camaba) {
      return res.status(404).json({
        message: "Biodata Camaba not found",
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
      message: `<===== Cetak Camaba Active Success:`,
      dataCamaba: camaba,
      dataBiodataCamaba: biodata_camaba,
      dataProdiCamaba: prodiCamaba,
    });
  } catch (error) {
    next(error);
  }
};

// admin, admin-pmb
const cetakBiodataByCamabaId = async (req, res, next) => {
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
      include: [
        { model: Sekolah },
        { model: Agama },
        { model: Wilayah },
        { model: JenisTinggal },
        {
          model: Penghasilan,
          as: "PenghasilanAyah", // Alias untuk penghasilan ayah
          foreignKey: "id_penghasilan_ayah",
        },
        {
          model: Penghasilan,
          as: "PenghasilanIbu", // Alias untuk penghasilan ibu
          foreignKey: "id_penghasilan_ibu",
        },
        {
          model: Penghasilan,
          as: "PenghasilanWali", // Alias untuk penghasilan wali
          foreignKey: "id_penghasilan_wali",
        },
        {
          model: Pekerjaan,
          as: "PekerjaanAyah", // Alias untuk pekerjaan ayah
          foreignKey: "id_pekerjaan_ayah",
        },
        {
          model: Pekerjaan,
          as: "PekerjaanIbu", // Alias untuk pekerjaan ibu
          foreignKey: "id_pekerjaan_ibu",
        },
        {
          model: Pekerjaan,
          as: "PekerjaanWali", // Alias untuk pekerjaan wali
          foreignKey: "id_pekerjaan_wali",
        },
        {
          model: JenjangPendidikan,
          as: "PendidikanAyah", // Alias untuk pendidikan ayah
          foreignKey: "id_pendidikan_ayah",
        },
        {
          model: JenjangPendidikan,
          as: "PendidikanIbu", // Alias untuk pendidikan ibu
          foreignKey: "id_pendidikan_ibu",
        },
        {
          model: JenjangPendidikan,
          as: "PendidikanWali", // Alias untuk pendidikan wali
          foreignKey: "id_pendidikan_wali",
        },
      ],
    });

    if (!biodata_camaba) {
      return res.status(404).json({
        message: "Biodata Camaba not found",
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
      message: `<===== Cetak Biodata Camaba By ID Camaba ${camabaId} Success:`,
      dataCamaba: camaba,
      dataBiodataCamaba: biodata_camaba,
      dataProdiCamaba: prodiCamaba,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBiodataCamaba,
  getBiodataCamabaById,
  getBiodataCamabaByActiveUser,
  updateDataDiriCamabaByCamabaActive,
  updateDataOrtuCamabaByCamabaActive,
  cetakBiodataByCamabaActive,
  cetakBiodataByCamabaId,
};
