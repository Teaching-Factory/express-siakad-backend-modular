const {
  KRSMahasiswa,
  TahunAjaran,
  Mahasiswa,
  Prodi,
  KelasKuliah,
  Sequelize,
  MataKuliah,
  BiodataMahasiswa,
  PerguruanTinggi,
  Agama,
  PesertaKelasKuliah,
  Dosen,
  DetailKelasKuliah,
  RuangPerkuliahan,
  Semester,
  SettingGlobalSemester,
  RekapKRSMahasiswa,
} = require("../../models");

const getAllKRSMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data krs_mahasiswa dari database
    const krs_mahasiswa = await KRSMahasiswa.findAll({ include: [{ model: Mahasiswa }, { model: Semester }, { model: Prodi }, { model: MataKuliah }, { model: KelasKuliah }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All KRS Mahasiswa Success",
      jumlahData: krs_mahasiswa.length,
      data: krs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getKRSMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const KRSMahasiswaId = req.params.id;

    if (!KRSMahasiswaId) {
      return res.status(400).json({
        message: "KRS Mahasiswa ID is required",
      });
    }

    // Cari data krs_mahasiswa berdasarkan ID di database
    const krs_mahasiswa = await KRSMahasiswa.findByPk(KRSMahasiswaId, {
      include: [{ model: Mahasiswa }, { model: Semester }, { model: Prodi }, { model: MataKuliah }, { model: KelasKuliah }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!krs_mahasiswa) {
      return res.status(404).json({
        message: `<===== KRS Mahasiswa With ID ${KRSMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET KRS Mahasiswa By ID ${KRSMahasiswaId} Success:`,
      data: krs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getKRSMahasiswaByMahasiswaId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const idRegistrasiMahasiswa = req.params.id_registrasi_mahasiswa;

    if (!idRegistrasiMahasiswa) {
      return res.status(400).json({
        message: "ID Registrasi Mahasiswa is required",
      });
    }

    // mengambil data semester aktif
    const semesterAktif = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    // Cari data krs_mahasiswa berdasarkan id_registrasi_mahasiswa dan id_tahun_ajaran di database
    const krsMahasiswa = await KRSMahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: idRegistrasiMahasiswa,
        id_semester: semesterAktif.id_semester_krs,
      },
      include: [{ model: Mahasiswa }, { model: Semester }, { model: Prodi }, { model: MataKuliah }, { model: KelasKuliah, include: [{ model: DetailKelasKuliah }] }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!krsMahasiswa || krsMahasiswa.length === 0) {
      return res.status(404).json({
        message: `<===== KRS Mahasiswa With ID ${idRegistrasiMahasiswa} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET KRS Mahasiswa By ID ${idRegistrasiMahasiswa} Success:`,
      jumlahData: krsMahasiswa.length,
      data: krsMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

// get mahasiswa
const getAllMahasiswaKRSBySemester = async (req, res, next) => {
  try {
    // Ambil tahun ajaran yang sesuai dengan kondisi
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    // Ekstrak tahun awal dari nama_tahun_ajaran
    const [tahunAwal] = tahunAjaran.nama_tahun_ajaran.split("/");

    // Ambil semua semester yang sesuai dengan tahun awal
    const semesters = await Semester.findAll({
      where: {
        id_semester: {
          [Sequelize.Op.like]: `${tahunAwal}%`,
        },
      },
    });

    // Ambil semua id_semester dari hasil query semester
    const idSemesters = semesters.map((semester) => semester.id_semester);

    // Ambil data KRS mahasiswa berdasarkan id_semester yang didapatkan
    const krs_mahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_semester: idSemesters,
      },
    });

    // Ekstrak id_registrasi_mahasiswa dan simpan dalam sebuah Set untuk menghindari duplikasi
    const idRegistrasiMahasiswas = new Set(krs_mahasiswas.map((krs) => krs.id_registrasi_mahasiswa));

    // Ambil data mahasiswa berdasarkan id_registrasi_mahasiswa yang unik
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: Array.from(idRegistrasiMahasiswas),
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Mahasiswa KRS By Semester Success",
      jumlahData: mahasiswas.length,
      data: mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const GetKRSMahasiswaByMahasiswaSemester = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const mahasiswaId = req.params.id_registrasi_mahasiswa;

    if (!mahasiswaId) {
      return res.status(400).json({
        message: "ID Registrasi Mahasiswa is required",
      });
    }

    // Ambil tahun ajaran yang sesuai dengan kondisi
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    // Ekstrak tahun awal dari nama_tahun_ajaran
    const [tahunAwal] = tahunAjaran.nama_tahun_ajaran.split("/");

    // Ambil semua semester yang sesuai dengan tahun awal
    const semesters = await Semester.findAll({
      where: {
        id_semester: {
          [Sequelize.Op.like]: `${tahunAwal}%`,
        },
      },
    });

    // Ambil semua id_semester dari hasil query semester
    const idSemesters = semesters.map((semester) => semester.id_semester);

    // Ambil data KRS mahasiswa berdasarkan id_semester yang didapatkan
    const krs_mahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_semester: idSemesters,
        id_registrasi_mahasiswa: mahasiswaId,
      },
      include: [
        { model: Mahasiswa },
        { model: Semester },
        { model: Prodi },
        { model: MataKuliah },
        {
          model: KelasKuliah,
          include: [
            { model: MataKuliah },
            { model: Dosen },
            {
              model: DetailKelasKuliah,
              where: {
                id_kelas_kuliah: Sequelize.col("KelasKuliah.id_kelas_kuliah"),
              },
              include: [{ model: RuangPerkuliahan }],
            },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All KRS Mahasiswa By Mahasiswa Semester Success",
      jumlahData: krs_mahasiswas.length,
      data: krs_mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const deleteKRSMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const krsMahasiswaId = req.params.id;

    if (!krsMahasiswaId) {
      return res.status(400).json({
        message: "KRS Mahasiswa ID is required",
      });
    }

    // Cari data krs_mahasiswa berdasarkan ID di database
    let krs_mahasiswa = await KRSMahasiswa.findByPk(krsMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!krs_mahasiswa) {
      return res.status(404).json({
        message: `<===== KRS Mahasiswa With ID ${krsMahasiswaId} Not Found:`,
      });
    }

    // Hapus data krs_mahasiswa dari database
    await krs_mahasiswa.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE KRS Mahasiswa With ID ${krsMahasiswaId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

const validasiKRSMahasiswa = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;
    const semesterId = req.params.id_semester;

    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    // Dapatkan array mahasiswa dari body permintaan
    const mahasiswas = req.body.mahasiswas;
    let krs_mahasiswas = [];

    // Lakukan iterasi melalui setiap objek mahasiswa
    for (const mahasiswa of mahasiswas) {
      // Ambil ID registrasi mahasiswa dari objek mahasiswa saat ini
      const id_registrasi_mahasiswa = mahasiswa.id_registrasi_mahasiswa;

      // Ambil data KRS mahasiswa berdasarkan id_semester, id_prodi dan id_registrasi_mahasiswa
      const krs_mahasiswa = await KRSMahasiswa.findAll({
        where: {
          id_prodi: prodiId,
          id_semester: semesterId,
          id_registrasi_mahasiswa: id_registrasi_mahasiswa,
        },
        include: [{ model: Semester }],
      });

      // Tambahkan data KRS mahasiswa ke array krs_mahasiswas
      krs_mahasiswas = krs_mahasiswas.concat(krs_mahasiswa);
    }

    //  Lakukan iterasi melalui setiap objek KRS mahasiswa yang sudah diambil
    for (const krs_mahasiswa of krs_mahasiswas) {
      // pengecekan jumlah mahasiswa peserta kelas kuliah pada kelas kuliah
      let kelas_kuliah = await KelasKuliah.findOne({
        where: {
          id_kelas_kuliah: krs_mahasiswa.id_kelas,
        },
      });

      let mahasiswa = await Mahasiswa.findOne({
        where: {
          id_registrasi_mahasiswa: krs_mahasiswa.id_registrasi_mahasiswa,
        },
      });

      let tahunAwal = null;
      tahunAwal = mahasiswa.nama_periode_masuk.substring(0, 4);

      // Pastikan kelas_kuliah ditemukan sebelum melanjutkan
      if (!kelas_kuliah) {
        continue;
      }

      let jumlahPesertaKelasKuliah = await PesertaKelasKuliah.count({
        where: { id_kelas_kuliah: kelas_kuliah.id_kelas_kuliah },
      });

      if (jumlahPesertaKelasKuliah < kelas_kuliah.jumlah_mahasiswa) {
        // Ubah nilai validasi_krs menjadi true
        await krs_mahasiswa.update({ validasi_krs: true });

        // pengecekan data peserta kelas agar tidak duplikat
        pesertaKelas = await PesertaKelasKuliah.findOne({
          where: {
            angkatan: tahunAwal,
            id_registrasi_mahasiswa: krs_mahasiswa.id_registrasi_mahasiswa,
            id_kelas_kuliah: krs_mahasiswa.id_kelas,
          },
        });

        if (!pesertaKelas) {
          // proses penambahan data peserta kelas kuliah dari data krs milik mahasiswa
          await PesertaKelasKuliah.create({
            angkatan: tahunAwal,
            id_registrasi_mahasiswa: krs_mahasiswa.id_registrasi_mahasiswa,
            id_kelas_kuliah: krs_mahasiswa.id_kelas,
          });
        }
      }

      // pengecekan data rekap krs mahasiswa agar tidak duplikat
      let rekapKRSMahasiswa = await RekapKRSMahasiswa.findOne({
        where: {
          angkatan: tahunAwal,
          id_prodi: krs_mahasiswa.id_prodi,
          id_registrasi_mahasiswa: krs_mahasiswa.id_registrasi_mahasiswa,
          id_matkul: krs_mahasiswa.id_matkul,
          id_semester: krs_mahasiswa.id_semester,
        },
      });

      if (!rekapKRSMahasiswa) {
        // menambahkan data rekap krs mahasiswa
        await RekapKRSMahasiswa.create({
          angkatan: tahunAwal,
          id_prodi: krs_mahasiswa.id_prodi,
          id_registrasi_mahasiswa: krs_mahasiswa.id_registrasi_mahasiswa,
          id_matkul: krs_mahasiswa.id_matkul,
          id_semester: krs_mahasiswa.id_semester,
        });
      }
    }

    // Lakukan iterasi melalui setiap objek mahasiswa untuk update status mahasiswa
    for (const mahasiswa of mahasiswas) {
      let dataMahasiswa = await Mahasiswa.findOne({
        where: {
          id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
        },
      });

      dataMahasiswa.nama_status_mahasiswa = "AKTIF";

      // Simpan perubahan ke dalam database
      await dataMahasiswa.save();
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== VALIDASI KRS Mahasiswa Success",
      jumlahData: krs_mahasiswas.length,
      data: krs_mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const BatalkanValidasiKRSMahasiswa = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const mahasiswaId = req.params.id_registrasi_mahasiswa;
    const prodiId = req.params.id_prodi;
    const semesterId = req.params.id_semester;

    if (!mahasiswaId) {
      return res.status(400).json({
        message: "Mahasiswa ID is required",
      });
    }
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    // Ambil data KRS mahasiswa berdasarkan id_semester yang didapatkan
    const krs_mahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_prodi: prodiId,
        id_semester: semesterId,
        id_registrasi_mahasiswa: mahasiswaId,
      },
    });

    // Inisialisasi array untuk menyimpan data peserta kelas yang akan dihapus
    const pesertaKelasIds = [];
    const rekapKRSMahasiswaIds = [];

    // Ambil data peserta kelas kuliah yang sesuai dengan setiap KRS mahasiswa
    for (const krs_mahasiswa of krs_mahasiswas) {
      // Update validasi_krs menjadi false
      await krs_mahasiswa.update({ validasi_krs: false });

      const peserta_kelas = await PesertaKelasKuliah.findOne({
        where: {
          id_registrasi_mahasiswa: mahasiswaId,
          id_kelas_kuliah: krs_mahasiswa.id_kelas,
        },
      });

      if (peserta_kelas) {
        pesertaKelasIds.push(peserta_kelas.id_peserta_kuliah);
      }

      // mengambil data rekap krs mahasiswa
      const rekap_krs_mahasiswa = await RekapKRSMahasiswa.findOne({
        where: {
          id_prodi: krs_mahasiswa.id_prodi,
          id_registrasi_mahasiswa: krs_mahasiswa.id_registrasi_mahasiswa,
          id_matkul: krs_mahasiswa.id_matkul,
          id_semester: krs_mahasiswa.id_semester,
        },
      });

      if (rekap_krs_mahasiswa) {
        rekapKRSMahasiswaIds.push(rekap_krs_mahasiswa.id_rekap_krs_mahasiswa);
      }
    }

    // Hapus seluruh peserta_kelas_kuliah yang ditemukan
    await PesertaKelasKuliah.destroy({
      where: {
        id_peserta_kuliah: pesertaKelasIds,
      },
    });

    // Hapus seluruh rekap_krs_mahasiswa yang ditemukan
    await RekapKRSMahasiswa.destroy({
      where: {
        id_rekap_krs_mahasiswa: rekapKRSMahasiswaIds,
      },
    });

    // ubah status mahasiswa ke non aktif
    let mahasiswa = await Mahasiswa.findOne({
      where: {
        id_registrasi_mahasiswa: mahasiswaId,
      },
    });

    // Simpan perubahan ke dalam database
    if (mahasiswa) {
      mahasiswa.nama_status_mahasiswa = "Non-Aktif";
      await mahasiswa.save();
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== Batalkan VALIDASI KRS Mahasiswa Success",
      jumlahData: krs_mahasiswas.length,
      data: krs_mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const GetAllMahasiswaKRSTervalidasi = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;
    const semesterId = req.params.id_semester;

    // Ambil semua data KRS mahasiswa berdasarkan id_semester yang didapatkan
    const allKrsMahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_semester: semesterId,
        id_prodi: prodiId,
      },
    });

    // Group data KRS by id_registrasi_mahasiswa
    const krsByMahasiswa = allKrsMahasiswas.reduce((acc, krs) => {
      if (!acc[krs.id_registrasi_mahasiswa]) {
        acc[krs.id_registrasi_mahasiswa] = [];
      }
      acc[krs.id_registrasi_mahasiswa].push(krs);
      return acc;
    }, {});

    // Filter hanya mahasiswa yang seluruh KRS-nya validasi_krs adalah true
    const mahasiswaIdsWithAllKRSTrue = Object.keys(krsByMahasiswa).filter((id) => {
      return krsByMahasiswa[id].every((krs) => krs.validasi_krs === true);
    });

    // Ambil data mahasiswa berdasarkan ID yang difilter
    const mahasiswaData = await Mahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: {
          [Sequelize.Op.in]: mahasiswaIdsWithAllKRSTrue,
        },
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Mahasiswa with All KRS Validated Success =====>",
      jumlahData: mahasiswaData.length,
      data: mahasiswaData,
    });
  } catch (error) {
    next(error);
  }
};

const GetAllMahasiswaKRSBelumTervalidasi = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;
    const semesterId = req.params.id_semester;

    // Ambil semua data KRS mahasiswa berdasarkan id_semester yang didapatkan
    const allKrsMahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_semester: semesterId,
        id_prodi: prodiId,
      },
    });

    // Group data KRS by id_registrasi_mahasiswa
    const krsByMahasiswa = allKrsMahasiswas.reduce((acc, krs) => {
      if (!acc[krs.id_registrasi_mahasiswa]) {
        acc[krs.id_registrasi_mahasiswa] = [];
      }
      acc[krs.id_registrasi_mahasiswa].push(krs);
      return acc;
    }, {});

    // Filter hanya mahasiswa yang seluruh KRS-nya validasi_krs adalah false
    const mahasiswaIdsWithAllKRSFalse = Object.keys(krsByMahasiswa).filter((id) => {
      return krsByMahasiswa[id].every((krs) => krs.validasi_krs === false);
    });

    // Ambil data mahasiswa berdasarkan ID yang difilter
    const mahasiswaData = await Mahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: {
          [Sequelize.Op.in]: mahasiswaIdsWithAllKRSFalse,
        },
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Mahasiswa with All KRS Not Validated Success =====>",
      jumlahData: mahasiswaData.length,
      data: mahasiswaData,
    });
  } catch (error) {
    next(error);
  }
};

const getAllMahasiswaBelumKRS = async (req, res, next) => {
  try {
    // get data setting global semester
    const setting_global_semester = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    if (!setting_global_semester) {
      return res.status(404).json({
        message: "Setting Global Semester Aktif not found",
      });
    }

    // Ambil data KRS mahasiswa berdasarkan id_semester yang didapatkan
    const krs_mahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_semester: setting_global_semester.id_semester_krs,
      },
    });

    // Ekstrak id_registrasi_mahasiswa dari data KRS mahasiswa yang didapatkan
    const idRegistrasiMahasiswas = new Set(krs_mahasiswas.map((krs) => krs.id_registrasi_mahasiswa));

    // Ambil semua mahasiswa
    const allMahasiswas = await Mahasiswa.findAll({
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });

    // Filter mahasiswa yang belum melakukan KRS
    const mahasiswasBelumKRS = allMahasiswas.filter((mahasiswa) => !idRegistrasiMahasiswas.has(mahasiswa.id_registrasi_mahasiswa));

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Mahasiswa Belum KRS Success =====>",
      jumlahData: mahasiswasBelumKRS.length,
      data: mahasiswasBelumKRS,
    });
  } catch (error) {
    next(error);
  }
};

const getMahasiswaBelumKRSBySemesterAndProdiId = async (req, res, next) => {
  try {
    const semesterId = req.params.id_semester;
    const prodiId = req.params.id_prodi;

    if (!semesterId) {
      return res.status(400).json({ message: "Semester ID is required" });
    }
    if (!prodiId) {
      return res.status(400).json({ message: "Prodi ID is required" });
    }

    // Ambil data KRS mahasiswa berdasarkan id_semester dan id_prodi yang didapatkan
    const krs_mahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_semester: semesterId,
        id_prodi: prodiId,
      },
    });

    // Ekstrak id_registrasi_mahasiswa dari data KRS mahasiswa yang didapatkan
    const idRegistrasiMahasiswas = [];
    krs_mahasiswas.forEach((krs) => {
      if (!idRegistrasiMahasiswas.includes(krs.id_registrasi_mahasiswa)) {
        idRegistrasiMahasiswas.push(krs.id_registrasi_mahasiswa);
      }
    });

    // Ambil semua mahasiswa berdasarkan prodi
    const allMahasiswas = await Mahasiswa.findAll({
      where: {
        id_prodi: prodiId,
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });

    // Filter mahasiswa yang belum mengisi KRS
    const mahasiswasBelumKRS = allMahasiswas.filter((mahasiswa) => !idRegistrasiMahasiswas.includes(mahasiswa.id_registrasi_mahasiswa));

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Mahasiswa Belum KRS By Semester ID ${semesterId} And Prodi ID ${prodiId} Success =====>`,
      jumlahData: mahasiswasBelumKRS.length,
      data: mahasiswasBelumKRS,
    });
  } catch (error) {
    next(error);
  }
};

const createKRSMahasiswa = async (req, res, next) => {
  try {
    // Dapatkan id_registrasi_mahasiswa dari parameter URL
    const id_registrasi_mahasiswa = req.params.id_registrasi_mahasiswa;

    if (!id_registrasi_mahasiswa) {
      return res.status(400).json({
        message: "ID Registrasi Mahasiswa is required",
      });
    }

    // Dapatkan data kelas_kuliahs dari request body
    const { kelas_kuliahs } = req.body;

    // Mengambil data mahasiswa
    const mahasiswa = await Mahasiswa.findOne({
      where: {
        id_registrasi_mahasiswa,
      },
    });

    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa not found" });
    }

    // mengecek apakah status mahasiswa aktif atau tidak
    if (mahasiswa.nama_status_mahasiswa !== "Aktif" && mahasiswa.nama_status_mahasiswa !== "AKTIF") {
      return res.status(404).json({ message: "Status Mahasiswa Tidak Aktif" });
    }

    // get data setting global semester
    const setting_global_semester = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    if (!setting_global_semester) {
      return res.status(404).json({
        message: "Setting Global Semester Aktif not found",
      });
    }

    // Mengambil tahun ajaran yang sesuai dengan kondisi
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    if (!tahunAjaran) {
      return res.status(404).json({ message: "Tahun Ajaran not found" });
    }

    // Inisialisasi array untuk menyimpan data KRS yang akan dibuat
    const krsEntries = [];

    // Iterasi melalui data kelas_kuliahs dari request body
    for (const kelas of kelas_kuliahs) {
      // Mengambil data kelas kuliah berdasarkan id_kelas
      const kelas_kuliah = await KelasKuliah.findOne({
        where: {
          id_kelas_kuliah: kelas.id_kelas_kuliah,
        },
      });

      if (!kelas_kuliah) {
        return res.status(404).json({ message: "Kelas Kuliah not found" });
      }

      // Jika kelas kuliah ditemukan, tambahkan ke krsEntries
      if (kelas_kuliah) {
        const jumlahPesertaKelasKuliah = await PesertaKelasKuliah.count({
          where: { id_kelas_kuliah: kelas_kuliah.id_kelas_kuliah },
        });

        if (jumlahPesertaKelasKuliah < kelas_kuliah.jumlah_mahasiswa) {
          krsEntries.push({
            angkatan: tahunAjaran.id_tahun_ajaran,
            validasi_krs: false,
            id_registrasi_mahasiswa,
            id_semester: setting_global_semester.id_semester_krs,
            id_prodi: mahasiswa.id_prodi,
            id_matkul: kelas_kuliah.id_matkul,
            id_kelas: kelas_kuliah.id_kelas_kuliah,
          });
        } else {
          return res.status(404).json({ message: "Bug 1" });
        }
      } else {
        return res.status(404).json({ message: "Bug 2" });
      }
    }

    // Buat data KRS mahasiswa di database
    const createdKRSEntries = await KRSMahasiswa.bulkCreate(krsEntries);

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== KRS Mahasiswa Created Successfully =====>",
      jumlahData: createdKRSEntries.length,
      data: createdKRSEntries,
    });
  } catch (error) {
    next(error);
  }
};

const createKRSMahasiswaByMahasiswaActive = async (req, res, next) => {
  try {
    // Dapatkan data kelas_kuliahs dari request body
    const { kelas_kuliahs } = req.body;

    const user = req.user;

    const mahasiswa = await Mahasiswa.findOne({
      where: {
        nim: user.username,
      },
    });

    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa not found" });
    }

    // mengecek apakah status mahasiswa aktif atau tidak
    if (mahasiswa.nama_status_mahasiswa !== "Aktif" && mahasiswa.nama_status_mahasiswa !== "AKTIF") {
      return res.status(404).json({ message: "Status Mahasiswa Tidak Aktif" });
    }

    // get data setting global semester
    const setting_global_semester = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    if (!setting_global_semester) {
      return res.status(404).json({
        message: "Setting Global Semester Aktif not found",
      });
    }

    // Mengambil tahun ajaran yang sesuai dengan kondisi
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    if (!tahunAjaran) {
      return res.status(404).json({ message: "Tahun Ajaran not found" });
    }

    // Inisialisasi array untuk menyimpan data KRS yang akan dibuat
    const krsEntries = [];

    // Iterasi melalui data kelas_kuliahs dari request body
    for (const kelas of kelas_kuliahs) {
      // Mengambil data kelas kuliah berdasarkan id_kelas
      const kelas_kuliah = await KelasKuliah.findOne({
        where: {
          id_kelas_kuliah: kelas.id_kelas_kuliah,
        },
      });

      if (!kelas_kuliah) {
        return res.status(404).json({ message: "Kelas Kuliah not found" });
      }

      // Jika kelas kuliah ditemukan, tambahkan ke krsEntries
      if (kelas_kuliah) {
        const jumlahPesertaKelasKuliah = await PesertaKelasKuliah.count({
          where: { id_kelas_kuliah: kelas_kuliah.id_kelas_kuliah },
        });

        if (jumlahPesertaKelasKuliah < kelas_kuliah.jumlah_mahasiswa) {
          krsEntries.push({
            angkatan: tahunAjaran.id_tahun_ajaran,
            validasi_krs: false,
            id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
            id_semester: setting_global_semester.id_semester_krs,
            id_prodi: mahasiswa.id_prodi,
            id_matkul: kelas_kuliah.id_matkul,
            id_kelas: kelas_kuliah.id_kelas_kuliah,
          });
        }
      }
    }

    // Buat data KRS mahasiswa di database
    await KRSMahasiswa.bulkCreate(krsEntries);

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== KRS Mahasiswa Created Successfully =====>",
      jumlahData: krsEntries.length,
      data: krsEntries,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKRSMahasiswa,
  getKRSMahasiswaById,
  getKRSMahasiswaByMahasiswaId,
  getAllMahasiswaKRSBySemester,
  GetKRSMahasiswaByMahasiswaSemester,
  deleteKRSMahasiswaById,
  validasiKRSMahasiswa,
  BatalkanValidasiKRSMahasiswa,
  GetAllMahasiswaKRSTervalidasi,
  GetAllMahasiswaKRSBelumTervalidasi,
  getAllMahasiswaBelumKRS,
  getMahasiswaBelumKRSBySemesterAndProdiId,
  createKRSMahasiswa,
  createKRSMahasiswaByMahasiswaActive,
};
