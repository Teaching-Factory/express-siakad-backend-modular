const {
  RekapKRSMahasiswa,
  Prodi,
  Periode,
  Mahasiswa,
  MataKuliah,
  Semester,
  UnitJabatan,
  Dosen,
  KRSMahasiswa,
  KelasKuliah,
  DetailKelasKuliah,
  Angkatan,
  Jabatan,
  RuangPerkuliahan,
  DosenWali,
  SemesterAktif,
  TahunAjaran,
  JenjangPendidikan,
} = require("../../models");
const axios = require("axios");
const { getToken } = require("././api-feeder/get-token");

const getAllRekapKRSMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data rekap_krs_mahasiswa dari database
    const rekap_krs_mahasiswa = await RekapKRSMahasiswa.findAll({ include: [{ model: Prodi }, { model: Periode }, { model: Mahasiswa }, { model: MataKuliah }, { model: Semester }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Rekap KRS Mahasiswa Success",
      jumlahData: rekap_krs_mahasiswa.length,
      data: rekap_krs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getRekapKRSMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const RekapKRSMahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!RekapKRSMahasiswaId) {
      return res.status(400).json({
        message: "Rekap KRS Mahasiswa ID is required",
      });
    }

    // Cari data rekap_krs_mahasiswa berdasarkan ID di database
    const rekap_krs_mahasiswa = await RekapKRSMahasiswa.findByPk(RekapKRSMahasiswaId, {
      include: [{ model: Prodi }, { model: Periode }, { model: Mahasiswa }, { model: MataKuliah }, { model: Semester }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!rekap_krs_mahasiswa) {
      return res.status(404).json({
        message: `<===== Rekap KRS Mahasiswa With ID ${RekapKRSMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Rekap KRS Mahasiswa By ID ${RekapKRSMahasiswaId} Success:`,
      data: rekap_krs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

// filter function rekap krs mahasiswa
const getRekapKRSMahasiswaByFilter = async (req, res, next) => {
  try {
    // memperoleh id
    const prodiId = req.params.id_prodi;
    const semesterId = req.params.id_semester;
    const mataKuliahId = req.params.id_matkul;
    const mahasiswaId = req.params.id_registrasi_mahasiswa;

    // pengecekan parameter id
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
    if (!mataKuliahId) {
      return res.status(400).json({
        message: "Mata Kuliah ID is required",
      });
    }
    if (!mahasiswaId) {
      return res.status(400).json({
        message: "Mahasiswa ID is required",
      });
    }

    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetRekapKRSMahasiswa",
      token: `${token}`,
      filter: `id_prodi='${prodiId}' and id_semester='${semesterId}' and id_matkul='${mataKuliahId}' and id_registrasi_mahasiswa='${mahasiswaId}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataRekapKRSMahasiswa = response.data.data;

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Get Rekap KRS Mahasiswa from Feeder Success",
      totalData: dataRekapKRSMahasiswa.length,
      dataRekapKRSMahasiswa: dataRekapKRSMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getRekapKRSMahasiswaByFilterReqBody = async (req, res, next) => {
  const { jenis_cetak, nim, id_semester, id_prodi, id_angkatan, tanggal_penandatanganan, format } = req.query;

  // Validasi input berdasarkan jenis_cetak
  if (jenis_cetak === "Mahasiswa") {
    if (!nim) {
      return res.status(400).json({ message: "nim is required" });
    }
    if (!id_semester) {
      return res.status(400).json({ message: "id_semester is required" });
    }
    if (!format) {
      return res.status(400).json({ message: "format is required" });
    }
    if (!tanggal_penandatanganan) {
      return res.status(400).json({ message: "tanggal_penandatanganan is required" });
    }
  } else if (jenis_cetak === "Angkatan") {
    if (!id_prodi) {
      return res.status(400).json({ message: "id_prodi is required" });
    }
    if (!id_angkatan) {
      return res.status(400).json({ message: "id_angkatan is required" });
    }
    if (!id_semester) {
      return res.status(400).json({ message: "id_semester is required" });
    }
    if (!tanggal_penandatanganan) {
      return res.status(400).json({ message: "tanggal_penandatanganan is required" });
    }
  } else {
    return res.status(400).json({ message: "jenis_cetak is invalid" });
  }

  // pengambilan data
  try {
    if (jenis_cetak === "Mahasiswa") {
      const mahasiswa = await Mahasiswa.findOne({
        where: {
          nim: nim,
        },
        include: [{ model: Semester }, { model: Prodi }],
      });

      if (!mahasiswa) {
        return res.status(404).json({ message: `<===== Mahasiswa With NIM ${nim} Not Found:` });
      }

      // get data semester aktif
      const semester_aktif = await SemesterAktif.findOne({
        status: true,
        include: [{ model: Semester, include: [{ model: TahunAjaran }] }],
      });

      if (!semester_aktif) {
        return res.status(404).json({ message: "Semester Aktif Not Found" });
      }

      // mengambil data dosen wali mahasiswa sesuai angkatan
      let dosen_wali = null;
      dosen_wali = await DosenWali.findOne({
        where: {
          id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
          id_tahun_ajaran: semester_aktif.Semester.TahunAjaran.id_tahun_ajaran,
        },
        include: [{ model: Dosen }],
      });

      // mengambil data unit jabatan dekan berdasarkan prodi mahasiswa
      let unit_jabatan = null;
      unit_jabatan = await UnitJabatan.findOne({
        where: {
          id_prodi: mahasiswa.id_prodi,
        },
        include: [
          {
            model: Jabatan,
            where: {
              nama_jabatan: "Dekan",
            },
          },
          { model: Dosen },
        ],
      });

      // get data krs from local
      const krs_mahasiswa_by_mahasiswa = await KRSMahasiswa.findAll({
        where: {
          id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
          id_semester: id_semester,
        },
        include: [{ model: KelasKuliah, include: [{ model: DetailKelasKuliah, include: [{ model: RuangPerkuliahan }] }, { model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }] }],
      });

      res.status(200).json({
        message: "Get Rekap KRS Mahasiswa By Mahasiswa from Local Success",
        mahasiswa: mahasiswa,
        dosen_wali: dosen_wali,
        unitJabatan: unit_jabatan,
        tanggalPenandatanganan: tanggal_penandatanganan,
        format: format,
        totalData: krs_mahasiswa_by_mahasiswa.length,
        dataRekapKRSByMahasiswa: krs_mahasiswa_by_mahasiswa,
      });
    } else if (jenis_cetak === "Angkatan") {
      const angkatan = await Angkatan.findByPk(id_angkatan);

      if (!angkatan) {
        return res.status(404).json({ message: `<===== Angkatan With ID ${id_angkatan} Not Found:` });
      }

      // Mengambil data unit jabatan dekan berdasarkan parameter id_prodi
      let unit_jabatan = null;
      unit_jabatan = await UnitJabatan.findOne({
        where: {
          id_prodi: id_prodi,
        },
        include: [
          {
            model: Jabatan,
            where: {
              nama_jabatan: "Dekan",
            },
          },
          { model: Dosen },
        ],
      });

      // get data semester aktif
      const semester_aktif = await SemesterAktif.findOne({
        where: { status: true },
        include: [{ model: Semester, include: [{ model: TahunAjaran }] }],
      });

      if (!semester_aktif) {
        return res.status(404).json({ message: "Semester Aktif Not Found" });
      }

      const krs_mahasiswa_by_angkatan = await KRSMahasiswa.findAll({
        where: {
          id_prodi: id_prodi,
          angkatan: angkatan.tahun,
          id_semester: id_semester,
        },
        include: [
          { model: Mahasiswa },
          {
            model: KelasKuliah,
            include: [{ model: DetailKelasKuliah, include: [{ model: RuangPerkuliahan }] }, { model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }],
          },
        ],
      });

      // Mengelompokkan data berdasarkan id_registrasi_mahasiswa dan menambahkan data DosenWali
      const groupedData = {};

      for (const item of krs_mahasiswa_by_angkatan) {
        const id = item.id_registrasi_mahasiswa;
        if (!groupedData[id]) {
          groupedData[id] = [];
        }
        groupedData[id].push(item);
      }

      const finalGroupedData = {};

      for (const id in groupedData) {
        // Mengambil data dosen wali mahasiswa sesuai angkatan
        const dosen_wali = await DosenWali.findOne({
          where: {
            id_registrasi_mahasiswa: id,
            id_tahun_ajaran: semester_aktif.Semester.TahunAjaran.id_tahun_ajaran,
          },
          include: [{ model: Dosen }],
        });

        // Menambahkan data mahasiswa yang sudah digrup dan DosenWali
        finalGroupedData[id] = {
          krs_mahasiswas: groupedData[id],
          DosenWali: dosen_wali ? dosen_wali : null,
        };
      }

      res.status(200).json({
        message: "Get Rekap KRS Mahasiswa By Angkatan from Local Success",
        unitJabatan: unit_jabatan,
        tanggalPenandatanganan: tanggal_penandatanganan,
        format: format,
        totalData: Object.keys(finalGroupedData).length,
        dataRekapKRSByMahasiswa: finalGroupedData,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getKRSMahasiswaByPeriodeId = async (req, res, next) => {
  // memperoleh id
  const periodeId = req.params.id_periode;

  // pengecekan parameter id
  if (!periodeId) {
    return res.status(400).json({
      message: "Periode ID is required",
    });
  }

  // get data semester dari periode id
  const semester = await Semester.findByPk(periodeId);

  if (!semester) {
    return res.status(404).json({
      message: "Semester not found",
    });
  }

  const user = req.user;

  const mahasiswa = await Mahasiswa.findOne({
    where: {
      nim: user.username,
    },
    include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
  });

  if (!mahasiswa) {
    return res.status(404).json({
      message: "Mahasiswa not found",
    });
  }

  // get dosen wali
  let dosen_wali = null;
  dosen_wali = await DosenWali.findOne({
    where: {
      id_tahun_ajaran: semester.id_tahun_ajaran,
      id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
    },
  });

  // Mendapatkan token
  const token = await getToken();

  const requestBody = {
    act: "GetRekapKRSMahasiswa",
    token: `${token}`,
    filter: `id_periode='${periodeId}' and id_registrasi_mahasiswa='${mahasiswa.id_registrasi_mahasiswa}'`,
  };

  // Menggunakan token untuk mengambil data
  const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

  // Tanggapan dari API
  const dataRekapKRSMahasiswa = response.data.data;

  // Hitung total SKS dari seluruh mata kuliah
  const total_sks = dataRekapKRSMahasiswa
    .reduce((total, mataKuliah) => {
      return total + parseFloat(mataKuliah.sks_mata_kuliah);
    }, 0)
    .toFixed(2); // Format dengan dua desimal

  // Kirim data sebagai respons
  res.status(200).json({
    message: `Get KRS Mahasiswa By Periode ID ${periodeId} from Feeder Success`,
    total_sks: total_sks,
    mahasiswa: mahasiswa,
    dosen_wali: dosen_wali,
    totalData: dataRekapKRSMahasiswa.length,
    dataRekapKRSMahasiswa: dataRekapKRSMahasiswa,
  });
};

const cetakKRSMahasiswaActiveBySemesterId = async (req, res, next) => {
  // memperoleh id
  const semesterId = req.params.id_semester;

  // pengecekan parameter id
  if (!semesterId) {
    return res.status(400).json({
      message: "Periode ID is required",
    });
  }

  // get data semester dari periode id
  const semester = await Semester.findByPk(semesterId);

  if (!semester) {
    return res.status(404).json({
      message: "Semester not found",
    });
  }

  const user = req.user;

  const mahasiswa = await Mahasiswa.findOne({
    where: {
      nim: user.username,
    },
    include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
  });

  if (!mahasiswa) {
    return res.status(404).json({
      message: "Mahasiswa not found",
    });
  }

  // Mengambil data unit jabatan berdasarkan prodi mahasiswa
  let unit_jabatan = null;
  unit_jabatan = await UnitJabatan.findOne({
    where: {
      id_prodi: mahasiswa.id_prodi,
    },
    include: [
      {
        model: Jabatan,
        where: {
          nama_jabatan: "Dekan",
        },
      },
      { model: Dosen },
    ],
  });

  // get dosen wali
  let dosen_wali = null;
  dosen_wali = await DosenWali.findOne({
    where: {
      id_tahun_ajaran: semester.id_tahun_ajaran,
      id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
    },
  });

  // Mendapatkan token
  const token = await getToken();

  const requestBody = {
    act: "GetRekapKRSMahasiswa",
    token: `${token}`,
    filter: `id_periode='${semester.id_semester}' and id_registrasi_mahasiswa='${mahasiswa.id_registrasi_mahasiswa}'`,
  };

  // Menggunakan token untuk mengambil data
  const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

  // Tanggapan dari API
  const dataRekapKRSMahasiswa = response.data.data;

  // Hitung total SKS dari seluruh mata kuliah
  const total_sks = dataRekapKRSMahasiswa
    .reduce((total, mataKuliah) => {
      return total + parseFloat(mataKuliah.sks_mata_kuliah);
    }, 0)
    .toFixed(2); // Format dengan dua desimal

  // Mendapatkan tanggal saat ini
  const tanggalPenandatanganan = new Date().toISOString().split("T")[0];

  // Kirim data sebagai respons
  res.status(200).json({
    message: `Get Cetak KRS Mahasiswa By Semester ID ${semesterId} from Feeder Success`,
    total_sks: total_sks,
    mahasiswa: mahasiswa,
    dosen_wali: dosen_wali,
    tanggal_penandatanganan: tanggalPenandatanganan,
    unit_jabatan: unit_jabatan,
    totalData: dataRekapKRSMahasiswa.length,
    dataRekapKRSMahasiswa: dataRekapKRSMahasiswa,
  });
};

module.exports = {
  getAllRekapKRSMahasiswa,
  getRekapKRSMahasiswaById,
  getRekapKRSMahasiswaByFilter,
  getRekapKRSMahasiswaByFilterReqBody,
  getKRSMahasiswaByPeriodeId,
  cetakKRSMahasiswaActiveBySemesterId,
};
