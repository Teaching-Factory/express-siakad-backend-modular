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
  DetailNilaiPerkuliahanKelas,
  RiwayatNilaiMahasiswa,
  Periode,
  PesertaKelasKuliah,
  PerkuliahanMahasiswa,
  DetailPerkuliahanMahasiswa,
  AktivitasKuliahMahasiswa,
  AnggotaAktivitasMahasiswa,
  KonversiKampusMerdeka,
  RekapKHSMahasiswa,
  RekapKRSMahasiswa,
  DataLengkapMahasiswaProdi,
} = require("../../models");
const axios = require("axios");
const { getToken } = require("././api-feeder/get-token");
const { fetchAllMahasiswaLulusDOIds } = require("././mahasiswa-lulus-do");

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

    // Ambil daftar ID mahasiswa yang sudah lulus atau DO
    const mahasiswaLulusDoIds = await fetchAllMahasiswaLulusDOIds();

    // Cari data mahasiswa berdasarkan id_periode yang ada dalam periodeIdList dan tahun angkatan
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        id_prodi: prodiId,
        nama_periode_masuk: { [Op.like]: `${tahunAngkatan}/%` },
        id_registrasi_mahasiswa: { [Op.notIn]: mahasiswaLulusDoIds },
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

// api untuk get data mahasiswa yang kurang
const getBiodataMahasiswaFromFeederByNik = async (nik) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetBiodataMahasiswa",
      token: token,
      filter: `nik='${nik}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataBiodataMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const biodata_mahasiswa of dataBiodataMahasiswa) {
      // Periksa apakah data sudah ada di tabel
      const existingBiodataMahasiswa = await BiodataMahasiswa.findOne({
        where: {
          id_mahasiswa: biodata_mahasiswa.id_mahasiswa,
        },
      });

      let id_wilayah = null;

      // Periksa apakah id_wilayah Wilayah
      const wilayah = await Wilayah.findOne({
        where: {
          id_wilayah: biodata_mahasiswa.id_wilayah,
        },
      });

      // Jika ditemukan, simpan nilainya
      if (wilayah) {
        id_wilayah = wilayah.id_wilayah;
      }

      if (!existingBiodataMahasiswa) {
        // Data belum ada, buat entri baru di database
        let data_tanggal_lahir_ayah = null;
        let data_tanggal_lahir_ibu = null;
        let data_tanggal_lahir_wali = null;

        // tanggal lahir ayah
        if (biodata_mahasiswa.tanggal_lahir_ayah != null) {
          const dateParts = biodata_mahasiswa.tanggal_lahir_ayah.split("-");
          data_tanggal_lahir_ayah = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        }

        // tanggal lahir ibu
        if (biodata_mahasiswa.tanggal_lahir_ibu != null) {
          const dateParts = biodata_mahasiswa.tanggal_lahir_ibu.split("-");
          data_tanggal_lahir_ibu = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        }

        // tanggal lahir wali
        if (biodata_mahasiswa.tanggal_lahir_wali != null) {
          const dateParts = biodata_mahasiswa.tanggal_lahir_wali.split("-");
          data_tanggal_lahir_wali = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        }

        await BiodataMahasiswa.create({
          id_mahasiswa: biodata_mahasiswa.id_mahasiswa,
          tempat_lahir: biodata_mahasiswa.tempat_lahir,
          nik: biodata_mahasiswa.nik,
          nisn: biodata_mahasiswa.nisn,
          npwp: biodata_mahasiswa.npwp,
          kewarganegaraan: biodata_mahasiswa.kewarganegaraan,
          jalan: biodata_mahasiswa.jalan,
          dusun: biodata_mahasiswa.dusun,
          rt: biodata_mahasiswa.rt,
          rw: biodata_mahasiswa.rw,
          kelurahan: biodata_mahasiswa.kelurahan,
          kode_pos: biodata_mahasiswa.kode_pos,
          telepon: biodata_mahasiswa.telepon,
          handphone: biodata_mahasiswa.handphone,
          email: biodata_mahasiswa.email,
          penerima_kps: biodata_mahasiswa.penerima_kps,
          nomor_kps: biodata_mahasiswa.nomor_kps,
          nik_ayah: biodata_mahasiswa.nik_ayah,
          nama_ayah: biodata_mahasiswa.nama_ayah,
          tanggal_lahir_ayah: data_tanggal_lahir_ayah,
          nik_ibu: biodata_mahasiswa.nik_ibu,
          nama_ibu_kandung: biodata_mahasiswa.nama_ibu_kandung,
          tanggal_lahir_ibu: data_tanggal_lahir_ibu,
          nama_wali: biodata_mahasiswa.nama_wali,
          tanggal_lahir_wali: data_tanggal_lahir_wali,
          last_sync: new Date(),
          id_feeder: biodata_mahasiswa.id_mahasiswa,
          id_wilayah: id_wilayah,
          id_jenis_tinggal: biodata_mahasiswa.id_jenis_tinggal,
          id_alat_transportasi: biodata_mahasiswa.id_alat_transportasi,
          id_pendidikan_ayah: biodata_mahasiswa.id_pendidikan_ayah,
          id_pekerjaan_ayah: biodata_mahasiswa.id_pekerjaan_ayah,
          id_penghasilan_ayah: biodata_mahasiswa.id_penghasilan_ayah,
          id_pendidikan_ibu: biodata_mahasiswa.id_pendidikan_ibu,
          id_pekerjaan_ibu: biodata_mahasiswa.id_pekerjaan_ibu,
          id_penghasilan_ibu: biodata_mahasiswa.id_penghasilan_ibu,
          id_pendidikan_wali: biodata_mahasiswa.id_pendidikan_wali,
          id_pekerjaan_wali: biodata_mahasiswa.id_pekerjaan_wali,
          id_penghasilan_wali: biodata_mahasiswa.id_penghasilan_wali,
          id_kebutuhan_khusus_mahasiswa: biodata_mahasiswa.id_kebutuhan_khusus_mahasiswa,
          id_kebutuhan_khusus_ayah: biodata_mahasiswa.id_kebutuhan_khusus_ayah,
          id_kebutuhan_khusus_ibu: biodata_mahasiswa.id_kebutuhan_khuibuayah,
        });

        console.log("Create Biodata Mahasiswa Success", biodata_mahasiswa.id_mahasiswa);
      }
    }
  } catch (error) {
    console.error("Create Biodata Mahasiswa Failed", error.message);
  }
};

const getMahasiswaFromFeederByNim = async (nim) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetListMahasiswa",
      token: token,
      filter: `nim='${nim}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const data_mahasiswa of dataMahasiswa) {
      // Periksa apakah data sudah ada di tabel
      const existingMahasiswa = await Mahasiswa.findOne({
        where: {
          id_registrasi_mahasiswa: data_mahasiswa.id_registrasi_mahasiswa,
        },
      });

      if (!existingMahasiswa) {
        // Data belum ada, buat entri baru di database
        const dateParts = data_mahasiswa.tanggal_lahir.split("-"); // Membagi tanggal menjadi bagian-bagian
        const tanggal_lahir = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Format tanggal

        await Mahasiswa.create({
          id_registrasi_mahasiswa: data_mahasiswa.id_registrasi_mahasiswa,
          nama_mahasiswa: data_mahasiswa.nama_mahasiswa,
          jenis_kelamin: data_mahasiswa.jenis_kelamin,
          tanggal_lahir: tanggal_lahir,
          nipd: data_mahasiswa.nipd,
          ipk: data_mahasiswa.ipk,
          total_sks: data_mahasiswa.total_sks,
          nama_status_mahasiswa: data_mahasiswa.nama_status_mahasiswa,
          nim: data_mahasiswa.nim,
          nama_periode_masuk: data_mahasiswa.nama_periode_masuk,
          last_sync: new Date(),
          id_feeder: data_mahasiswa.id_registrasi_mahasiswa,
          id_sms: data_mahasiswa.id_sms,
          id_mahasiswa: data_mahasiswa.id_mahasiswa,
          id_perguruan_tinggi: data_mahasiswa.id_perguruan_tinggi,
          id_agama: data_mahasiswa.id_agama,
          id_semester: data_mahasiswa.id_periode,
          id_prodi: data_mahasiswa.id_prodi,
        });

        console.log("Create Mahasiswa Success", data_mahasiswa.id_registrasi_mahasiswa);
      }
    }
  } catch (error) {
    console.error("Create Mahasiswa Failed", error.message);
  }
};

const getRiwayatPendidikanMahasiswaFromFeederByNim = async (nim) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetListRiwayatPendidikanMahasiswa",
      token: token,
      filter: `nim='${nim}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataRiwayatPendidikanMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const riwayat_pendidikan_mahasiswa of dataRiwayatPendidikanMahasiswa) {
      // Periksa apakah data sudah ada di tabel
      const existingRiwayatPendidikanMahasiswa = await RiwayatPendidikanMahasiswa.findOne({
        where: {
          id_registrasi_mahasiswa: riwayat_pendidikan_mahasiswa.id_registrasi_mahasiswa,
        },
      });

      if (!existingRiwayatPendidikanMahasiswa) {
        let tanggal_daftar;
        let id_prodi_asal = null;

        const prodi = await Prodi.findOne({
          where: {
            id_prodi: riwayat_pendidikan_mahasiswa.id_prodi_asal,
          },
        });

        // Jika ditemukan, simpan nilainya
        if (prodi) {
          id_prodi_asal = riwayat_pendidikan_mahasiswa.id_prodi_asal;
        }

        // melakukan pengecekan data tanggal
        if (riwayat_pendidikan_mahasiswa.tanggal_daftar != null) {
          const date_start = riwayat_pendidikan_mahasiswa.tanggal_daftar.split("-");
          tanggal_daftar = `${date_start[2]}-${date_start[1]}-${date_start[0]}`;
        }

        await RiwayatPendidikanMahasiswa.create({
          tanggal_daftar: tanggal_daftar,
          keterangan_keluar: riwayat_pendidikan_mahasiswa.keterangan_keluar,
          sks_diakui: riwayat_pendidikan_mahasiswa.sks_diakui,
          nama_ibu_kandung: riwayat_pendidikan_mahasiswa.nama_ibu_kandung,
          biaya_masuk: riwayat_pendidikan_mahasiswa.biaya_masuk,
          id_registrasi_mahasiswa: riwayat_pendidikan_mahasiswa.id_registrasi_mahasiswa,
          id_jalur_daftar: riwayat_pendidikan_mahasiswa.id_jalur_daftar,
          id_jenis_daftar: riwayat_pendidikan_mahasiswa.id_jenis_daftar,
          id_jalur_masuk: riwayat_pendidikan_mahasiswa.id_jalur_masuk,
          id_periode_masuk: riwayat_pendidikan_mahasiswa.id_periode_masuk,
          id_jenis_keluar: riwayat_pendidikan_mahasiswa.id_jenis_keluar,
          id_prodi: riwayat_pendidikan_mahasiswa.id_prodi,
          id_pembiayaan: riwayat_pendidikan_mahasiswa.id_pembiayaan,
          id_bidang_minat: riwayat_pendidikan_mahasiswa.id_bidang_minat,
          id_perguruan_tinggi_asal: riwayat_pendidikan_mahasiswa.id_perguruan_tinggi_asal,
          id_prodi_asal: id_prodi_asal,
          last_sync: new Date(),
          id_feeder: riwayat_pendidikan_mahasiswa.id_registrasi_mahasiswa,
        });

        console.log("Create Riwayat Pendidikan Mahasiswa Success", riwayat_pendidikan_mahasiswa.id_registrasi_mahasiswa);
      }
    }
  } catch (error) {
    console.error("Create Riwayat Pendidikan Mahasiswa Failed", error.message);
  }
};

const getDetailNilaiPerkuliahanKelasMahasiswaFromFeederByNim = async (nim) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    // get setting global semester aktif
    const setting_global_semester_aktif = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    // Ambil ID Semester Aktif dan potong menjadi 4 karakter pertama
    const tahun_angkatan = setting_global_semester_aktif.id_semester_aktif.slice(0, 4);

    // Ambil data angkatan berdasarkan tahun semester aktif yang sesuai
    const angkatan = await Angkatan.findOne({
      where: {
        tahun: tahun_angkatan,
      },
    });

    const requestBody = {
      act: "GetDetailNilaiPerkuliahanKelas",
      token: token,
      filter: `nim='${nim}' and angkatan='${angkatan.tahun}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataDetailNilaiPerkuliahanKelas = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const detail_nilai_perkuliahan_kelas of dataDetailNilaiPerkuliahanKelas) {
      const existingDetailNilaiPerkuliahanKelas = await DetailNilaiPerkuliahanKelas.findOne({
        where: {
          jurusan: detail_nilai_perkuliahan_kelas.jurusan,
          angkatan: detail_nilai_perkuliahan_kelas.angkatan,
          nilai_angka: detail_nilai_perkuliahan_kelas.nilai_angka,
          nilai_indeks: detail_nilai_perkuliahan_kelas.nilai_indeks,
          nilai_huruf: detail_nilai_perkuliahan_kelas.nilai_huruf,
          id_kelas_kuliah: detail_nilai_perkuliahan_kelas.id_kelas_kuliah,
          id_registrasi_mahasiswa: detail_nilai_perkuliahan_kelas.id_registrasi_mahasiswa,
        },
      });

      if (!existingDetailNilaiPerkuliahanKelas) {
        await DetailNilaiPerkuliahanKelas.create({
          jurusan: detail_nilai_perkuliahan_kelas.jurusan,
          angkatan: detail_nilai_perkuliahan_kelas.angkatan,
          nilai_angka: detail_nilai_perkuliahan_kelas.nilai_angka,
          nilai_indeks: detail_nilai_perkuliahan_kelas.nilai_indeks,
          nilai_huruf: detail_nilai_perkuliahan_kelas.nilai_huruf,
          id_kelas_kuliah: detail_nilai_perkuliahan_kelas.id_kelas_kuliah,
          id_registrasi_mahasiswa: detail_nilai_perkuliahan_kelas.id_registrasi_mahasiswa,
        });

        console.log("Create Detail Nilai Perkuliahan Kelas Mahasiswa Success", detail_nilai_perkuliahan_kelas.id_registrasi_mahasiswa);
      }
    }
  } catch (error) {
    console.error("Create Detail Nilai Perkuliahan Kelas Mahasiswa Failed", error.message);
  }
};

const getRiwayatNilaiMahasiswaFromFeederByNim = async (nim) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    // get setting global semester aktif
    const setting_global_semester_aktif = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    // Ambil ID Semester Aktif dan potong menjadi 4 karakter pertama
    const tahun_angkatan = setting_global_semester_aktif.id_semester_aktif.slice(0, 4);

    // Ambil data angkatan berdasarkan tahun semester aktif yang sesuai
    const angkatan = await Angkatan.findOne({
      where: {
        tahun: tahun_angkatan,
      },
    });

    const requestBody = {
      act: "GetRiwayatNilaiMahasiswa",
      token: token,
      filter: `nim='${nim}' and angkatan='${angkatan.tahun}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataRiwayatNilaiMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const riwayat_nilai_mahasiswa of dataRiwayatNilaiMahasiswa) {
      let id_periode = null;

      // Periksa apakah id_periode atau periode_pelaporan ada di Periode
      const periode = await Periode.findOne({
        where: {
          periode_pelaporan: riwayat_nilai_mahasiswa.id_periode,
        },
      });

      // Jika ditemukan, simpan nilainya
      if (periode) {
        id_periode = periode.id_periode;
      }

      const existingRiwayatNilaiMahasiswa = await RiwayatNilaiMahasiswa.findOne({
        where: {
          nilai_angka: riwayat_nilai_mahasiswa.nilai_angka,
          nilai_huruf: riwayat_nilai_mahasiswa.nilai_huruf,
          nilai_indeks: riwayat_nilai_mahasiswa.nilai_indeks,
          angkatan: riwayat_nilai_mahasiswa.angkatan,
          id_registrasi_mahasiswa: riwayat_nilai_mahasiswa.id_registrasi_mahasiswa,
          id_periode: id_periode,
          id_kelas: riwayat_nilai_mahasiswa.id_kelas,
        },
      });

      if (!existingRiwayatNilaiMahasiswa) {
        await RiwayatNilaiMahasiswa.create({
          nilai_angka: riwayat_nilai_mahasiswa.nilai_angka,
          nilai_huruf: riwayat_nilai_mahasiswa.nilai_huruf,
          nilai_indeks: riwayat_nilai_mahasiswa.nilai_indeks,
          angkatan: riwayat_nilai_mahasiswa.angkatan,
          id_registrasi_mahasiswa: riwayat_nilai_mahasiswa.id_registrasi_mahasiswa,
          id_periode: id_periode,
          id_kelas: riwayat_nilai_mahasiswa.id_kelas,
        });

        console.log("Create Riwayat Nilai Mahasiswa Success", riwayat_nilai_mahasiswa.id_registrasi_mahasiswa);
      }
    }
  } catch (error) {
    console.error("Create Riwayat Nilai Mahasiswa Failed", error.message);
  }
};

const getPesertaKelasKuliahMahasiswaFromFeederByNim = async (nim) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    // get setting global semester aktif
    const setting_global_semester_aktif = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    // Ambil ID Semester Aktif dan potong menjadi 4 karakter pertama
    const tahun_angkatan = setting_global_semester_aktif.id_semester_aktif.slice(0, 4);

    // Ambil data angkatan berdasarkan tahun semester aktif yang sesuai
    const angkatan = await Angkatan.findOne({
      where: {
        tahun: tahun_angkatan,
      },
    });

    const requestBody = {
      act: "GetPesertaKelasKuliah",
      token: token,
      filter: `nim='${nim}' and angkatan='${angkatan.tahun}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataPesertaKelasKuliah = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const peserta_kelas_kuliah of dataPesertaKelasKuliah) {
      const existingPesertaKelasKuliah = await PesertaKelasKuliah.findOne({
        where: {
          angkatan: peserta_kelas_kuliah.angkatan,
          id_kelas_kuliah: peserta_kelas_kuliah.id_kelas_kuliah,
          id_registrasi_mahasiswa: peserta_kelas_kuliah.id_registrasi_mahasiswa,
        },
      });

      if (!existingPesertaKelasKuliah) {
        await PesertaKelasKuliah.create({
          angkatan: peserta_kelas_kuliah.angkatan,
          id_kelas_kuliah: peserta_kelas_kuliah.id_kelas_kuliah,
          id_registrasi_mahasiswa: peserta_kelas_kuliah.id_registrasi_mahasiswa,
        });

        console.log("Create Peserta Kelas Kuliah Mahasiswa Success", peserta_kelas_kuliah.id_registrasi_mahasiswa);
      }
    }
  } catch (error) {
    console.error("Create Peserta Kelas Kuliah Mahasiswa Failed", error.message);
  }
};

const getPerkuliahanMahasiswaFromFeederByNim = async (nim) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    // get setting global semester aktif
    const setting_global_semester_aktif = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    // Ambil ID Semester Aktif dan potong menjadi 4 karakter pertama
    const tahun_angkatan = setting_global_semester_aktif.id_semester_aktif.slice(0, 4);

    // Ambil data angkatan berdasarkan tahun semester aktif yang sesuai
    const angkatan = await Angkatan.findOne({
      where: {
        tahun: tahun_angkatan,
      },
    });

    const requestBody = {
      act: "GetListPerkuliahanMahasiswa",
      token: token,
      filter: `nim='${nim}' and angkatan='${angkatan.tahun}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataPerkuliahanMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const perkuliahan_mahasiswa of dataPerkuliahanMahasiswa) {
      const existingPerkuliahanMahasiswa = await PerkuliahanMahasiswa.findOne({
        where: {
          angkatan: perkuliahan_mahasiswa.angkatan,
          ips: perkuliahan_mahasiswa.ips,
          ipk: perkuliahan_mahasiswa.ipk,
          sks_semester: perkuliahan_mahasiswa.sks_semester,
          sks_total: perkuliahan_mahasiswa.sks_total,
          biaya_kuliah_smt: perkuliahan_mahasiswa.biaya_kuliah_smt,
          id_registrasi_mahasiswa: perkuliahan_mahasiswa.id_registrasi_mahasiswa,
          id_semester: perkuliahan_mahasiswa.id_semester,
          id_status_mahasiswa: perkuliahan_mahasiswa.id_status_mahasiswa,
          id_pembiayaan: perkuliahan_mahasiswa.id_pembiayaan,
        },
      });

      if (!existingPerkuliahanMahasiswa) {
        await PerkuliahanMahasiswa.create({
          angkatan: perkuliahan_mahasiswa.angkatan,
          ips: perkuliahan_mahasiswa.ips,
          ipk: perkuliahan_mahasiswa.ipk,
          sks_semester: perkuliahan_mahasiswa.sks_semester,
          sks_total: perkuliahan_mahasiswa.sks_total,
          biaya_kuliah_smt: perkuliahan_mahasiswa.biaya_kuliah_smt,
          id_registrasi_mahasiswa: perkuliahan_mahasiswa.id_registrasi_mahasiswa,
          id_semester: perkuliahan_mahasiswa.id_semester,
          id_status_mahasiswa: perkuliahan_mahasiswa.id_status_mahasiswa,
          id_pembiayaan: perkuliahan_mahasiswa.id_pembiayaan,
        });

        console.log("Create Perkuliahan Mahasiswa Success", perkuliahan_mahasiswa.id_registrasi_mahasiswa);
      }
    }
  } catch (error) {
    console.error("Create Perkuliahan Mahasiswa Failed", error.message);
  }
};

const getDetailPerkuliahanMahasiswaFromFeederByNim = async (nim) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    // get setting global semester aktif
    const setting_global_semester_aktif = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    // Ambil ID Semester Aktif dan potong menjadi 4 karakter pertama
    const tahun_angkatan = setting_global_semester_aktif.id_semester_aktif.slice(0, 4);

    // Ambil data angkatan berdasarkan tahun semester aktif yang sesuai
    const angkatan = await Angkatan.findOne({
      where: {
        tahun: tahun_angkatan,
      },
    });

    const requestBody = {
      act: "GetDetailPerkuliahanMahasiswa",
      token: token,
      filter: `nim='${nim}' and angkatan='${angkatan.tahun}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataDetailPerkuliahanMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const detail_perkuliahan_mahasiswa of dataDetailPerkuliahanMahasiswa) {
      const existingDetailPerkuliahanMahasiswa = await DetailPerkuliahanMahasiswa.findOne({
        angkatan: detail_perkuliahan_mahasiswa.angkatan,
        ips: detail_perkuliahan_mahasiswa.ips,
        ipk: detail_perkuliahan_mahasiswa.ipk,
        sks_semester: detail_perkuliahan_mahasiswa.sks_semester,
        sks_total: detail_perkuliahan_mahasiswa.sks_total,
        id_registrasi_mahasiswa: detail_perkuliahan_mahasiswa.id_registrasi_mahasiswa,
        id_semester: detail_perkuliahan_mahasiswa.id_semester,
        id_status_mahasiswa: detail_perkuliahan_mahasiswa.id_status_mahasiswa,
      });

      if (!existingDetailPerkuliahanMahasiswa) {
        await DetailPerkuliahanMahasiswa.create({
          angkatan: detail_perkuliahan_mahasiswa.angkatan,
          ips: detail_perkuliahan_mahasiswa.ips,
          ipk: detail_perkuliahan_mahasiswa.ipk,
          sks_semester: detail_perkuliahan_mahasiswa.sks_semester,
          sks_total: detail_perkuliahan_mahasiswa.sks_total,
          id_registrasi_mahasiswa: detail_perkuliahan_mahasiswa.id_registrasi_mahasiswa,
          id_semester: detail_perkuliahan_mahasiswa.id_semester,
          id_status_mahasiswa: detail_perkuliahan_mahasiswa.id_status_mahasiswa,
        });

        console.log("Create Detail Perkuliahan Mahasiswa Success", detail_perkuliahan_mahasiswa.id_registrasi_mahasiswa);
      }
    }
  } catch (error) {
    console.error("Create Detail Perkuliahan Mahasiswa Failed", error.message);
  }
};

const getKRSMahasiswaFromFeederByNim = async (nim) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    // get setting global semester aktif
    const setting_global_semester_aktif = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    // Ambil ID Semester Aktif dan potong menjadi 4 karakter pertama
    const tahun_angkatan = setting_global_semester_aktif.id_semester_aktif.slice(0, 4);

    // Ambil data angkatan berdasarkan tahun semester aktif yang sesuai
    const angkatan = await Angkatan.findOne({
      where: {
        tahun: tahun_angkatan,
      },
    });

    const requestBody = {
      act: "GetKRSMahasiswa",
      token: token,
      filter: `nim='${nim}' and angkatan='${angkatan.tahun}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataKRSMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const krs_mahasiswa of dataKRSMahasiswa) {
      const existingKRSMahasiswa = await KRSMahasiswa.findOne({
        where: {
          angkatan: krs_mahasiswa.angkatan,
          id_registrasi_mahasiswa: krs_mahasiswa.id_registrasi_mahasiswa,
          id_semester: krs_mahasiswa.id_periode,
          id_prodi: krs_mahasiswa.id_prodi,
          id_matkul: krs_mahasiswa.id_matkul,
          id_kelas: krs_mahasiswa.id_kelas,
        },
      });

      if (!existingKRSMahasiswa) {
        await KRSMahasiswa.create({
          angkatan: krs_mahasiswa.angkatan,
          id_registrasi_mahasiswa: krs_mahasiswa.id_registrasi_mahasiswa,
          id_semester: krs_mahasiswa.id_periode,
          id_prodi: krs_mahasiswa.id_prodi,
          id_matkul: krs_mahasiswa.id_matkul,
          id_kelas: krs_mahasiswa.id_kelas,
        });

        console.log("Create KRS Mahasiswa Success", krs_mahasiswa.id_registrasi_mahasiswa);
      }
    }
  } catch (error) {
    console.error("Create KRS Mahasiswa Failed", error.message);
  }
};

const getAktivitasKuliahMahasiswaFromFeederByNim = async (nim) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    // get setting global semester aktif
    const setting_global_semester_aktif = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    // Ambil ID Semester Aktif dan potong menjadi 4 karakter pertama
    const tahun_angkatan = setting_global_semester_aktif.id_semester_aktif.slice(0, 4);

    // Ambil data angkatan berdasarkan tahun semester aktif yang sesuai
    const angkatan = await Angkatan.findOne({
      where: {
        tahun: tahun_angkatan,
      },
    });

    const requestBody = {
      act: "GetAktivitasKuliahMahasiswa",
      token: token,
      filter: `nim='${nim}' and angkatan='${angkatan.tahun}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataAktivitasKuliahMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const aktivitas_kuliah_mahasiswa of dataAktivitasKuliahMahasiswa) {
      const existingAktivitasKuliahMahasiswa = await AktivitasKuliahMahasiswa.findOne({
        where: {
          angkatan: aktivitas_kuliah_mahasiswa.angkatan,
          ips: aktivitas_kuliah_mahasiswa.ips,
          ipk: aktivitas_kuliah_mahasiswa.ipk,
          sks_semester: aktivitas_kuliah_mahasiswa.sks_semester,
          sks_total: aktivitas_kuliah_mahasiswa.sks_total,
          biaya_kuliah_smt: aktivitas_kuliah_mahasiswa.biaya_kuliah_smt,
          id_registrasi_mahasiswa: aktivitas_kuliah_mahasiswa.id_registrasi_mahasiswa,
          id_semester: aktivitas_kuliah_mahasiswa.id_semester,
          id_prodi: aktivitas_kuliah_mahasiswa.id_prodi,
          id_status_mahasiswa: aktivitas_kuliah_mahasiswa.id_status_mahasiswa,
        },
      });

      if (!existingAktivitasKuliahMahasiswa) {
        await AktivitasKuliahMahasiswa.create({
          angkatan: aktivitas_kuliah_mahasiswa.angkatan,
          ips: aktivitas_kuliah_mahasiswa.ips,
          ipk: aktivitas_kuliah_mahasiswa.ipk,
          sks_semester: aktivitas_kuliah_mahasiswa.sks_semester,
          sks_total: aktivitas_kuliah_mahasiswa.sks_total,
          biaya_kuliah_smt: aktivitas_kuliah_mahasiswa.biaya_kuliah_smt,
          id_registrasi_mahasiswa: aktivitas_kuliah_mahasiswa.id_registrasi_mahasiswa,
          id_semester: aktivitas_kuliah_mahasiswa.id_semester,
          id_prodi: aktivitas_kuliah_mahasiswa.id_prodi,
          id_status_mahasiswa: aktivitas_kuliah_mahasiswa.id_status_mahasiswa,
        });

        console.log("Create Aktivitas Kuliah Mahasiswa Success", aktivitas_kuliah_mahasiswa.id_registrasi_mahasiswa);
      }
    }
  } catch (error) {
    console.error("Create Aktivitas Kuliah Mahasiswa Failed", error.message);
  }
};

const getAnggotaAktivitasMahasiswaFromFeederByNim = async (nim) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetListAnggotaAktivitasMahasiswa",
      token: token,
      filter: `nim='${nim}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataAnggotaAktivitasMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const anggota_kuliah_mahasiswa of dataAnggotaAktivitasMahasiswa) {
      // Periksa apakah data sudah ada di tabel
      const existingAnggotaAktivitasMahasiswa = await AnggotaAktivitasMahasiswa.findOne({
        where: {
          id_anggota: anggota_kuliah_mahasiswa.id_anggota,
        },
      });

      if (!existingAnggotaAktivitasMahasiswa) {
        // Data belum ada, buat entri baru di database
        await AnggotaAktivitasMahasiswa.create({
          id_anggota: anggota_kuliah_mahasiswa.id_anggota,
          jenis_peran: anggota_kuliah_mahasiswa.jenis_peran,
          nama_jenis_peran: anggota_kuliah_mahasiswa.nama_jenis_peran,
          last_sync: new Date(),
          id_feeder: anggota_kuliah_mahasiswa.id_anggota,
          id_aktivitas: anggota_kuliah_mahasiswa.id_aktivitas,
          id_registrasi_mahasiswa: anggota_kuliah_mahasiswa.id_registrasi_mahasiswa,
        });

        console.log("Create Anggota Aktivitas Mahasiswa Success", anggota_kuliah_mahasiswa.id_registrasi_mahasiswa);
      }
    }
  } catch (error) {
    console.error("Create Anggota Aktivitas Mahasiswa Failed", error.message);
  }
};

const getKonversiKampusMerdekaMahasiswaFromFeederByNim = async (nim) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetListKonversiKampusMerdeka",
      token: token,
      filter: `nim='${nim}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataKonversiKampusMerdeka = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const konversi_kampus_merdeka of dataKonversiKampusMerdeka) {
      // Periksa apakah data sudah ada di tabel
      const existingKonversiKampusMerdeka = await KonversiKampusMerdeka.findOne({
        where: {
          id_konversi_aktivitas: konversi_kampus_merdeka.id_konversi_aktivitas,
        },
      });

      if (!existingKonversiKampusMerdeka) {
        // Data belum ada, buat entri baru di database
        await KonversiKampusMerdeka.create({
          id_konversi_aktivitas: konversi_kampus_merdeka.id_konversi_aktivitas,
          nilai_angka: konversi_kampus_merdeka.nilai_angka,
          nilai_indeks: konversi_kampus_merdeka.nilai_indeks,
          nilai_huruf: konversi_kampus_merdeka.nilai_huruf,
          last_sync: new Date(),
          id_feeder: konversi_kampus_merdeka.id_konversi_aktivitas,
          id_matkul: konversi_kampus_merdeka.id_matkul,
          id_anggota: konversi_kampus_merdeka.id_anggota,
        });

        console.log("Create Konversi Kampus Merdeka Mahasiswa Success", konversi_kampus_merdeka.id_registrasi_mahasiswa);
      }
    }
  } catch (error) {
    console.error("Create Konversi Kampus Merdeka Mahasiswa Failed", error.message);
  }
};

const getRekapKHSMahasiswaFromFeederByNim = async (nim) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    // get setting global semester aktif
    const setting_global_semester_aktif = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    // Ambil ID Semester Aktif dan potong menjadi 4 karakter pertama
    const tahun_angkatan = setting_global_semester_aktif.id_semester_aktif.slice(0, 4);

    // Ambil data angkatan berdasarkan tahun semester aktif yang sesuai
    const angkatan = await Angkatan.findOne({
      where: {
        tahun: tahun_angkatan,
      },
    });

    const requestBody = {
      act: "GetRekapKHSMahasiswa",
      token: token,
      filter: `nim='${nim}' and angkatan='${angkatan.tahun}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Pastikan data berbentuk array agar tidak terjadi error
    const dataRekapKHSMahasiswa = Array.isArray(response.data.data) ? response.data.data : [];

    // Loop untuk menambahkan data ke dalam database
    for (const rekap_khs_mahasiswa of dataRekapKHSMahasiswa) {
      const existingRekapKHSMahasiswa = await RekapKHSMahasiswa.findOne({
        where: {
          angkatan: rekap_khs_mahasiswa.angkatan,
          nilai_angka: rekap_khs_mahasiswa.nilai_angka,
          nilai_huruf: rekap_khs_mahasiswa.nilai_huruf,
          nilai_indeks: rekap_khs_mahasiswa.nilai_indeks,
          sks_x_indeks: rekap_khs_mahasiswa.sks_x_indeks,
          id_registrasi_mahasiswa: rekap_khs_mahasiswa.id_registrasi_mahasiswa,
          id_semester: rekap_khs_mahasiswa.id_periode,
          id_prodi: rekap_khs_mahasiswa.id_prodi,
          id_matkul: rekap_khs_mahasiswa.id_matkul,
        },
      });

      if (!existingRekapKHSMahasiswa) {
        await RekapKHSMahasiswa.create({
          angkatan: rekap_khs_mahasiswa.angkatan,
          nilai_angka: rekap_khs_mahasiswa.nilai_angka,
          nilai_huruf: rekap_khs_mahasiswa.nilai_huruf,
          nilai_indeks: rekap_khs_mahasiswa.nilai_indeks,
          sks_x_indeks: rekap_khs_mahasiswa.sks_x_indeks,
          id_registrasi_mahasiswa: rekap_khs_mahasiswa.id_registrasi_mahasiswa,
          id_semester: rekap_khs_mahasiswa.id_periode,
          id_prodi: rekap_khs_mahasiswa.id_prodi,
          id_matkul: rekap_khs_mahasiswa.id_matkul,
        });

        console.log("Create Rekap KHS Mahasiswa Success", rekap_khs_mahasiswa.id_registrasi_mahasiswa);
      }
    }
  } catch (error) {
    console.error("Create Rekap KHS Mahasiswa Failed", error.message);
  }
};

const getRekapKRSMahasiswaFromFeederByNim = async (nim) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    // get setting global semester aktif
    const setting_global_semester_aktif = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    // Ambil ID Semester Aktif dan potong menjadi 4 karakter pertama
    const tahun_angkatan = setting_global_semester_aktif.id_semester_aktif.slice(0, 4);

    // Ambil data angkatan berdasarkan tahun semester aktif yang sesuai
    const angkatan = await Angkatan.findOne({
      where: {
        tahun: tahun_angkatan,
      },
    });

    const requestBody = {
      act: "GetRekapKRSMahasiswa",
      token: token,
      filter: `nim='${nim}' and angkatan='${angkatan.tahun}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Pastikan data berbentuk array agar tidak terjadi error
    const dataRekapKRSMahasiswa = Array.isArray(response.data.data) ? response.data.data : [];

    // Loop untuk menambahkan data ke dalam database
    for (const rekap_krs_mahasiswa of dataRekapKRSMahasiswa) {
      const existingRekapKRSMahasiswa = await RekapKRSMahasiswa.findOne({
        where: {
          angkatan: rekap_krs_mahasiswa.angkatan,
          id_prodi: rekap_krs_mahasiswa.id_prodi,
          id_registrasi_mahasiswa: rekap_krs_mahasiswa.id_registrasi_mahasiswa,
          id_matkul: rekap_krs_mahasiswa.id_matkul,
          id_semester: rekap_krs_mahasiswa.id_semester,
        },
      });

      if (!existingRekapKRSMahasiswa) {
        await RekapKRSMahasiswa.create({
          angkatan: rekap_krs_mahasiswa.angkatan,
          id_prodi: rekap_krs_mahasiswa.id_prodi,
          id_registrasi_mahasiswa: rekap_krs_mahasiswa.id_registrasi_mahasiswa,
          id_matkul: rekap_krs_mahasiswa.id_matkul,
          id_semester: rekap_krs_mahasiswa.id_semester,
        });

        console.log("Create Rekap KRS Mahasiswa Success", rekap_krs_mahasiswa.id_registrasi_mahasiswa);
      }
    }
  } catch (error) {
    console.error("Create Rekap KRS Mahasiswa Failed", error.message);
  }
};

const getDataLengkapMahasiswaProdiFromFeederByNim = async (nim) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetDataLengkapMahasiswaProdi",
      token: token,
      filter: `nim='${nim}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataDataLengkapMahasiswaProdi = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const data_lengkap_mahasiswa_prodi of dataDataLengkapMahasiswaProdi) {
      let id_prodi_asal = null;
      let id_wilayah = null;

      // Periksa apakah id_prodi_asal ada di tabel Prodi
      const prodi = await Prodi.findOne({
        where: {
          id_prodi: data_lengkap_mahasiswa_prodi.id_prodi_asal,
        },
      });

      // Periksa apakah id_wilayah ada di tabel Wilayah
      const wilayah = await Wilayah.findOne({
        where: {
          id_wilayah: data_lengkap_mahasiswa_prodi.id_wilayah,
        },
      });

      // Jika ditemukan, simpan nilainya
      if (prodi) {
        id_prodi_asal = prodi.id_prodi;
      }

      if (wilayah) {
        id_wilayah = wilayah.id_wilayah;
      }

      const existingDataLengkapMahasiswaProdi = await DataLengkapMahasiswaProdi.findOne({
        where: {
          nama_status_mahasiswa: data_lengkap_mahasiswa_prodi.nama_status_mahasiswa,
          jalur_masuk: data_lengkap_mahasiswa_prodi.jalur_masuk,
          nama_jalur_masuk: data_lengkap_mahasiswa_prodi.nama_jalur_masuk,
          sks_diakui: data_lengkap_mahasiswa_prodi.sks_diakui,
          id_prodi: data_lengkap_mahasiswa_prodi.id_prodi,
          id_periode_masuk: data_lengkap_mahasiswa_prodi.id_periode_masuk,
          id_registrasi_mahasiswa: data_lengkap_mahasiswa_prodi.id_registrasi_mahasiswa,
          id_agama: data_lengkap_mahasiswa_prodi.id_agama,
          id_wilayah: id_wilayah,
          id_jenis_tinggal: data_lengkap_mahasiswa_prodi.id_jenis_tinggal,
          id_alat_transportasi: data_lengkap_mahasiswa_prodi.id_alat_transportasi,
          id_pendidikan_ayah: data_lengkap_mahasiswa_prodi.id_pendidikan_ayah,
          id_pendidikan_ibu: data_lengkap_mahasiswa_prodi.id_pendidikan_ibu,
          id_pendidikan_wali: data_lengkap_mahasiswa_prodi.id_pendidikan_wali,
          id_pekerjaan_ayah: data_lengkap_mahasiswa_prodi.id_pekerjaan_ayah,
          id_pekerjaan_ibu: data_lengkap_mahasiswa_prodi.id_pekerjaan_ibu,
          id_pekerjaan_wali: data_lengkap_mahasiswa_prodi.id_pekerjaan_wali,
          id_penghasilan_ayah: data_lengkap_mahasiswa_prodi.id_penghasilan_ayah,
          id_penghasilan_ibu: data_lengkap_mahasiswa_prodi.id_penghasilan_ibu,
          id_penghasilan_wali: data_lengkap_mahasiswa_prodi.id_penghasilan_wali,
          id_kebutuhan_khusus_mahasiswa: data_lengkap_mahasiswa_prodi.id_kebutuhan_khusus_mahasiswa,
          id_kebutuhan_khusus_ayah: data_lengkap_mahasiswa_prodi.id_kebutuhan_khusus_ayah,
          id_kebutuhan_khusus_ibu: data_lengkap_mahasiswa_prodi.id_kebutuhan_khusus_ibu,
          id_perguruan_tinggi_asal: data_lengkap_mahasiswa_prodi.id_perguruan_tinggi_asal,
          id_prodi_asal: id_prodi_asal,
        },
      });

      if (!existingDataLengkapMahasiswaProdi) {
        await DataLengkapMahasiswaProdi.create({
          nama_status_mahasiswa: data_lengkap_mahasiswa_prodi.nama_status_mahasiswa,
          jalur_masuk: data_lengkap_mahasiswa_prodi.jalur_masuk,
          nama_jalur_masuk: data_lengkap_mahasiswa_prodi.nama_jalur_masuk,
          sks_diakui: data_lengkap_mahasiswa_prodi.sks_diakui,
          id_prodi: data_lengkap_mahasiswa_prodi.id_prodi,
          id_periode_masuk: data_lengkap_mahasiswa_prodi.id_periode_masuk,
          id_registrasi_mahasiswa: data_lengkap_mahasiswa_prodi.id_registrasi_mahasiswa,
          id_agama: data_lengkap_mahasiswa_prodi.id_agama,
          id_wilayah: id_wilayah,
          id_jenis_tinggal: data_lengkap_mahasiswa_prodi.id_jenis_tinggal,
          id_alat_transportasi: data_lengkap_mahasiswa_prodi.id_alat_transportasi,
          id_pendidikan_ayah: data_lengkap_mahasiswa_prodi.id_pendidikan_ayah,
          id_pendidikan_ibu: data_lengkap_mahasiswa_prodi.id_pendidikan_ibu,
          id_pendidikan_wali: data_lengkap_mahasiswa_prodi.id_pendidikan_wali,
          id_pekerjaan_ayah: data_lengkap_mahasiswa_prodi.id_pekerjaan_ayah,
          id_pekerjaan_ibu: data_lengkap_mahasiswa_prodi.id_pekerjaan_ibu,
          id_pekerjaan_wali: data_lengkap_mahasiswa_prodi.id_pekerjaan_wali,
          id_penghasilan_ayah: data_lengkap_mahasiswa_prodi.id_penghasilan_ayah,
          id_penghasilan_ibu: data_lengkap_mahasiswa_prodi.id_penghasilan_ibu,
          id_penghasilan_wali: data_lengkap_mahasiswa_prodi.id_penghasilan_wali,
          id_kebutuhan_khusus_mahasiswa: data_lengkap_mahasiswa_prodi.id_kebutuhan_khusus_mahasiswa,
          id_kebutuhan_khusus_ayah: data_lengkap_mahasiswa_prodi.id_kebutuhan_khusus_ayah,
          id_kebutuhan_khusus_ibu: data_lengkap_mahasiswa_prodi.id_kebutuhan_khusus_ibu,
          id_perguruan_tinggi_asal: data_lengkap_mahasiswa_prodi.id_perguruan_tinggi_asal,
          id_prodi_asal: id_prodi_asal,
        });

        console.log("Create Data Lengkap Mahasiswa Prodi Success", data_lengkap_mahasiswa_prodi.id_registrasi_mahasiswa);
      }
    }
  } catch (error) {
    console.error("Create Data Lengkap Mahasiswa Prodi Failed", error.message);
  }
};

const getAllDataMahasiswaFromFeeder = async (req, res, next) => {
  try {
    const { mahasiswas } = req.body; // Ambil data mahasiswas dari request body

    for (const mahasiswa of mahasiswas) {
      const { nim, nik } = mahasiswa;

      // Ambil mahasiswa dari database
      let dataMahasiswa = await Mahasiswa.findOne({
        where: {
          nim: nim,
        },
        include: [
          {
            model: BiodataMahasiswa,
            where: {
              nik: nik,
            },
          },
        ],
      });

      if (!dataMahasiswa) {
        // get dan create data mahasiswa dari feeder ke local
        await getBiodataMahasiswaFromFeederByNik(nik); // create data biodata mahasiswa
        await getMahasiswaFromFeederByNim(nim); // create data mahasiswa
        await getRiwayatPendidikanMahasiswaFromFeederByNim(nim); // create data riwayat pendidikan mahasiswa
        await getDetailNilaiPerkuliahanKelasMahasiswaFromFeederByNim(nim); // create data detail nilai perkuliahan kelas
        await getRiwayatNilaiMahasiswaFromFeederByNim(nim); // create data riwayat nilai mahasiswa
        await getPesertaKelasKuliahMahasiswaFromFeederByNim(nim); // create data peserta kelas kuliah
        await getPerkuliahanMahasiswaFromFeederByNim(nim); // create data perkuliahan mahasiswa
        await getDetailPerkuliahanMahasiswaFromFeederByNim(nim); // create data detail perkuliahan mahasiswa
        await getKRSMahasiswaFromFeederByNim(nim); // create data krs mahasiswa
        await getAktivitasKuliahMahasiswaFromFeederByNim(nim); // create data aktivitas kuliah mahasiswa
        await getAnggotaAktivitasMahasiswaFromFeederByNim(nim); // create data anggota aktivitas mahasiswa
        await getKonversiKampusMerdekaMahasiswaFromFeederByNim(nim); // create data konversi kampus merdeka
        await getRekapKHSMahasiswaFromFeederByNim(nim); // create data rekap khs mahasiswa
        await getRekapKRSMahasiswaFromFeederByNim(nim); // create data rekap krs mahasiswa
        await getDataLengkapMahasiswaProdiFromFeederByNim(nim); // create data lengkap mahasiswa prodi
      } else if (dataMahasiswa) {
        console.log("Mahasiswa sudah ditambahkan", mahasiswa.id_registrasi_mahasiswa);
      }
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Data Mahasiswa From Feeder Success",
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
  getAllDataMahasiswaFromFeeder,
};
