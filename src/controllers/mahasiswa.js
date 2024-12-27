const ExcelJS = require("exceljs");
const { Op } = require("sequelize");
const fs = require("fs").promises;
const {
  Mahasiswa,
  Angkatan,
  StatusMahasiswa,
  BiodataMahasiswa,
  Wilayah,
  Agama,
  PerguruanTinggi,
  Prodi,
  RiwayatPendidikanMahasiswa,
  JenisPendaftaran,
  JalurMasuk,
  Pembiayaan,
  Semester,
  SettingGlobalSemester,
  DosenWali,
  Dosen,
  JenjangPendidikan,
  KRSMahasiswa,
  KelasKuliah,
  MataKuliah,
  SettingWSFeeder,
  BiodataCamaba,
  Camaba,
} = require("../../models");
const axios = require("axios");
const { getToken } = require("././api-feeder/get-token");

const getAllMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data mahasiswa dari database
    const mahasiswa = await Mahasiswa.findAll({ include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Mahasiswa Success",
      jumlahData: mahasiswa.length,
      data: mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const MahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!MahasiswaId) {
      return res.status(400).json({
        message: "Mahasiswa ID is required",
      });
    }

    // Cari data mahasiswa berdasarkan ID di database
    const mahasiswa = await Mahasiswa.findByPk(MahasiswaId, {
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!mahasiswa) {
      return res.status(404).json({
        message: `<===== Mahasiswa With ID ${MahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Mahasiswa By ID ${MahasiswaId} Success:`,
      data: mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getMahasiswaByProdiId = async (req, res, next) => {
  try {
    // Dapatkan ID prodi dari parameter permintaan
    const prodiId = req.params.id_prodi;

    // Periksa apakah ID disediakan
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }

    // Cari data mahasiswa berdasarkan id_periode yang ada dalam periodeIdList
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        id_prodi: prodiId,
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });

    // Jika data mahasiswa tidak ditemukan, kirim respons 404
    if (!mahasiswas || mahasiswas.length === 0) {
      return res.status(404).json({
        message: `<===== Mahasiswa With Prodi ID ${prodiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Mahasiswa By Prodi ID ${prodiId} Success:`,
      jumlahData: mahasiswas.length,
      data: mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const getMahasiswaByAngkatanId = async (req, res, next) => {
  try {
    // Dapatkan ID angkatan dari parameter permintaan
    const angkatanId = req.params.id_angkatan;

    // Periksa apakah ID disediakan
    if (!angkatanId) {
      return res.status(400).json({
        message: "Angkatan ID is required",
      });
    }

    // Ambil data angkatan berdasarkan id_angkatan
    const angkatan = await Angkatan.findOne({
      where: { id: angkatanId },
    });

    // Jika data angkatan tidak ditemukan, kirim respons 404
    if (!angkatan) {
      return res.status(404).json({
        message: `Angkatan dengan ID ${angkatanId} tidak ditemukan`,
      });
    }

    // Ekstrak tahun dari data angkatan
    const tahunAngkatan = angkatan.tahun;

    // Ambil semua data mahasiswa yang memiliki tahun angkatan sesuai dengan nama_periode_masuk
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        nama_periode_masuk: {
          [Op.like]: `${tahunAngkatan}/%`, // Memastikan nama_periode_masuk mengandung tahunAngkatan di awal
        },
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });

    // Jika data mahasiswa yang sesuai tidak ditemukan, kirim respons 404
    if (mahasiswas.length === 0) {
      return res.status(404).json({
        message: `Mahasiswa dengan tahun angkatan ${tahunAngkatan} tidak ditemukan`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `GET Mahasiswa By Angkatan ID ${angkatanId} Success`,
      jumlahData: mahasiswas.length,
      data: mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const getMahasiswaByStatusMahasiswaId = async (req, res, next) => {
  try {
    // Dapatkan ID status mahasiswa dari parameter permintaan
    const statusMahasiswaId = req.params.id_status_mahasiswa;

    // Periksa apakah ID disediakan
    if (!statusMahasiswaId) {
      return res.status(400).json({
        message: "Status Mahasiswa ID is required",
      });
    }

    // Temukan status mahasiswa berdasarkan ID
    const status_mahasiswa = await StatusMahasiswa.findOne({
      where: {
        id_status_mahasiswa: statusMahasiswaId,
      },
    });

    // Jika status mahasiswa tidak ditemukan, kirim respons 404
    if (!status_mahasiswa) {
      return res.status(404).json({
        message: `Status Mahasiswa dengan ID ${statusMahasiswaId} tidak ditemukan`,
      });
    }

    // Cari data mahasiswa berdasarkan nama_status_mahasiswa yang sesuai
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        nama_status_mahasiswa: status_mahasiswa.nama_status_mahasiswa,
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });

    // Jika data mahasiswa tidak ditemukan, kirim respons 404
    if (!mahasiswas || mahasiswas.length === 0) {
      return res.status(404).json({
        message: `Mahasiswa dengan status mahasiswa ${status_mahasiswa.nama_status_mahasiswa} tidak ditemukan`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `GET Mahasiswa By Status Mahasiswa ${status_mahasiswa.nama_status_mahasiswa} Success`,
      jumlahData: mahasiswas.length,
      data: mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const getMahasiswaByProdiAndAngkatanId = async (req, res, next) => {
  try {
    // Dapatkan ID prodi dan ID angkatan dari parameter permintaan
    const prodiId = req.params.id_prodi;
    const angkatanId = req.params.id_angkatan;

    // Periksa apakah ID disediakan
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

    // Ambil data angkatan berdasarkan id_angkatan
    const angkatan = await Angkatan.findOne({ where: { id: angkatanId } });

    // Jika data angkatan tidak ditemukan, kirim respons 404
    if (!angkatan) {
      return res.status(404).json({ message: `Angkatan dengan ID ${angkatanId} tidak ditemukan` });
    }

    // Ekstrak tahun dari data angkatan
    const tahunAngkatan = angkatan.tahun;

    // Cari data mahasiswa berdasarkan id_periode yang ada dalam periodeIdList dan tahun angkatan
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        id_prodi: prodiId,
        nama_periode_masuk: { [Op.like]: `${tahunAngkatan}/%` },
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });

    // Jika data mahasiswa yang sesuai tidak ditemukan, kirim respons 404
    if (mahasiswas.length === 0) {
      return res.status(404).json({
        message: `Mahasiswa dengan Prodi ID ${prodiId} dan tahun angkatan ${tahunAngkatan} tidak ditemukan`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `GET Mahasiswa By Prodi ID ${prodiId} dan Angkatan ID ${angkatanId} Success`,
      jumlahData: mahasiswas.length,
      data: mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const importMahasiswas = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Check if the uploaded file is not an Excel file
    if (req.file.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      return res.status(400).json({ message: "File type not supported" });
    }

    // get data setting ws active
    const setting_ws_active = await SettingWSFeeder.findOne({
      where: {
        status: true,
      },
    });

    if (!setting_ws_active) {
      return res.status(400).json({
        message: "Setting WS Feeder Active Not Found",
      });
    }

    // get data perguruan tinggi
    const perguruanTinggi = await PerguruanTinggi.findOne({
      where: {
        kode_perguruan_tinggi: setting_ws_active.username_feeder,
      },
    });

    if (!perguruanTinggi) {
      return res.status(400).json({
        message: "Perguruan Tinggi Not Found",
      });
    }

    const filePath = req.file.path;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error("Worksheet not found in the Excel file");
    }

    let mahasiswaData = [];
    const riwayatPendidikanPromises = [];
    const rows = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 1) {
        rows.push(row);
      }
    });

    for (const row of rows) {
      const nim = row.getCell(2).value.startsWith("'") ? row.getCell(2).value.slice(1) : row.getCell(2).value;
      const nisn = row.getCell(3).value.startsWith("'") ? row.getCell(3).value.slice(1) : row.getCell(3).value;
      const nama = row.getCell(4).value; // Nama tidak perlu perubahan
      const nik = row.getCell(5).value.startsWith("'") ? row.getCell(5).value.slice(1) : row.getCell(5).value;
      const tempat_lahir = row.getCell(6).value;
      const tanggal_lahir = row.getCell(7).value;
      const jenis_kelamin = row.getCell(8).value;
      const no_handphone = row.getCell(9).value;
      const email = row.getCell(10).value;
      const kode_agama = row.getCell(11).value;
      const desa_kelurahan = row.getCell(12).value;
      const kode_wilayah = row.getCell(13).value;
      const nama_ibu_kandung = row.getCell(14).value;
      const kode_prodi = row.getCell(15).value;
      const tanggal_masuk = row.getCell(16).value;
      const semester_masuk = row.getCell(17).value;
      const jenis_pendaftaran = row.getCell(18).value;
      const jalur_pendaftaran = row.getCell(19).value;
      const biaya_awal_masuk = row.getCell(22).value;
      const jenis_pembiayaan = row.getCell(23).value;

      // Mengecek apakah data mahasiswa sudah ditambahkan di database dengan kolom nim
      let mahasiswaChecking = await Mahasiswa.findOne({
        where: { nim: nim },
      });

      if (!mahasiswaChecking) {
        // mengecek apakah data mahasiswa sudah ditambahkan di database dengan kolom nim
        mahasiswaData.push(
          (async () => {
            let id_wilayah = null;
            let id_agama = null;
            let id_jenis_daftar = null;
            let id_jalur_masuk = null;
            let id_prodi = null;
            let id_pembiayaan = null;

            if (kode_wilayah) {
              const wilayah = await Wilayah.findOne({ where: { id_wilayah: kode_wilayah } });
              if (wilayah) id_wilayah = wilayah.id_wilayah;
            }

            if (kode_agama) {
              const agama = await Agama.findOne({ where: { id_agama: kode_agama } });
              if (agama) id_agama = agama.id_agama;
            }

            if (kode_prodi) {
              const prodi = await Prodi.findOne({ where: { kode_program_studi: kode_prodi } });
              if (prodi) id_prodi = prodi.id_prodi;
            }

            if (jenis_pendaftaran) {
              const jenisPendaftaran = await JenisPendaftaran.findOne({ where: { nama_jenis_daftar: jenis_pendaftaran } });
              if (jenisPendaftaran) id_jenis_daftar = jenisPendaftaran.id_jenis_daftar;
            }

            if (jalur_pendaftaran) {
              const jalurMasuk = await JalurMasuk.findOne({ where: { nama_jalur_masuk: jalur_pendaftaran } });
              if (jalurMasuk) id_jalur_masuk = jalurMasuk.id_jalur_masuk;
            }

            if (jenis_pembiayaan) {
              const pembiayaan = await Pembiayaan.findOne({ where: { nama_pembiayaan: jenis_pembiayaan } });
              if (pembiayaan) id_pembiayaan = pembiayaan.id_pembiayaan;
            }

            let semester = await Semester.findOne({
              where: {
                id_semester: semester_masuk,
              },
            });

            let biodata_camaba = await BiodataCamaba.findOne({
              include: [
                {
                  model: Camaba,
                  where: {
                    nim: nim,
                  },
                },
              ],
            });

            if (!biodata_camaba) {
              return res.status(400).json({
                message: `Biodata Camaba With NIM ${biodata_camaba.nim} is required`,
              });
            }

            const biodata_mahasiswa = {
              tempat_lahir: tempat_lahir,
              nik: nik,
              nisn: nisn,
              npwp: biodata_camaba.npwp,
              kewarganegaraan: "Indonesia",
              jalan: biodata_camaba.jalan,
              dusun: biodata_camaba.dusun,
              rt: biodata_camaba.rt,
              rw: biodata_camaba.rw,
              kelurahan: desa_kelurahan,
              kode_pos: biodata_camaba.kode_pos,
              telepon: biodata_camaba.telepon,
              handphone: no_handphone,
              email: email,
              penerima_kps: 0,
              nomor_kps: null,
              nik_ayah: biodata_camaba.nik_ayah,
              nama_ayah: biodata_camaba.nama_ayah,
              tanggal_lahir_ayah: biodata_camaba.tanggal_lahir_ayah,
              nik_ibu: biodata_camaba.nik_ibu,
              nama_ibu_kandung: nama_ibu_kandung,
              tanggal_lahir_ibu: biodata_camaba.tanggal_lahir_ibu,
              nama_wali: biodata_camaba.nama_wali,
              tanggal_lahir_wali: biodata_camaba.tanggal_lahir_wali,
              id_wilayah: id_wilayah,
              id_jenis_tinggal: biodata_camaba.id_jenis_tinggal,
              id_alat_transportasi: null,
              id_pendidikan_ayah: biodata_camaba.id_pendidikan_ayah,
              id_pekerjaan_ayah: biodata_camaba.id_pekerjaan_ayah,
              id_penghasilan_ayah: biodata_camaba.id_penghasilan_ayah,
              id_pendidikan_ibu: biodata_camaba.id_pendidikan_ibu,
              id_pekerjaan_ibu: biodata_camaba.id_pekerjaan_ibu,
              id_penghasilan_ibu: biodata_camaba.id_penghasilan_ibu,
              id_pendidikan_wali: biodata_camaba.id_pendidikan_wali,
              id_pekerjaan_wali: biodata_camaba.id_pekerjaan_wali,
              id_penghasilan_wali: biodata_camaba.id_penghasilan_wali,
              id_kebutuhan_khusus_mahasiswa: 0,
              id_kebutuhan_khusus_ayah: 0,
              id_kebutuhan_khusus_ibu: 0,
            };

            const createdBiodataMahasiswa = await BiodataMahasiswa.create(biodata_mahasiswa);

            let createdMahasiswa = null;
            if (nama && jenis_kelamin && tanggal_lahir && nim) {
              createdMahasiswa = await Mahasiswa.create({
                nama_mahasiswa: nama,
                jenis_kelamin: jenis_kelamin,
                tanggal_lahir: tanggal_lahir,
                ipk: null,
                total_sks: 0,
                nama_status_mahasiswa: null,
                nim: nim,
                nipd: nim,
                nama_periode_masuk: semester.nama_semester,
                id_sms: id_prodi,
                id_mahasiswa: createdBiodataMahasiswa.id_mahasiswa,
                id_agama: id_agama,
                id_semester: semester_masuk,
                id_prodi: id_prodi,
                id_perguruan_tinggi: perguruanTinggi.id_perguruan_tinggi,
                nama_periode_masuk: semester.nama_semester,
              });
              if (createdMahasiswa) {
                mahasiswaData.push(createdMahasiswa);
              }
            }

            if (tanggal_masuk && createdMahasiswa) {
              const riwayatPendidikan = await RiwayatPendidikanMahasiswa.create({
                tanggal_daftar: tanggal_masuk,
                keterangan_keluar: null,
                sks_diakui: 0,
                nama_ibu_kandung: nama_ibu_kandung,
                biaya_masuk: biaya_awal_masuk,
                id_registrasi_mahasiswa: createdMahasiswa.id_registrasi_mahasiswa,
                id_jenis_daftar: id_jenis_daftar,
                id_jalur_daftar: id_jalur_masuk,
                id_periode_masuk: semester_masuk,
                id_jenis_keluar: null,
                id_prodi: id_prodi,
                id_pembiayaan: id_pembiayaan,
                id_bidang_minat: null,
                id_perguruan_tinggi_asal: null,
                id_prodi_asal: null,
              });

              riwayatPendidikanPromises.push(riwayatPendidikan);
            }
          })()
        );
      }
    }

    await Promise.all(mahasiswaData);
    await Promise.all(riwayatPendidikanPromises);
    mahasiswaData = mahasiswaData.filter((item) => Object.keys(item).length !== 0);

    // Hapus file ketika berhasil melakukan import data
    await fs.unlink(filePath);

    res.status(200).json({
      message: "Upload and Import Data Mahasiswa Success",
      jumlahData: mahasiswaData.length,
      data: mahasiswaData,
    });
  } catch (error) {
    next(error);
  }
};

const getMahasiswaActive = async (req, res, next) => {
  try {
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

    // get data setting global semester
    const setting_global_semester = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
      include: [{ model: Semester, as: "SemesterAktif" }],
    });

    if (!setting_global_semester) {
      return res.status(404).json({
        message: "Setting Global Semester Aktif not found",
      });
    }

    // get data dosen wali sekarang
    let dosen_wali = null;
    dosen_wali = await DosenWali.findOne({
      where: {
        id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
        id_tahun_ajaran: setting_global_semester.SemesterAktif.id_tahun_ajaran,
      },
      include: [{ model: Dosen }],
    });

    res.status(200).json({
      message: "Get Mahasiswa Active Success",
      dosenWali: dosen_wali,
      data: mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getIpsMahasiswaActive = async (req, res, next) => {
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

  // Mendapatkan token
  const { token, url_feeder } = await getToken();

  // Mendapatkan semua data KHS mahasiswa untuk menghitung IPK
  const requestBody = {
    act: "GetRekapKHSMahasiswa",
    token: `${token}`,
    filter: `id_registrasi_mahasiswa='${mahasiswa.id_registrasi_mahasiswa}'`,
  };

  // Menggunakan token untuk mengambil data
  const response = await axios.post(url_feeder, requestBody);

  // Tanggapan dari API
  const dataRekapKHSMahasiswaAll = response.data.data;

  // Mengelompokkan data KHS berdasarkan id_periode
  const groupedData = dataRekapKHSMahasiswaAll.reduce((acc, curr) => {
    const periode = curr.id_periode;
    if (!acc[periode]) {
      acc[periode] = [];
    }
    acc[periode].push(curr);
    return acc;
  }, {});

  // Hitung dan simpan nilai IPS masing-masing periode ke dalam array ips
  const ipsArray = [];
  for (const periode in groupedData) {
    let totalSksPeriode = 0;
    let totalSksIndeksPeriode = 0;
    groupedData[periode].forEach((nilai) => {
      totalSksPeriode += parseFloat(nilai.sks_mata_kuliah);
      totalSksIndeksPeriode += parseFloat(nilai.sks_mata_kuliah) * parseFloat(nilai.nilai_indeks);
    });
    const ipsPeriode = (totalSksIndeksPeriode / totalSksPeriode).toFixed(2);
    ipsArray.push(parseFloat(ipsPeriode));
  }

  // Menghapus nilai null dari array ipsArray
  const validIpsArray = ipsArray.filter((ips) => ips !== null && !isNaN(Number(ips)));

  res.json({
    message: `Get IPS Mahasiswa Active Success`,
    mahasiswa: mahasiswa,
    daftar_ips: validIpsArray,
  });
};

const getKRSMahasiswaBySemesterAktif = async (req, res, next) => {
  try {
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

    // get data setting global semester
    const setting_global_semester = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
      include: [{ model: Semester, as: "SemesterAktif" }],
    });

    if (!setting_global_semester) {
      return res.status(404).json({
        message: "Setting Global Semester Aktif not found",
      });
    }

    // get data dosen wali sekarang
    let dosen_wali = null;
    dosen_wali = await DosenWali.findOne({
      where: {
        id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
        id_tahun_ajaran: setting_global_semester.SemesterAktif.id_tahun_ajaran,
      },
      include: [{ model: Dosen }],
    });

    // get data krs mahasiswa berdasarka semester aktif pada setting global semester
    const krs_mahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_semester: setting_global_semester.SemesterAktif.id_semester,
        id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
      },
      include: [{ model: KelasKuliah, include: [{ model: Dosen }, { model: MataKuliah }] }],
    });

    res.status(200).json({
      message: "Get KRS Mahasiswa By Semester Active Success",
      id_semester: setting_global_semester.SemesterAktif.id_semester,
      jumlahDataKRSMahasiswa: krs_mahasiswas.length,
      dosenWali: dosen_wali,
      dataMahasiswa: mahasiswa,
      dataKRSMahasiswa: krs_mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const getCountGenderMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data mahasiswa dari database
    const mahasiswas = await Mahasiswa.findAll();

    // Inisialisasi objek untuk menghitung gender keseluruhan dan per angkatan
    const totalGender = { L: 0, P: 0 };
    const genderByAngkatan = {};

    // Iterasi melalui data mahasiswa
    mahasiswas.forEach((mahasiswa) => {
      const { jenis_kelamin, nama_periode_masuk } = mahasiswa;

      // Hitung total gender
      if (jenis_kelamin === "L" || jenis_kelamin === "P") {
        totalGender[jenis_kelamin] = (totalGender[jenis_kelamin] || 0) + 1;
      }

      // Ambil 4 karakter pertama dari nama_periode_masuk sebagai angkatan
      const angkatan = nama_periode_masuk?.substring(0, 4);
      if (angkatan) {
        // Inisialisasi objek angkatan jika belum ada
        if (!genderByAngkatan[angkatan]) {
          genderByAngkatan[angkatan] = { L: 0, P: 0 };
        }

        // Hitung gender per angkatan
        if (jenis_kelamin === "L" || jenis_kelamin === "P") {
          genderByAngkatan[angkatan][jenis_kelamin] = (genderByAngkatan[angkatan][jenis_kelamin] || 0) + 1;
        }
      }
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET Count Gender Mahasiswa Success",
      totalGender,
      genderByAngkatan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMahasiswa,
  getMahasiswaById,
  getMahasiswaByProdiId,
  getMahasiswaByAngkatanId,
  getMahasiswaByStatusMahasiswaId,
  getMahasiswaByProdiAndAngkatanId,
  importMahasiswas,
  getMahasiswaActive,
  getIpsMahasiswaActive,
  getKRSMahasiswaBySemesterAktif,
  getCountGenderMahasiswa,
};
