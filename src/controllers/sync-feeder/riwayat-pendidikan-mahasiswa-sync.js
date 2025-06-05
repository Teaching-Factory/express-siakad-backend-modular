const { RiwayatPendidikanMahasiswa, RiwayatPendidikanMahasiswaSync, BiodataMahasiswa, Mahasiswa, Prodi } = require("../../../models");
const { getToken } = require("../../modules/api-feeder/data-feeder/get-token");
const { getAllDataMahasiswaFromFeeder } = require("../../modules/mahasiswa/controller");
const axios = require("axios");

async function getRiwayatPendidikanMahasiswaFromFeeder(semesterId, req, res, next) {
  try {
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetListRiwayatPendidikanMahasiswa",
      token: token,
      filter: `id_periode_masuk='${semesterId}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

async function getRiwayatPendidikanMahasiswaFromLocal(semesterId, req, res, next) {
  try {
    return await RiwayatPendidikanMahasiswa.findAll({
      where: {
        id_periode_masuk: semesterId,
      },
    });
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

async function getListMahasiswaById(id_mahasiswa, req, res, next) {
  try {
    if (!id_mahasiswa) {
      return res.status(400).json({
        message: "Mahasiswa ID is required",
      });
    }

    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetListMahasiswa",
      token: token,
      filter: `id_mahasiswa='${id_mahasiswa}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

async function getBiodataMahasiswaById(id_mahasiswa, req, res, next) {
  try {
    if (!id_mahasiswa) {
      return res.status(400).json({
        message: "Mahasiswa ID is required",
      });
    }

    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetBiodataMahasiswa",
      token: token,
      filter: `id_mahasiswa='${id_mahasiswa}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk memformat tanggal ke format dd-mm-yyyy
function convertToDDMMYYYY(localDate) {
  if (!localDate) {
    return null; // Kembalikan null jika tanggal kosong
  }

  const [year, month, day] = localDate.split("-"); // Pisahkan berdasarkan "-"
  return `${day}-${month}-${year}`; // Gabungkan dalam urutan dd-mm-yyyy
}

// Fungsi pembanding nilai
function areEqual(value1, value2) {
  return value1 === value2 || (value1 == null && value2 == null);
}

async function matchingcDataRiwayatPendidikanMahasiswa(req, res, next) {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    // get riwayat pendidikan mahasiswa dari local dan feeder
    const riwayatPendidikanMahasiswaFeeder = await getRiwayatPendidikanMahasiswaFromFeeder(semesterId);
    const riwayatPendidikanMahasiswaLocal = await getRiwayatPendidikanMahasiswaFromLocal(semesterId);

    // Buat map untuk data Feeder
    const riwayatPendidikanMahasiswaFeederMap = riwayatPendidikanMahasiswaFeeder.reduce((map, riwayatPendMahasiswa) => {
      map[riwayatPendMahasiswa.id_registrasi_mahasiswa] = riwayatPendMahasiswa;
      return map;
    }, {});

    // Perbarui logika sinkronisasi
    for (let localRiwayatPendMahasiswa of riwayatPendidikanMahasiswaLocal) {
      const feederRiwayatPendMahasiswa = riwayatPendidikanMahasiswaFeederMap[localRiwayatPendMahasiswa.id_feeder];

      // get biodata mahasiswa yang terkait dengan localRiwayatPendMahasiswa
      let biodataMahasiswaLocal = await BiodataMahasiswa.findOne({
        include: [
          {
            model: Mahasiswa,
            where: {
              id_registrasi_mahasiswa: localRiwayatPendMahasiswa.id_registrasi_mahasiswa,
            },
          },
        ],
      });

      if (!biodataMahasiswaLocal) {
        console.warn(`Biodata mahasiswa ${localRiwayatPendMahasiswa.id_registrasi_mahasiswa} tidak ditemukan. Melewatkan data ini.`);
        continue;
      }

      const existingSync = await RiwayatPendidikanMahasiswaSync.findOne({
        where: {
          id_riwayat_pend_mhs: localRiwayatPendMahasiswa.id_riwayat_pend_mhs,
          jenis_singkron: feederRiwayatPendMahasiswa ? "update" : "create",
          status: false,
          id_feeder: feederRiwayatPendMahasiswa ? localRiwayatPendMahasiswa.id_feeder : null,
        },
      });

      if (existingSync) {
        console.log(`Data riwayat pendidikan mahasiswa ${localRiwayatPendMahasiswa.id_riwayat_pend_mhs} sudah disinkronisasi.`);
        continue;
      }

      // Jika data lokal tidak ada di Feeder, tambahkan sebagai create
      if (!feederRiwayatPendMahasiswa) {
        await RiwayatPendidikanMahasiswaSync.create({
          id_riwayat_pend_mhs: localRiwayatPendMahasiswa.id_riwayat_pend_mhs,
          jenis_singkron: "create",
          status: false,
          id_feeder: null,
        });
        console.log(`Data riwayat pendidikan mahasiswa ${localRiwayatPendMahasiswa.id_riwayat_pend_mhs} ditambahkan ke sinkronisasi dengan jenis 'create'.`);
      } else {
        // Perbarui logika update untuk juga mengecek id_mahasiswa (di kolom feeder)
        const isUpdated = compareRiwayatPendidikanMahasiswa(localRiwayatPendMahasiswa, feederRiwayatPendMahasiswa, biodataMahasiswaLocal);

        if (isUpdated) {
          await RiwayatPendidikanMahasiswaSync.create({
            id_riwayat_pend_mhs: localRiwayatPendMahasiswa.id_riwayat_pend_mhs,
            jenis_singkron: "update",
            status: false,
            id_feeder: localRiwayatPendMahasiswa.id_feeder,
          });
          console.log(`Data riwayat pendidikan mahasiswa ${localRiwayatPendMahasiswa.id_riwayat_pend_mhs} ditambahkan ke sinkronisasi dengan jenis 'update'.`);
        }
      }
    }

    // Fungsi pembanding riwayat pendidikan mahasiwa
    function compareRiwayatPendidikanMahasiswa(localRiwayatPendMahasiswa, feederRiwayatPendMahasiswa, biodataMahasiswaLocal) {
      let formatTanggalDaftarLocal = convertToDDMMYYYY(localRiwayatPendMahasiswa.tanggal_daftar);
      let idPembiayaanLocal = String(localRiwayatPendMahasiswa.id_pembiayaan);
      const formattedBiayaMasuk = localRiwayatPendMahasiswa.biaya_masuk.toFixed(2);

      return (
        biodataMahasiswaLocal.id_feeder !== feederRiwayatPendMahasiswa.id_mahasiswa ||
        localRiwayatPendMahasiswa.id_jenis_daftar !== feederRiwayatPendMahasiswa.id_jenis_daftar ||
        !areEqual(localRiwayatPendMahasiswa.id_jalur_daftar, feederRiwayatPendMahasiswa.id_jalur_daftar) ||
        localRiwayatPendMahasiswa.id_periode_masuk !== feederRiwayatPendMahasiswa.id_periode_masuk ||
        !areEqual(localRiwayatPendMahasiswa.id_jenis_keluar, feederRiwayatPendMahasiswa.id_jenis_keluar) ||
        !areEqual(formattedBiayaMasuk, feederRiwayatPendMahasiswa.biaya_masuk) ||
        localRiwayatPendMahasiswa.id_prodi !== feederRiwayatPendMahasiswa.id_prodi ||
        !areEqual(localRiwayatPendMahasiswa.sks_diakui, feederRiwayatPendMahasiswa.sks_diakui) ||
        !areEqual(localRiwayatPendMahasiswa.id_perguruan_tinggi_asal, feederRiwayatPendMahasiswa.id_perguruan_tinggi_asal) ||
        !areEqual(localRiwayatPendMahasiswa.id_prodi_asal, feederRiwayatPendMahasiswa.id_prodi_asal) ||
        !areEqual(idPembiayaanLocal, feederRiwayatPendMahasiswa.id_pembiayaan) ||
        !areEqual(localRiwayatPendMahasiswa.id_bidang_minat, feederRiwayatPendMahasiswa.id_bidang_minat) ||
        formatTanggalDaftarLocal !== feederRiwayatPendMahasiswa.tanggal_daftar ||
        !areEqual(localRiwayatPendMahasiswa.keterangan_keluar, feederRiwayatPendMahasiswa.keterangan_keluar) ||
        localRiwayatPendMahasiswa.nama_ibu_kandung !== feederRiwayatPendMahasiswa.nama_ibu_kandung
      );
    }

    // mengecek jikalau data riwayat pendidikan mahasiswa tidak ada di local namun ada di feeder, maka data riwayat pendidikan mahasiswa di feeder akan tercatat sebagai get
    for (let feederRiwayatPendMahasiswaId in riwayatPendidikanMahasiswaFeederMap) {
      const feederRiwayatPendMahasiswa = riwayatPendidikanMahasiswaFeederMap[feederRiwayatPendMahasiswaId];

      // Jika data Feeder tidak ada di Lokal, tambahkan dengan jenis "get"
      const localRiwayatPendMahasiswa = riwayatPendidikanMahasiswaLocal.find((riwayat_pend_mhs) => riwayat_pend_mhs.id_feeder === feederRiwayatPendMahasiswaId);

      if (!localRiwayatPendMahasiswa) {
        const existingSync = await RiwayatPendidikanMahasiswaSync.findOne({
          where: {
            id_feeder: feederRiwayatPendMahasiswa.id_registrasi_mahasiswa,
            jenis_singkron: "get",
            status: false,
            id_riwayat_pend_mhs: null,
          },
        });

        if (!existingSync) {
          await RiwayatPendidikanMahasiswaSync.create({
            id_feeder: feederRiwayatPendMahasiswa.id_registrasi_mahasiswa,
            jenis_singkron: "get",
            status: false,
            id_riwayat_pend_mhs: null,
          });
          console.log(`Data riwayat pendidikan mahasiswa ${feederRiwayatPendMahasiswa.id_registrasi_mahasiswa} ditambahkan ke sinkronisasi dengan jenis 'get'.`);
        }
      }
    }

    console.log("Matching riwayat pendidikan mahasiswa selesai.");
  } catch (error) {
    console.error("Error during matchingDataKelasKuliah:", error.message);
    throw error;
  }
}

const matchingSyncDataRiwayatPendidikanMahasiswa = async (req, res, next) => {
  try {
    await matchingcDataRiwayatPendidikanMahasiswa(req, res, next);
    res.status(200).json({ message: "Matching riwayat pendidikan mahasiswa lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

// matching khusus untuk delete
async function matchingcDataRiwayatPendidikanMahasiswaDelete(req, res, next) {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    // get riwayat pendidikan mahasiswa dari local dan feeder
    const riwayatPendidikanMahasiswaFeeder = await getRiwayatPendidikanMahasiswaFromFeeder(semesterId);
    const riwayatPendidikanMahasiswaLocal = await getRiwayatPendidikanMahasiswaFromLocal(semesterId);

    // Buat map untuk data Feeder
    const riwayatPendidikanMahasiswaFeederMap = riwayatPendidikanMahasiswaFeeder.reduce((map, riwayatPendMahasiswa) => {
      map[riwayatPendMahasiswa.id_registrasi_mahasiswa] = riwayatPendMahasiswa;
      return map;
    }, {});

    // Mencari data yang tidak ada di Feeder
    const dataTidakAdaDiFeeder = riwayatPendidikanMahasiswaLocal.filter((item) => !riwayatPendidikanMahasiswaFeederMap[item.id_feeder]);

    // Jika ada data yang harus disinkronkan
    if (dataTidakAdaDiFeeder.length > 0) {
      // Ambil semua data yang sudah ada di tabel sinkronisasi untuk mencegah duplikasi
      const existingSyncData = await RiwayatPendidikanMahasiswaSync.findAll({
        where: {
          jenis_singkron: "delete",
          status: false,
          id_feeder: null,
          id_riwayat_pend_mhs: dataTidakAdaDiFeeder.map((item) => item.id_registrasi_mahasiswa),
        },
        attributes: ["id_registrasi_mahasiswa"],
      });

      // Buat set untuk menyimpan id_registrasi_mahasiswa yang sudah ada di database
      const existingSyncIds = new Set(existingSyncData.map((item) => item.id_registrasi_mahasiswa));

      // Filter hanya data yang belum ada di tabel sinkronisasi
      const dataInsert = dataTidakAdaDiFeeder
        .filter((item) => !existingSyncIds.has(item.id_registrasi_mahasiswa))
        .map((item) => ({
          jenis_singkron: "delete",
          status: false,
          id_feeder: null,
          id_riwayat_pend_mhs: item.id_registrasi_mahasiswa,
        }));

      // Jika ada data yang benar-benar baru, lakukan bulk insert
      if (dataInsert.length > 0) {
        await RiwayatPendidikanMahasiswaSync.bulkCreate(dataInsert);
        console.log(`${dataInsert.length} data baru berhasil ditambahkan ke sinkron sementara dengan jenis delete.`);
      } else {
        console.log("Tidak ada data baru untuk disinkronkan.");
      }
    }

    console.log("Matching riwayat pendidikan mahasiswa delete selesai.");
  } catch (error) {
    console.error("Error during matchingDataKelasKuliah:", error.message);
    throw error;
  }
}

const matchingSyncDataRiwayatPendidikanMahasiswaDelete = async (req, res, next) => {
  try {
    await matchingcDataRiwayatPendidikanMahasiswaDelete(req, res, next);
    res.status(200).json({ message: "Matching riwayat pendidikan mahasiswa delete lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

// fungsi singkron riwayat pendidikan mahasiswa
const insertRiwayatPendidikanMahasiswa = async (id_riwayat_pend_mhs, req, res, next) => {
  try {
    // get data riwayat pendidikan mahasiswa from local
    let riwayat_pendidikan_mahasiswa = await RiwayatPendidikanMahasiswa.findByPk(id_riwayat_pend_mhs);

    if (!riwayat_pendidikan_mahasiswa) {
      return res.status(404).json({ message: "Riwayat Pendidikan Mahasiswa not found" });
    }

    // get data biodata mahasiswa yang sudah di singkron ke feeder
    let biodata_mahasiswa = await BiodataMahasiswa.findOne({
      include: [
        {
          model: Mahasiswa,
          where: {
            id_registrasi_mahasiswa: riwayat_pendidikan_mahasiswa.id_registrasi_mahasiswa,
          },
        },
      ],
    });

    if (!biodata_mahasiswa) {
      return res.status(404).json({ message: "Biodata mahasiswa not found" });
    }

    if (biodata_mahasiswa.id_feeder == null || biodata_mahasiswa.id_feeder == "") {
      return res.status(404).json({ message: `Biodata mahasiswa dengan ID ${biodata_mahasiswa.id_riwayat_pend_mhs} belum dilakukan singkron ke feeder` });
    }

    // get data mahasiswa from biodata mahasiswa
    let mahasiswa = await Mahasiswa.findOne({
      where: {
        id_mahasiswa: biodata_mahasiswa.id_mahasiswa,
      },
    });

    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa not found" });
    }

    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // akan insert data riwayat pendidikan mahasiswa ke feeder
    const requestBody = {
      act: "InsertRiwayatPendidikanMahasiswa",
      token: `${token}`,
      record: {
        id_mahasiswa: biodata_mahasiswa.id_feeder,
        nim: mahasiswa.nim,
        id_jenis_daftar: riwayat_pendidikan_mahasiswa.id_jenis_daftar,
        id_jalur_daftar: riwayat_pendidikan_mahasiswa.id_jalur_daftar,
        id_periode_masuk: riwayat_pendidikan_mahasiswa.id_periode_masuk,
        tanggal_daftar: riwayat_pendidikan_mahasiswa.tanggal_daftar,
        id_perguruan_tinggi: mahasiswa.id_perguruan_tinggi,
        id_prodi: riwayat_pendidikan_mahasiswa.id_prodi,
        sks_diakui: riwayat_pendidikan_mahasiswa.sks_diakui,
        id_perguruan_tinggi_asal: riwayat_pendidikan_mahasiswa.id_perguruan_tinggi_asal,
        id_prodi_asal: riwayat_pendidikan_mahasiswa.id_prodi_asal,
        id_pembiayaan: riwayat_pendidikan_mahasiswa.id_pembiayaan,
        biaya_masuk: riwayat_pendidikan_mahasiswa.biaya_masuk,
      },
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // Mendapatkan id_registrasi_mahasiswa dari response feeder
    const idFeederRegistrasiMahasiswa = response.data.data.id_registrasi_mahasiswa;

    // update id_feeder dan last sync pada riwayat pendidikan mahasiswa local
    riwayat_pendidikan_mahasiswa.id_feeder = idFeederRegistrasiMahasiswa;
    riwayat_pendidikan_mahasiswa.last_sync = new Date();
    await riwayat_pendidikan_mahasiswa.save();

    // update status pada riwayat_pendidikan_mahasiswa_sync local
    let riwayat_pendidikan_mahasiswa_sync = await RiwayatPendidikanMahasiswaSync.findOne({
      where: {
        id_riwayat_pend_mhs: id_riwayat_pend_mhs,
        status: false,
        jenis_singkron: "create",
        id_feeder: null,
      },
    });

    if (!riwayat_pendidikan_mahasiswa_sync) {
      return res.status(404).json({ message: "Riwayat Pendidikan Mahasiswa sync not found" });
    }

    // update data mahasiswa id_sms dengan data terbaru dari feeder mahasiswa
    mahasiswaFeeder = await getListMahasiswaById(biodata_mahasiswa.id_feeder);
    mahasiswa.id_sms = mahasiswaFeeder.id_sms;
    await mahasiswa.save();

    riwayat_pendidikan_mahasiswa_sync.status = true;
    await riwayat_pendidikan_mahasiswa_sync.save();

    // result
    console.log(`Successfully inserted riwayat pendidikan mahasiswa with ID ${riwayat_pendidikan_mahasiswa_sync.id_riwayat_pend_mhs} to feeder`);
  } catch (error) {
    next(error);
  }
};

const updateRiwayatPendidikanMahasiswa = async (id_riwayat_pend_mhs, req, res, next) => {
  try {
    // get data riwayat pendidikan mahasiswa from local
    let riwayat_pendidikan_mahasiswa = await RiwayatPendidikanMahasiswa.findByPk(id_riwayat_pend_mhs);

    if (!riwayat_pendidikan_mahasiswa) {
      return res.status(404).json({ message: "Riwayat Pendidikan Mahasiswa not found" });
    }

    // get data biodata mahasiswa yang sudah di singkron ke feeder
    let biodata_mahasiswa = await BiodataMahasiswa.findOne({
      include: [
        {
          model: Mahasiswa,
          where: {
            id_registrasi_mahasiswa: riwayat_pendidikan_mahasiswa.id_registrasi_mahasiswa,
          },
        },
      ],
    });

    if (!biodata_mahasiswa) {
      return res.status(404).json({ message: "Biodata mahasiswa not found" });
    }

    if (biodata_mahasiswa.id_feeder == null || biodata_mahasiswa.id_feeder == "") {
      return res.status(404).json({ message: `Biodata mahasiswa dengan ID ${biodata_mahasiswa.id_riwayat_pend_mhs} belum dilakukan singkron ke feeder` });
    }

    // get data mahasiswa from biodata mahasiswa
    let mahasiswa = await Mahasiswa.findOne({
      where: {
        id_mahasiswa: biodata_mahasiswa.id_mahasiswa,
      },
    });

    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa not found" });
    }

    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // akan update data riwayat pendidikan mahasiswa ke feeder
    const requestBody = {
      act: "UpdateRiwayatPendidikanMahasiswa",
      token: `${token}`,
      key: {
        id_registrasi_mahasiswa: riwayat_pendidikan_mahasiswa.id_feeder,
      },
      record: {
        id_mahasiswa: biodata_mahasiswa.id_feeder,
        nim: mahasiswa.nim,
        id_jenis_daftar: riwayat_pendidikan_mahasiswa.id_jenis_daftar,
        id_jalur_daftar: riwayat_pendidikan_mahasiswa.id_jalur_daftar,
        id_periode_masuk: riwayat_pendidikan_mahasiswa.id_periode_masuk,
        tanggal_daftar: riwayat_pendidikan_mahasiswa.tanggal_daftar,
        id_perguruan_tinggi: mahasiswa.id_perguruan_tinggi,
        id_prodi: riwayat_pendidikan_mahasiswa.id_prodi,
        sks_diakui: riwayat_pendidikan_mahasiswa.sks_diakui,
        id_perguruan_tinggi_asal: riwayat_pendidikan_mahasiswa.id_perguruan_tinggi_asal,
        id_prodi_asal: riwayat_pendidikan_mahasiswa.id_prodi_asal,
        id_pembiayaan: riwayat_pendidikan_mahasiswa.id_pembiayaan,
        biaya_masuk: riwayat_pendidikan_mahasiswa.biaya_masuk,
      },
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // update status pada riwayat_pendidikan_mahasiswa_sync local
    let riwayat_pendidikan_mahasiswa_sync = await RiwayatPendidikanMahasiswaSync.findOne({
      where: {
        id_riwayat_pend_mhs: id_riwayat_pend_mhs,
        status: false,
        jenis_singkron: "update",
        id_feeder: riwayat_pendidikan_mahasiswa.id_feeder,
      },
    });

    if (!riwayat_pendidikan_mahasiswa_sync) {
      return res.status(404).json({ message: "Riwayat Pendidikan Mahasiswa sync not found" });
    }

    riwayat_pendidikan_mahasiswa_sync.status = true;
    await riwayat_pendidikan_mahasiswa_sync.save();

    // update last sync pada riwayat pendidikan mahasiswa
    riwayat_pendidikan_mahasiswa.last_sync = new Date();
    await riwayat_pendidikan_mahasiswa.save();

    // result
    console.log(`Successfully updated riwayat pendidikan mahasiswa with ID Feeder ${riwayat_pendidikan_mahasiswa.id_feeder} to feeder`);
  } catch (error) {
    next(error);
  }
};

// dinonaktifkan
// const deleteRiwayatPendidikanMahasiswa = async (id_feeder, req, res, next) => {
//   try {
//     // Mendapatkan token
//     const { token, url_feeder } = await getToken();

//     // akan delete data riwayat pendidikan mahasiswa ke feeder
//     const requestBody = {
//       act: "DeleteRiwayatPendidikanMahasiswa",
//       token: `${token}`,
//       key: {
//         id_registrasi_mahasiswa: id_feeder,
//       },
//     };

//     // Menggunakan token untuk mengambil data
//     const response = await axios.post(url_feeder, requestBody);

//     // Mengecek jika ada error pada respons dari server
//     if (response.data.error_code !== 0) {
//       throw new Error(`Error from Feeder: ${response.data.error_desc}`);
//     }

//     // update status pada riwayat_pendidikan_mahasiswa_sync local
//     let riwayat_pendidikan_mahasiswa_sync = await RiwayatPendidikanMahasiswaSync.findOne({
//       where: {
//         id_feeder: id_feeder,
//         status: false,
//         jenis_singkron: "delete",
//         id_riwayat_pend_mhs: null,
//       },
//     });

//     if (!riwayat_pendidikan_mahasiswa_sync) {
//       return res.status(404).json({ message: "Riwayat Pendidikan Mahasiswa sync not found" });
//     }

//     riwayat_pendidikan_mahasiswa_sync.status = true;
//     await riwayat_pendidikan_mahasiswa_sync.save();

//     // result
//     console.log(`Successfully deleted riwayat pendidikan mahasiswa with ID Feeder ${riwayat_pendidikan_mahasiswa_sync.id_feeder} to feeder`);
//   } catch (error) {
//     next(error);
//   }
// };

// untuk create data feeder ke local
const getAndCreateRiwayatPendidikanMahasiswa = async (id_feeder, req, res, next) => {
  try {
    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetListRiwayatPendidikanMahasiswa",
      token: `${token}`,
      filter: `id_registrasi_mahasiswa='${id_feeder}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // Tanggapan dari API
    const dataRiwayatPendidikanMahasiswa = response.data.data;

    // Menyiapkan array untuk request body
    const mahasiswaList = [];

    for (const riwayat_pendidikan_mahasiswa of dataRiwayatPendidikanMahasiswa) {
      const existingRiwayatPendidikanMahasiswa = await RiwayatPendidikanMahasiswa.findOne({
        where: {
          id_feeder: riwayat_pendidikan_mahasiswa.id_registrasi_mahasiswa,
        },
      });

      if (!existingRiwayatPendidikanMahasiswa) {
        // memanggil data biodata mahasiswa dari feeder untuk mengisi data nik
        let biodataMmahasiswaFeeder = await getBiodataMahasiswaById(riwayat_pendidikan_mahasiswa.id_mahasiswa);

        if (biodataMmahasiswaFeeder) {
          mahasiswaList.push({
            nim: riwayat_pendidikan_mahasiswa.nim,
            nik: biodataMmahasiswaFeeder[0].nik,
          });
        }
      }
    }

    // Jika ada mahasiswa yang belum ada di lokal, panggil fungsi getAllDataMahasiswaFromFeeder
    if (mahasiswaList.length > 0) {
      // Membuat objek request tiruan dengan body yang sesuai
      const fakeReq = { body: { mahasiswas: mahasiswaList } };

      // Memanggil fungsi dengan fakeReq dan menangani response secara manual
      await getAllDataMahasiswaFromFeeder(fakeReq, res, next);
    }

    // update status pada riwayat_pendidikan_mahasiswa_sync local
    let riwayat_pendidikan_mahasiswa_sync = await RiwayatPendidikanMahasiswaSync.findOne({
      where: {
        id_feeder: id_feeder,
        status: false,
        jenis_singkron: "get",
        id_riwayat_pend_mhs: null,
      },
    });

    if (!riwayat_pendidikan_mahasiswa_sync) {
      return res.status(404).json({ message: "Riwayat Pendidikan Mahasiswa sync not found" });
    }

    riwayat_pendidikan_mahasiswa_sync.status = true;
    await riwayat_pendidikan_mahasiswa_sync.save();

    // result
    console.log(`Successfully inserted riwayat pendidikan mahasiswa with ID Feeder ${riwayat_pendidikan_mahasiswa_sync.id_feeder} to feeder`);
  } catch (error) {
    next(error);
  }
};

const deleteRiwayatPendidikanMahasiswaLocal = async (id_riwayat_pend_mhs, req, res, next) => {
  try {
    const riwayat_pendidikan_mahasiswa = await RiwayatPendidikanMahasiswa.findByPk(id_riwayat_pend_mhs);

    if (!riwayat_pendidikan_mahasiswa) {
      return res.status(400).json({
        message: "Riwayat Pendidikan Mahasiswa not found",
      });
    }

    // delete riwayat pendidikan mahasiswa
    await riwayat_pendidikan_mahasiswa.destroy();

    console.log(`Successfully deleted riwayat pendidikan mahasiswa in local with ID ${id_riwayat_pend_mhs}`);
  } catch (error) {
    next(error);
  }
};

const syncRiwayatPendidikanMahasiswas = async (req, res, next) => {
  try {
    const { riwayat_pendidikan_mahasiswa_syncs } = req.body;

    // Validasi input
    if (!riwayat_pendidikan_mahasiswa_syncs || !Array.isArray(riwayat_pendidikan_mahasiswa_syncs)) {
      return res.status(400).json({ message: "Request body tidak valid" });
    }

    // perulangan untuk aksi data riwayat pendidikan mahasiswa berdasarkan jenis singkron
    for (const riwayat_pendidikan_mahasiswa_sync of riwayat_pendidikan_mahasiswa_syncs) {
      // get data riwayat pendidikan mahasiswa sync
      const data_riwayat_pendidikan_mahasiswa_sync = await RiwayatPendidikanMahasiswaSync.findByPk(riwayat_pendidikan_mahasiswa_sync.id);

      if (!data_riwayat_pendidikan_mahasiswa_sync) {
        return res.status(404).json({ message: "Data Riwayat Pendidikan Mahasiswa sync not found" });
      }

      if (data_riwayat_pendidikan_mahasiswa_sync.status === false) {
        if (data_riwayat_pendidikan_mahasiswa_sync.jenis_singkron === "create") {
          await insertRiwayatPendidikanMahasiswa(data_riwayat_pendidikan_mahasiswa_sync.id_riwayat_pend_mhs, req, res, next);
        } else if (data_riwayat_pendidikan_mahasiswa_sync.jenis_singkron === "update") {
          await updateRiwayatPendidikanMahasiswa(data_riwayat_pendidikan_mahasiswa_sync.id_riwayat_pend_mhs, req, res, next);
        } else if (data_riwayat_pendidikan_mahasiswa_sync.jenis_singkron === "get") {
          await getAndCreateRiwayatPendidikanMahasiswa(data_riwayat_pendidikan_mahasiswa_sync.id_feeder, req, res, next);
        } else if (data_riwayat_pendidikan_mahasiswa_sync.jenis_singkron === "delete") {
          await deleteRiwayatPendidikanMahasiswaLocal(data_riwayat_pendidikan_mahasiswa_sync.id_riwayat_pend_mhs, req, res, next);
        }
        // dinonaktifkan
        // else if (data_riwayat_pendidikan_mahasiswa_sync.jenis_singkron === "delete") {
        //   await deleteRiwayatPendidikanMahasiswa(data_riwayat_pendidikan_mahasiswa_sync.id_feeder, req, res, next);
        // }
      } else {
        console.log(`Data Riwayat Pendidikan Mahasiswa Sync dengan ID ${riwayat_pendidikan_mahasiswa_sync.id} tidak valid untuk dilakukan singkron`);
      }
    }

    // return
    return res.status(200).json({ message: "Singkron riwayat pendidikan mahasiswa lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  matchingcDataRiwayatPendidikanMahasiswa,
  matchingSyncDataRiwayatPendidikanMahasiswa,
  matchingSyncDataRiwayatPendidikanMahasiswaDelete,
  syncRiwayatPendidikanMahasiswas,
};
