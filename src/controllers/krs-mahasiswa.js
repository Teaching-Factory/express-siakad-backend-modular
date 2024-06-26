const { KRSMahasiswa, TahunAjaran, Periode, Mahasiswa, Prodi, KelasKuliah, Sequelize, MataKuliah, BiodataMahasiswa, PerguruanTinggi, Agama, PesertaKelasKuliah, Dosen, DetailKelasKuliah, RuangPerkuliahan } = require("../../models");

const getAllKRSMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data krs_mahasiswa dari database
    const krs_mahasiswa = await KRSMahasiswa.findAll({ include: [{ model: Mahasiswa }, { model: Periode }, { model: Prodi }, { model: MataKuliah }, { model: KelasKuliah }] });

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
      include: [{ model: Mahasiswa }, { model: Periode }, { model: Prodi }, { model: MataKuliah }, { model: KelasKuliah }],
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

    // Mengambil data tahun ajaran yang kolom a_periode bernilai = 1
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    // Jika data tahun ajaran tidak ditemukan, kirim respons 404
    if (!tahunAjaran) {
      return res.status(404).json({
        message: "Tahun Ajaran with a_periode 1 not found",
      });
    }

    // Cari data krs_mahasiswa berdasarkan id_registrasi_mahasiswa dan id_tahun_ajaran di database
    const krsMahasiswa = await KRSMahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: idRegistrasiMahasiswa,
        angkatan: tahunAjaran.id_tahun_ajaran,
      },
      include: [{ model: Mahasiswa }, { model: Periode }, { model: Prodi }, { model: MataKuliah }, { model: KelasKuliah }],
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
const getAllMahasiswaKRSByPeriode = async (req, res, next) => {
  try {
    // Ambil tahun ajaran yang sesuai dengan kondisi
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    // Ekstrak tahun awal dari nama_tahun_ajaran
    const [tahunAwal] = tahunAjaran.nama_tahun_ajaran.split("/");

    // Ambil semua periode yang sesuai dengan tahun awal
    const periodes = await Periode.findAll({
      where: {
        periode_pelaporan: {
          [Sequelize.Op.like]: `${tahunAwal}%`,
        },
      },
    });

    // Ambil semua id_periode dari hasil query periode
    const idPeriodes = periodes.map((periode) => periode.id_periode);

    // Ambil data KRS mahasiswa berdasarkan id_periode yang didapatkan
    const krs_mahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_periode: idPeriodes,
      },
    });

    // Ekstrak id_registrasi_mahasiswa dan simpan dalam sebuah Set untuk menghindari duplikasi
    const idRegistrasiMahasiswas = new Set(krs_mahasiswas.map((krs) => krs.id_registrasi_mahasiswa));

    // Ambil data mahasiswa berdasarkan id_registrasi_mahasiswa yang unik
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: Array.from(idRegistrasiMahasiswas),
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Periode, include: [{ model: Prodi }] }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Mahasiswa KRS By Periode Success",
      jumlahData: mahasiswas.length,
      data: mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const GetKRSMahasiswaByMahasiswaPeriode = async (req, res, next) => {
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

    // Ambil semua periode yang sesuai dengan tahun awal
    const periodes = await Periode.findAll({
      where: {
        periode_pelaporan: {
          [Sequelize.Op.like]: `${tahunAwal}%`,
        },
      },
    });

    // Ambil semua id_periode dari hasil query periode
    const idPeriodes = periodes.map((periode) => periode.id_periode);

    // Ambil data KRS mahasiswa berdasarkan id_periode yang didapatkan
    const krs_mahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_periode: idPeriodes,
        id_registrasi_mahasiswa: mahasiswaId,
      },
      include: [
        { model: Mahasiswa },
        { model: Periode },
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
      message: "<===== GET All KRS Mahasiswa By Mahasiswa Periode Success",
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

const ValidasiKRSMahasiswa = async (req, res, next) => {
  try {
    // Dapatkan array mahasiswa dari body permintaan
    const mahasiswas = req.body.mahasiswas;
    let krs_mahasiswas = [];

    // Ambil tahun ajaran yang sesuai dengan kondisi
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    // Ekstrak tahun awal dari nama_tahun_ajaran
    const [tahunAwal] = tahunAjaran.nama_tahun_ajaran.split("/");

    // Ambil semua periode yang sesuai dengan tahun awal
    const periodes = await Periode.findAll({
      where: {
        periode_pelaporan: {
          [Sequelize.Op.like]: `${tahunAwal}%`,
        },
      },
    });

    // Ambil semua id_periode dari hasil query periode
    const idPeriodes = periodes.map((periode) => periode.id_periode);

    // Lakukan iterasi melalui setiap objek mahasiswa
    for (const mahasiswa of mahasiswas) {
      // Ambil ID registrasi mahasiswa dari objek mahasiswa saat ini
      const id_registrasi_mahasiswa = mahasiswa.id_registrasi_mahasiswa;

      // Ambil data KRS mahasiswa berdasarkan id_periode dan id_registrasi_mahasiswa
      const krs_mahasiswa = await KRSMahasiswa.findAll({
        where: {
          id_periode: idPeriodes,
          id_registrasi_mahasiswa: id_registrasi_mahasiswa,
        },
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

        // proses penambahan data peserta kelas kuliah dari data krs milik mahasiswa
        await PesertaKelasKuliah.create({
          angkatan: tahunAwal,
          id_registrasi_mahasiswa: krs_mahasiswa.id_registrasi_mahasiswa,
          id_kelas_kuliah: krs_mahasiswa.id_kelas,
        });
      }
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

    // Ambil tahun ajaran yang sesuai dengan kondisi
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    // Ekstrak tahun awal dari nama_tahun_ajaran
    const [tahunAwal] = tahunAjaran.nama_tahun_ajaran.split("/");

    // Ambil semua periode yang sesuai dengan tahun awal
    const periodes = await Periode.findAll({
      where: {
        periode_pelaporan: {
          [Sequelize.Op.like]: `${tahunAwal}%`,
        },
      },
    });

    // Ambil semua id_periode dari hasil query periode
    const idPeriodes = periodes.map((periode) => periode.id_periode);

    // Ambil data KRS mahasiswa berdasarkan id_periode yang didapatkan
    const krs_mahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_periode: idPeriodes,
        id_registrasi_mahasiswa: mahasiswaId,
      },
    });

    // Lakukan iterasi melalui setiap objek KRS mahasiswa yang sudah diambil
    for (const krs_mahasiswa of krs_mahasiswas) {
      await krs_mahasiswa.update({ validasi_krs: false });
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
    // Ambil tahun ajaran yang sesuai dengan kondisi
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    // Ekstrak tahun awal dari nama_tahun_ajaran
    const [tahunAwal] = tahunAjaran.nama_tahun_ajaran.split("/");

    // Ambil semua periode yang sesuai dengan tahun awal
    const periodes = await Periode.findAll({
      where: {
        periode_pelaporan: {
          [Sequelize.Op.like]: `${tahunAwal}%`,
        },
      },
    });

    // Ambil semua id_periode dari hasil query periode
    const idPeriodes = periodes.map((periode) => periode.id_periode);

    // Ambil semua data KRS mahasiswa berdasarkan id_periode yang didapatkan
    const allKrsMahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_periode: {
          [Sequelize.Op.in]: idPeriodes,
        },
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
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Periode, include: [{ model: Prodi }] }],
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

const GetAllMahasiswaKRSBelumTervalidasi = async (req, res, next) => {
  try {
    // Ambil tahun ajaran yang sesuai dengan kondisi
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    // Ekstrak tahun awal dari nama_tahun_ajaran
    const [tahunAwal] = tahunAjaran.nama_tahun_ajaran.split("/");

    // Ambil semua periode yang sesuai dengan tahun awal
    const periodes = await Periode.findAll({
      where: {
        periode_pelaporan: {
          [Sequelize.Op.like]: `${tahunAwal}%`,
        },
      },
    });

    // Ambil semua id_periode dari hasil query periode
    const idPeriodes = periodes.map((periode) => periode.id_periode);

    // Ambil semua data KRS mahasiswa berdasarkan id_periode yang didapatkan
    const allKrsMahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_periode: {
          [Sequelize.Op.in]: idPeriodes,
        },
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
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Periode, include: [{ model: Prodi }] }],
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
    // Ambil tahun ajaran yang sesuai dengan kondisi
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    // Ekstrak tahun awal dari nama_tahun_ajaran
    const [tahunAwal] = tahunAjaran.nama_tahun_ajaran.split("/");

    // Ambil semua periode yang sesuai dengan tahun awal
    const periodes = await Periode.findAll({
      where: {
        periode_pelaporan: {
          [Sequelize.Op.like]: `${tahunAwal}%`,
        },
      },
    });

    // Ambil semua id_periode dari hasil query periode
    const idPeriodes = periodes.map((periode) => periode.id_periode);

    // Ambil data KRS mahasiswa berdasarkan id_periode yang didapatkan
    const krs_mahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_periode: idPeriodes,
      },
    });

    // Ekstrak id_registrasi_mahasiswa dari data KRS mahasiswa yang didapatkan
    const idRegistrasiMahasiswas = new Set(krs_mahasiswas.map((krs) => krs.id_registrasi_mahasiswa));

    // Ambil semua mahasiswa
    const allMahasiswas = await Mahasiswa.findAll({
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Periode, include: [{ model: Prodi }] }],
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

const getMahasiswaBelumKRSByPeriodeAndProdiId = async (req, res, next) => {
  try {
    const periodeId = req.params.id_periode;
    const prodiId = req.params.id_prodi;

    if (!periodeId) {
      return res.status(400).json({ message: "Periode ID is required" });
    }
    if (!prodiId) {
      return res.status(400).json({ message: "Prodi ID is required" });
    }

    // Ambil data KRS mahasiswa berdasarkan id_periode yang didapatkan
    const krs_mahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_periode: periodeId,
        id_prodi: prodiId,
      },
    });

    // Ekstrak id_registrasi_mahasiswa dari data KRS mahasiswa yang didapatkan
    const idRegistrasiMahasiswas = new Set(krs_mahasiswas.map((krs) => krs.id_registrasi_mahasiswa));

    // Ambil semua mahasiswa
    const allMahasiswas = await Mahasiswa.findAll({
      include: [
        { model: BiodataMahasiswa },
        { model: PerguruanTinggi },
        { model: Agama },
        {
          model: Periode,
          include: [{ model: Prodi }],
        },
      ],
    });

    const mahasiswasBelumKRS = allMahasiswas.filter((mahasiswa) => !idRegistrasiMahasiswas.has(mahasiswa.id_registrasi_mahasiswa));

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Mahasiswa Belum KRS By Periode ID ${periodeId} And Prodi ID ${prodiId} Success =====>`,
      // idRegistrasiMahasiswas: Array.from(idRegistrasiMahasiswas).length,
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

    // Mengambil data periode melalui id_periode milik mahasiswa
    const mahasiswaPeriode = await Periode.findOne({
      where: {
        id_periode: mahasiswa.id_periode,
      },
    });

    if (!mahasiswaPeriode) {
      return res.status(404).json({ message: "Periode not found" });
    }

    // Mengambil data prodi melalui id_prodi milik periode
    const prodi = await Prodi.findOne({
      where: {
        id_prodi: mahasiswaPeriode.id_prodi,
      },
    });

    if (!prodi) {
      return res.status(404).json({ message: "Prodi not found" });
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

    // Ekstrak tahun awal dari nama_tahun_ajaran
    const [tahunAwal] = tahunAjaran.nama_tahun_ajaran.split("/");

    // Ambil periode yang sesuai dengan tahun awal
    const periode = await Periode.findOne({
      where: {
        periode_pelaporan: {
          [Sequelize.Op.like]: `${tahunAwal}%`,
        },
      },
    });

    if (!periode) {
      return res.status(404).json({ message: "Periode not found" });
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
            id_periode: periode.id_periode,
            id_prodi: prodi.id_prodi,
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
  getAllMahasiswaKRSByPeriode,
  GetKRSMahasiswaByMahasiswaPeriode,
  deleteKRSMahasiswaById,
  ValidasiKRSMahasiswa,
  BatalkanValidasiKRSMahasiswa,
  GetAllMahasiswaKRSTervalidasi,
  GetAllMahasiswaKRSBelumTervalidasi,
  getAllMahasiswaBelumKRS,
  getMahasiswaBelumKRSByPeriodeAndProdiId,
  createKRSMahasiswa,
};
