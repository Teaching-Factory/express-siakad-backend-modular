const { RekapKHSMahasiswa, Mahasiswa, Prodi, MataKuliah, Angkatan, UnitJabatan, Jabatan, Dosen, Semester, JenjangPendidikan, Agama, AktivitasKuliahMahasiswa, SettingGlobalSemester } = require("../../models");
const axios = require("axios");
const { getToken } = require("././api-feeder/get-token");

const getAllRekapKHSMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data rekap_khs_mahasiswa dari database
    const rekap_khs_mahasiswa = await RekapKHSMahasiswa.findAll({ include: [{ model: Mahasiswa }, { model: Prodi }, { model: MataKuliah }, { model: Semester }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Rekap KHS Mahasiswa Success",
      jumlahData: rekap_khs_mahasiswa.length,
      data: rekap_khs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getRekapKHSMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const RekapKHSMahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!RekapKHSMahasiswaId) {
      return res.status(400).json({
        message: "Rekap KHS Mahasiswa ID is required",
      });
    }

    // Cari data rekap_khs_mahasiswa berdasarkan ID di database
    const rekap_khs_mahasiswa = await RekapKHSMahasiswa.findByPk(RekapKHSMahasiswaId, {
      include: [{ model: Mahasiswa }, { model: Prodi }, { model: MataKuliah }, { model: Semester }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!rekap_khs_mahasiswa) {
      return res.status(404).json({
        message: `<===== Rekap KHS Mahasiswa With ID ${RekapKHSMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Rekap KHS Mahasiswa By ID ${RekapKHSMahasiswaId} Success:`,
      data: rekap_khs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getRekapKHSMahasiswaByMahasiswaId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const idRegistrasiMahasiswa = req.params.id_registrasi_mahasiswa;

    // Periksa apakah ID disediakan
    if (!idRegistrasiMahasiswa) {
      return res.status(400).json({
        message: "ID Registrasi Mahasiswa is required",
      });
    }

    // Cari data rekap_khs_mahasiswa berdasarkan id_registrasi_mahasiswa di database
    const rekapKhsMahasiswaId = await RekapKHSMahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: idRegistrasiMahasiswa,
      },
      include: [{ model: Mahasiswa }, { model: Prodi }, { model: MataKuliah }, { model: Semester }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!rekapKhsMahasiswaId || rekapKhsMahasiswaId.length === 0) {
      return res.status(404).json({
        message: `<===== Rekap KHS Mahasiswa With ID ${idRegistrasiMahasiswa} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Rekap KHS Mahasiswa By ID ${idRegistrasiMahasiswa} Success:`,
      jumlahData: rekapKhsMahasiswaId.length,
      data: rekapKhsMahasiswaId,
    });
  } catch (error) {
    next(error);
  }
};

// filter function rekap khs mahasiswa
const getRekapKHSMahasiswaByFilter = async (req, res, next) => {
  try {
    // memperoleh id
    const prodiId = req.params.id_prodi;
    const angkatanId = req.params.id_angkatan;
    const semesterId = req.params.id_semester;
    const mataKuliahId = req.params.id_matkul;

    // pengecekan parameter id
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }
    if (!angkatanId) {
      return res.status(400).json({
        message: "Angkatan ID is required",
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

    // get data angktan
    const angkatan = await Angkatan.findByPk(angkatanId);

    // jika data tidak ditemukan
    if (!angkatan) {
      return res.status(404).json({
        message: `<===== Angkatan With ID ${angkatanId} Not Found:`,
      });
    }

    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetRekapKHSMahasiswa",
      token: `${token}`,
      filter: `id_prodi='${prodiId}' AND angkatan='${angkatan.tahun}' AND id_periode='${semesterId}' AND id_matkul='${mataKuliahId}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataRekapKHSMahasiswa = response.data.data;

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Get Rekap KHS Mahasiswa from Feeder Success",
      totalData: dataRekapKHSMahasiswa.length,
      dataRekapKHSMahasiswa: dataRekapKHSMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getRekapKHSMahasiswaByFilterReqBody = async (req, res, next) => {
  const { jenis_cetak, nim, id_prodi, id_angkatan, id_semester, tanggal_penandatanganan, format } = req.query;

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

      // get rekap khs mahasiswa local
      let dataRekapKHSMahasiswa = await RekapKHSMahasiswa.findAll({
        where: {
          id_semester: id_semester,
        },
        include: [
          {
            model: Mahasiswa,
            where: {
              nim: nim,
            },
          },
          { model: Prodi },
          { model: Semester },
          { model: MataKuliah },
        ],
      });

      // // Mendapatkan token (get rekap khs mahasiswa by feeder)
      // const { token, url_feeder } = await getToken();

      // const requestBody = {
      //   act: "GetRekapKHSMahasiswa",
      //   token: token,
      //   filter: `nim='${nim}' AND id_periode='${id_semester}'`,
      // };

      // const response = await axios.post(url_feeder, requestBody);
      // const dataRekapKHSMahasiswa = response.data.data;

      res.status(200).json({
        message: "Get Rekap KHS Mahasiswa By Mahasiswa from Feeder Success",
        mahasiswa: mahasiswa,
        unitJabatan: unit_jabatan,
        tanggalPenandatanganan: tanggal_penandatanganan,
        format: format,
        totalData: dataRekapKHSMahasiswa.length,
        dataRekapKHSMahasiswaMahasiswa: dataRekapKHSMahasiswa,
      });
    } else if (jenis_cetak === "Angkatan") {
      const angkatan = await Angkatan.findByPk(id_angkatan);

      if (!angkatan) {
        return res.status(404).json({ message: `<===== Angkatan With ID ${id_angkatan} Not Found:` });
      }

      // Mengambil data unit jabatan berdasarkan parameter id_prodi
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

      // get rekap khs mahasiswa local
      let dataRekapKHSMahasiswa = await RekapKHSMahasiswa.findAll({
        where: {
          angkatan: angkatan.tahun,
          id_semester: id_semester,
        },
        include: [
          {
            model: Mahasiswa,
            where: {
              id_prodi: id_prodi,
            },
          },
          { model: Prodi },
          { model: Semester },
          { model: MataKuliah },
        ],
      });

      // Mendapatkan token (get rekap khs mahasiswa by feeder)
      // const { token, url_feeder } = await getToken();

      // const requestBody = {
      //   act: "GetRekapKHSMahasiswa",
      //   token: token,
      //   filter: `id_prodi='${id_prodi}' AND angkatan='${angkatan.tahun}' AND id_periode='${id_semester}'`,
      // };

      // const response = await axios.post(url_feeder, requestBody);
      // const dataRekapKHSMahasiswa = response.data.data;

      // Mengelompokkan data berdasarkan id_registrasi_mahasiswa
      const groupedData = dataRekapKHSMahasiswa.reduce((acc, item) => {
        const id = item.id_registrasi_mahasiswa;
        if (!acc[id]) {
          acc[id] = [];
        }
        acc[id].push(item);
        return acc;
      }, {});

      res.status(200).json({
        message: "Get Rekap KHS Mahasiswa By Angkatan from Feeder Success",
        unitJabatan: unit_jabatan,
        tanggalPenandatanganan: tanggal_penandatanganan,
        format: format,
        totalData: Object.keys(groupedData).length,
        dataRekapKHSMahasiswaAngkatan: groupedData,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getKHSMahasiswaBySemesterId = async (req, res, next) => {
  const semesterId = req.params.id_semester;

  // pengecekan parameter id
  if (!semesterId) {
    return res.status(400).json({
      message: "Semester ID is required",
    });
  }

  const user = req.user;

  const mahasiswa = await Mahasiswa.findOne({
    where: {
      nim: user.username,
    },
    include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }, { model: Agama }],
  });

  if (!mahasiswa) {
    return res.status(404).json({
      message: "Mahasiswa not found",
    });
  }

  // get rekap khs mahasiswa local
  let dataRekapKHSMahasiswa = await RekapKHSMahasiswa.findAll({
    where: {
      id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
      id_semester: semesterId,
    },
    include: [{ model: MataKuliah }],
  });

  // // Mendapatkan token (get rekap khs mahasiswa by feeder)
  // const { token, url_feeder } = await getToken();

  // const requestBody = {
  //   act: "GetRekapKHSMahasiswa",
  //   token: `${token}`,
  //   filter: `id_periode='${semesterId}' and id_registrasi_mahasiswa='${mahasiswa.id_registrasi_mahasiswa}'`,
  // };

  // // Menggunakan token untuk mengambil data
  // const response = await axios.post(url_feeder, requestBody);

  // // Tanggapan dari API
  // const dataRekapKHSMahasiswa = response.data.data;

  // Hitung total_sks dan total_sks_indeks untuk semester tertentu
  let total_sks = 0;
  let total_sks_indeks = 0;

  dataRekapKHSMahasiswa.forEach((nilai) => {
    const sks = parseFloat(nilai.MataKuliah.sks_mata_kuliah) || 0; // Default ke 0 jika null atau undefined
    const indeks = parseFloat(nilai.nilai_indeks) || 0; // Default ke 0 jika null atau undefined
    nilai.total_sks_indeks = sks * indeks; // Perhitungan indeks untuk masing-masing mata kuliah
    total_sks += sks;
    total_sks_indeks += nilai.total_sks_indeks;
  });

  // Hitung IPS untuk semester tertentu
  // const ips = total_sks > 0 ? (total_sks_indeks / total_sks).toFixed(2) : "0.00";
  const formattedTotalSksIndeks = total_sks_indeks.toFixed(2);

  // // get rekap khs mahasiswa local
  // let dataRekapKHSMahasiswaAll = await RekapKHSMahasiswa.findAll({
  //   where: {
  //     id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
  //   },
  //   include: [{ model: MataKuliah }],
  // });

  // // Mendapatkan semua data KHS mahasiswa untuk menghitung IPK (dari feeder)
  // const requestBodyTwo = {
  //   act: "GetRekapKHSMahasiswa",
  //   token: `${token}`,
  //   filter: `id_registrasi_mahasiswa='${mahasiswa.id_registrasi_mahasiswa}'`,
  // };

  // // Menggunakan token untuk mengambil data
  // const responseTwo = await axios.post(url_feeder, requestBodyTwo);

  // // Tanggapan dari API
  // const dataRekapKHSMahasiswaAll = responseTwo.data.data;

  // // Mengelompokkan data KHS berdasarkan id_semester
  // const groupedData = dataRekapKHSMahasiswaAll.reduce((acc, curr) => {
  //   const semester = curr.id_semester;
  //   if (!acc[semester]) {
  //     acc[semester] = [];
  //   }
  //   acc[semester].push(curr);
  //   return acc;
  // }, {});

  // // Hitung dan simpan nilai IPS masing-masing semester ke dalam array ips
  // const ipsArray = [];
  // for (const semester in groupedData) {
  //   let totalSksSemester = 0;
  //   let totalSksIndeksSemester = 0;
  //   groupedData[semester].forEach((nilai) => {
  //     const sks = parseFloat(nilai.sks_mata_kuliah) || 0; // Default ke 0 jika null
  //     const indeks = parseFloat(nilai.nilai_indeks) || 0; // Default ke 0 jika null
  //     totalSksSemester += sks;
  //     totalSksIndeksSemester += sks * indeks;
  //   });
  //   const ipsSemester = totalSksSemester > 0 ? (totalSksIndeksSemester / totalSksSemester).toFixed(2) : "0.00";
  //   ipsArray.push(parseFloat(ipsSemester));
  // }

  // // Hitung IPK
  // const validIpsArray = ipsArray.filter((ips) => ips !== null && !isNaN(Number(ips)));

  // const totalIps = validIpsArray.reduce((acc, curr) => acc + curr, 0);
  // const ipk = validIpsArray.length > 0 ? (totalIps / validIpsArray.length).toFixed(2) : "0.00";

  // mengambil data ips dan ipk dari AKM semester sebelumnya
  let ips = 0;
  let ipk = 0;

  // get data AKM
  const aktivitas_kuliah_mahasiswa = await AktivitasKuliahMahasiswa.findOne({
    where: {
      id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
      id_semester: semesterId,
    },
  });

  if (aktivitas_kuliah_mahasiswa) {
    ips = aktivitas_kuliah_mahasiswa.ips;
    ipk = aktivitas_kuliah_mahasiswa.ipk;
  } else {
    console.log("Data Aktivitas Kuliah Mahasiswa Tidak Ditemukan");
  }

  res.json({
    message: `Get KHS Mahasiswa By Semester ID ${semesterId} from Feeder Success`,
    mahasiswa: mahasiswa,
    total_sks: total_sks,
    total_sks_indeks: formattedTotalSksIndeks,
    ips: ips,
    ipk: ipk,
    dataRekapKHSMahasiswa: dataRekapKHSMahasiswa,
  });
};

const cetakKHSMahasiswaActiveBySemesterId = async (req, res, next) => {
  const semesterId = req.params.id_semester;

  // pengecekan parameter id
  if (!semesterId) {
    return res.status(400).json({
      message: "Semester ID is required",
    });
  }

  const user = req.user;

  const mahasiswa = await Mahasiswa.findOne({
    where: {
      nim: user.username,
    },
    include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }, { model: Agama }],
  });

  if (!mahasiswa) {
    return res.status(404).json({
      message: "Mahasiswa not found",
    });
  }

  // get data semester
  const semester = await Semester.findByPk(semesterId);

  if (!semester) {
    return res.status(404).json({
      message: "Semester not found",
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

  // get rekap khs mahasiswa local
  let dataRekapKHSMahasiswa = await RekapKHSMahasiswa.findAll({
    where: {
      id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
      id_semester: semesterId,
    },
    include: [{ model: MataKuliah }],
  });

  // // Mendapatkan token
  // const { token, url_feeder } = await getToken();

  // // Get data Rekap KHS Mahasiswa (By Feeder)
  // const requestBody = {
  //   act: "GetRekapKHSMahasiswa",
  //   token: `${token}`,
  //   filter: `id_periode='${semester.id_semester}' and id_registrasi_mahasiswa='${mahasiswa.id_registrasi_mahasiswa}'`,
  // };

  // // Menggunakan token untuk mengambil data
  // const response = await axios.post(url_feeder, requestBody);

  // // Tanggapan dari API
  // const dataRekapKHSMahasiswa = response.data.data || [];

  // Hitung total_sks dan total_sks_indeks untuk semester tertentu
  let total_sks = 0;
  let total_sks_indeks = 0;

  dataRekapKHSMahasiswa.forEach((nilai) => {
    const sksMataKuliah = parseFloat(nilai.MataKuliah.sks_mata_kuliah) || 0;
    const nilaiIndeks = parseFloat(nilai.nilai_indeks) || 0;

    nilai.total_sks_indeks = sksMataKuliah * nilaiIndeks;
    total_sks += sksMataKuliah;
    total_sks_indeks += nilai.total_sks_indeks;
  });

  // Hitung IPS untuk semester tertentu
  // const ips = total_sks > 0 ? (total_sks_indeks / total_sks).toFixed(2) : "0.00";
  const formattedTotalSksIndeks = total_sks_indeks.toFixed(2);

  // // Mendapatkan semua data KHS mahasiswa untuk menghitung IPK (By Feeder)
  // const requestBodyTwo = {
  //   act: "GetRekapKHSMahasiswa",
  //   token: `${token}`,
  //   filter: `id_registrasi_mahasiswa='${mahasiswa.id_registrasi_mahasiswa}'`,
  // };

  // // Menggunakan token untuk mengambil data
  // const responseTwo = await axios.post(url_feeder, requestBodyTwo);

  // // Tanggapan dari API
  // const dataRekapKHSMahasiswaAll = responseTwo.data.data || [];

  // // Mengelompokkan data KHS berdasarkan id_semester
  // const groupedData = dataRekapKHSMahasiswaAll.reduce((acc, curr) => {
  //   const semester = curr.id_semester;
  //   if (!acc[semester]) {
  //     acc[semester] = [];
  //   }
  //   acc[semester].push(curr);
  //   return acc;
  // }, {});

  // // Hitung dan simpan nilai IPS masing-masing semester ke dalam array ips
  // const ipsArray = [];
  // for (const semester in groupedData) {
  //   let totalSksSemester = 0;
  //   let totalSksIndeksSemester = 0;
  //   groupedData[semester].forEach((nilai) => {
  //     const sksMataKuliah = parseFloat(nilai.sks_mata_kuliah) || 0;
  //     const nilaiIndeks = parseFloat(nilai.nilai_indeks) || 0;

  //     totalSksSemester += sksMataKuliah;
  //     totalSksIndeksSemester += sksMataKuliah * nilaiIndeks;
  //   });
  //   const ipsSemester = totalSksSemester > 0 ? (totalSksIndeksSemester / totalSksSemester).toFixed(2) : "0.00";
  //   ipsArray.push(parseFloat(ipsSemester));
  // }

  // // Hitung IPK
  // const validIpsArray = ipsArray.filter((ips) => ips !== null && !isNaN(Number(ips)));
  // const totalIps = validIpsArray.reduce((acc, curr) => acc + curr, 0);
  // const ipk = validIpsArray.length > 0 ? (totalIps / validIpsArray.length).toFixed(2) : "0.00";

  // Mendapatkan tanggal saat ini
  const tanggalPenandatanganan = new Date().toISOString().split("T")[0];

  // mengambil data ips dan ipk dari AKM semester sebelumnya
  let ips = 0;
  let ipk = 0;

  // get data AKM
  const aktivitas_kuliah_mahasiswa = await AktivitasKuliahMahasiswa.findOne({
    where: {
      id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
      id_semester: semesterId,
    },
  });

  if (aktivitas_kuliah_mahasiswa) {
    ips = aktivitas_kuliah_mahasiswa.ips;
    ipk = aktivitas_kuliah_mahasiswa.ipk;
  } else {
    console.log("Data Aktivitas Kuliah Mahasiswa Tidak Ditemukan");
  }

  res.json({
    message: `Get Cetak KHS Mahasiswa By Semester ID ${semesterId} from Feeder Success`,
    mahasiswa: mahasiswa,
    semester: semester,
    total_sks: total_sks,
    total_sks_indeks: formattedTotalSksIndeks,
    ips: ips,
    ipk: ipk,
    unit_jabatan: unit_jabatan,
    tanggal_penandatanganan: tanggalPenandatanganan,
    dataRekapKHSMahasiswa: dataRekapKHSMahasiswa,
  });
};

module.exports = {
  getAllRekapKHSMahasiswa,
  getRekapKHSMahasiswaById,
  getRekapKHSMahasiswaByMahasiswaId,
  getRekapKHSMahasiswaByFilter,
  getRekapKHSMahasiswaByFilterReqBody,
  getKHSMahasiswaBySemesterId,
  cetakKHSMahasiswaActiveBySemesterId,
};
