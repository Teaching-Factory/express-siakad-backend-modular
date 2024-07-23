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
  SemesterAktif,
  DosenWali,
  Dosen,
  JenjangPendidikan,
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

    const perguruan_tinggi = await PerguruanTinggi.findOne({
      where: {
        nama_singkat: "UBI",
      },
    });

    const filePath = req.file.path;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error("Worksheet not found in the Excel file");
    }

    let mahasiswaData = [];
    const riwayatPendidikanPromises = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 1) {
        const nim = row.getCell(2).value;
        const nisn = row.getCell(3).value;
        const nama = row.getCell(4).value;
        const nik = row.getCell(5).value;
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
        const jenis_pendaftaran = row.getCell(17).value;
        const jalur_pendaftaran = row.getCell(18).value;
        const kode_pt_asal = row.getCell(19).value;
        const kode_prodi_asal = row.getCell(20).value;
        const biaya_awal_masuk = row.getCell(21).value;
        const jenis_pembiayaan = row.getCell(22).value;

        // format data
        const formattedNoHandphone = no_handphone ? `0${no_handphone.toString()}` : null;

        mahasiswaData.push(
          (async () => {
            let id_wilayah = null;
            let id_agama = null;
            let id_jenis_daftar = null;
            let id_jalur_masuk = null;
            let id_prodi = null;
            let id_pembiayaan = null;
            let id_perguruan_tinggi_asal = null;
            let id_prodi_asal = null;
            let id_periode = null;

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

            if (kode_pt_asal) {
              const perguruan_tinggi_asal = await PerguruanTinggi.findOne({ where: { kode_perguruan_tinggi: kode_pt_asal } });
              if (perguruan_tinggi_asal) id_perguruan_tinggi_asal = perguruan_tinggi_asal.id_perguruan_tinggi;
            }

            if (kode_prodi_asal) {
              const prodi_asal = await Prodi.findOne({ where: { kode_program_studi: kode_prodi_asal } });
              if (prodi_asal) id_prodi_asal = prodi_asal.id_prodi;
            }

            const currentYear = new Date().getFullYear().toString();
            const id_semester = currentYear + "1";

            const semester = await Semester.findOne({ where: { id_semester: id_semester } });

            const biodata_mahasiswa = {
              tempat_lahir: tempat_lahir,
              nik: nik,
              nisn: nisn,
              npwp: null,
              kewarganegaraan: "Indonesia",
              jalan: null,
              dusun: null,
              rt: null,
              rw: null,
              kelurahan: desa_kelurahan,
              kode_pos: null,
              telepon: null,
              handphone: formattedNoHandphone,
              email: email,
              penerima_kps: 0,
              nomor_kps: null,
              nik_ayah: null,
              nama_ayah: null,
              tanggal_lahir_ayah: null,
              nik_ibu: null,
              nama_ibu_kandung: nama_ibu_kandung,
              tanggal_lahir_ibu: null,
              nama_wali: null,
              tanggal_lahir_wali: null,
              id_wilayah: id_wilayah,
              id_jenis_tinggal: null,
              id_alat_transportasi: null,
              id_pendidikan_ayah: null,
              id_pekerjaan_ayah: null,
              id_penghasilan_ayah: null,
              id_pendidikan_ibu: null,
              id_pekerjaan_ibu: null,
              id_penghasilan_ibu: null,
              id_pendidikan_wali: null,
              id_pekerjaan_wali: null,
              id_penghasilan_wali: null,
              id_kebutuhan_khusus_mahasiswa: null,
              id_kebutuhan_khusus_ayah: null,
              id_kebutuhan_khusus_ibu: null,
            };

            const createdBiodataMahasiswa = await BiodataMahasiswa.create(biodata_mahasiswa);

            let createdMahasiswa = null;
            if (nama && jenis_kelamin && tanggal_lahir && nim) {
              createdMahasiswa = await Mahasiswa.create({
                nama_mahasiswa: nama,
                jenis_kelamin: jenis_kelamin,
                tanggal_lahir: tanggal_lahir,
                nipd: null,
                ipk: null,
                total_sks: null,
                nama_status_mahasiswa: null,
                nim: nim,
                nama_periode_masuk: null,
                id_sms: null,
                id_mahasiswa: createdBiodataMahasiswa.id_mahasiswa,
                id_perguruan_tinggi: perguruan_tinggi.id_perguruan_tinggi,
                id_agama: id_agama,
                id_semester: id_semester,
                id_prodi: id_prodi,
              });
              if (createdMahasiswa) {
                mahasiswaData.push(createdMahasiswa);
              }
            }

            if (tanggal_masuk && createdMahasiswa) {
              const riwayatPendidikan = await RiwayatPendidikanMahasiswa.create({
                tanggal_daftar: tanggal_masuk,
                keterangan_keluar: null,
                sks_diakui: null,
                nama_ibu_kandung: nama_ibu_kandung,
                biaya_masuk: biaya_awal_masuk,
                id_registrasi_mahasiswa: createdMahasiswa.id_registrasi_mahasiswa,
                id_jenis_daftar: id_jenis_daftar,
                id_jalur_daftar: id_jalur_masuk,
                id_periode_masuk: semester.id_semester,
                id_jenis_keluar: null,
                id_prodi: id_prodi,
                id_pembiayaan: id_pembiayaan,
                id_bidang_minat: null,
                id_perguruan_tinggi_asal: id_perguruan_tinggi_asal,
                id_prodi_asal: id_prodi_asal,
              });

              riwayatPendidikanPromises.push(riwayatPendidikan);
            }
          })()
        );
      }
    });

    await Promise.all(mahasiswaData);
    await Promise.all(riwayatPendidikanPromises);
    mahasiswaData = mahasiswaData.filter((item) => Object.keys(item).length !== 0);

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

    // get data semester aktif
    const semester_aktif = await SemesterAktif.findOne({
      where: {
        status: true,
      },
      include: [{ model: Semester }],
    });

    if (!semester_aktif) {
      return res.status(404).json({
        message: "Status Aktif not found",
      });
    }

    // get data dosen wali sekarang
    let dosen_wali = null;
    dosen_wali = await DosenWali.findOne({
      where: {
        id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
        id_tahun_ajaran: semester_aktif.Semester.id_tahun_ajaran,
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
  const token = await getToken();

  // Mendapatkan semua data KHS mahasiswa untuk menghitung IPK
  const requestBody = {
    act: "GetRekapKHSMahasiswa",
    token: `${token}`,
    filter: `id_registrasi_mahasiswa='${mahasiswa.id_registrasi_mahasiswa}'`,
  };

  // Menggunakan token untuk mengambil data
  const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

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
};
