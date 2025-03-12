const { KelasKuliah, KelasKuliahSync, DetailKelasKuliah } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

async function getKelasKuliahFromFeeder(semesterId, req, res, next) {
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
      act: "GetListKelasKuliah",
      token: token,
      filter: `id_semester='${semesterId}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

async function getKelasKuliahFromLocal(semesterId, req, res, next) {
  try {
    return await KelasKuliah.findAll({
      where: {
        id_semester: semesterId,
      },
    });
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

async function getDetailKelasKuliahFromFeeder(id_kelas_kuliah) {
  try {
    if (!id_kelas_kuliah) {
      return res.status(400).json({
        message: "Kelas Kuliah ID is required",
      });
    }

    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetDetailKelasKuliah",
      token: token,
      filter: `id_kelas_kuliah='${id_kelas_kuliah}'`,
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

async function matchingDataKelasKuliah(req, res, next) {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    // get kelas kuliah local dan feeder
    const kelasFeeder = await getKelasKuliahFromFeeder(semesterId);
    const kelasLocal = await getKelasKuliahFromLocal(semesterId);

    // kelas kuliah feeder
    const kelasKuliahFeederMap = kelasFeeder.reduce((map, kelas) => {
      map[kelas.id_kelas_kuliah] = kelas;
      return map;
    }, {});

    // Ambil semua data lokal dan feeder sekaligus di luar loop
    const detailLocalMap = await DetailKelasKuliah.findAll({
      where: { id_kelas_kuliah: kelasLocal.map((k) => k.id_kelas_kuliah) },
    }).then((details) =>
      details.reduce((map, detail) => {
        map[detail.id_kelas_kuliah] = detail;
        return map;
      }, {})
    );

    // Loop untuk proses sinkronisasi
    for (let localKelas of kelasLocal) {
      const feederKelas = kelasKuliahFeederMap[localKelas.id_feeder];
      const detailLocal = detailLocalMap[localKelas.id_kelas_kuliah];
      const existingSync = await KelasKuliahSync.findOne({
        where: {
          id_kelas_kuliah: localKelas.id_kelas_kuliah,
          jenis_singkron: feederKelas ? "update" : "create",
          status: false,
          id_feeder: feederKelas ? localKelas.id_feeder : null,
        },
      });

      if (existingSync) {
        console.log(`Data kelas kuliah ${localKelas.id_kelas_kuliah} sudah disinkronisasi.`);
        continue;
      }

      if (!feederKelas) {
        // Proses create
        await KelasKuliahSync.create({
          jenis_singkron: "create",
          status: false,
          id_feeder: null,
          id_kelas_kuliah: localKelas.id_kelas_kuliah,
        });
        console.log(`Data kelas kuliah ${localKelas.id_kelas_kuliah} ditambahkan ke sinkronisasi dengan jenis 'create'.`);
      } else if (detailLocal) {
        // Proses update, validasi perbedaan data
        const detailFeeder = await getDetailKelasKuliahFromFeeder(localKelas.id_feeder);

        if (!detailFeeder) {
          console.error(`Detail feeder untuk kelas ${localKelas.id_kelas_kuliah} tidak ditemukan.`);
          continue;
        }

        const isUpdated = compareKelasDetails(localKelas, feederKelas, detailLocal, detailFeeder);

        if (isUpdated) {
          await KelasKuliahSync.create({
            jenis_singkron: "update",
            status: false,
            id_feeder: localKelas.id_feeder,
            id_kelas_kuliah: localKelas.id_kelas_kuliah,
          });
          console.log(`Data kelas kuliah ${localKelas.id_kelas_kuliah} ditambahkan ke sinkronisasi dengan jenis 'update'.`);
        }
      } else {
        console.error(`Detail lokal untuk kelas ${localKelas.id_kelas_kuliah} tidak ditemukan.`);
      }
    }

    // Fungsi pembanding detail kelas
    function compareKelasDetails(localKelas, feederKelas, detailLocal, detailFeeder) {
      // Konversi jumlah_mahasiswa dari local ke string sebelum perbandingan
      // const jumlahMahasiswaLocal = String(localKelas.jumlah_mahasiswa);
      // const jumlahMahasiswaFeeder = feederKelas.jumlah_mahasiswa;

      let formatTanggalMulaiEfektifLocal = convertToDDMMYYYY(detailLocal.tanggal_mulai_efektif);
      let formatTanggalAkhirEfektifLocal = convertToDDMMYYYY(detailLocal.tanggal_akhir_efektif);

      return (
        localKelas.id_prodi !== feederKelas.id_prodi ||
        localKelas.id_semester !== feederKelas.id_semester ||
        localKelas.id_matkul !== feederKelas.id_matkul ||
        localKelas.nama_kelas_kuliah !== feederKelas.nama_kelas_kuliah ||
        localKelas.sks !== feederKelas.sks ||
        !areEqual(detailLocal.bahasan, detailFeeder.bahasan) ||
        // jumlahMahasiswaLocal !== jumlahMahasiswaFeeder ||
        // !areEqual(detailLocal.kapasitas, detailFeeder.kapasitas) ||
        !areEqual(formatTanggalMulaiEfektifLocal, detailFeeder[0].tanggal_mulai_efektif) ||
        !areEqual(formatTanggalAkhirEfektifLocal, detailFeeder[0].tanggal_akhir_efektif)
        // localKelas.id_dosen !== feederKelas.id_dosen
      );
    }

    // mengecek jikalau data kelas kuliah tidak ada di local namun ada di feeder, maka data kelas kuliah di feeder akan tercatat sebagai get
    for (let feederKelasId in kelasKuliahFeederMap) {
      const feederKelas = kelasKuliahFeederMap[feederKelasId];

      // Jika data Feeder tidak ada di Lokal, tambahkan dengan jenis "get"
      const localKelas = kelasLocal.find((kelas) => kelas.id_feeder === feederKelasId);

      if (!localKelas) {
        const existingSync = await KelasKuliahSync.findOne({
          where: {
            id_feeder: feederKelas.id_kelas_kuliah,
            jenis_singkron: "get",
            status: false,
            id_kelas_kuliah: null,
          },
        });

        if (!existingSync) {
          await KelasKuliahSync.create({
            jenis_singkron: "get",
            status: false,
            id_feeder: feederKelas.id_kelas_kuliah,
            id_kelas_kuliah: null,
          });
          console.log(`Data kelas kuliah ${feederKelas.id_kelas_kuliah} ditambahkan ke sinkronisasi dengan jenis 'get'.`);
        }
      }
    }

    // Mencari data yang tidak ada di Feeder
    const dataTidakAdaDiFeeder = kelasLocal.filter((item) => !kelasKuliahFeederMap[item.id_feeder]);

    // Jika ada data yang harus disinkronkan
    if (dataTidakAdaDiFeeder.length > 0) {
      // Ambil semua data yang sudah ada di tabel sinkronisasi untuk mencegah duplikasi
      const existingSyncData = await KelasKuliahSync.findAll({
        where: {
          jenis_singkron: "delete",
          status: false,
          id_feeder: null,
          id_kelas_kuliah: dataTidakAdaDiFeeder.map((item) => item.id_kelas_kuliah),
        },
        attributes: ["id_kelas_kuliah"],
      });

      // Buat set untuk menyimpan id_kelas_kuliah yang sudah ada di database
      const existingSyncIds = new Set(existingSyncData.map((item) => item.id_kelas_kuliah));

      // Filter hanya data yang belum ada di tabel sinkronisasi
      const dataInsert = dataTidakAdaDiFeeder
        .filter((item) => !existingSyncIds.has(item.id_kelas_kuliah))
        .map((item) => ({
          jenis_singkron: "delete",
          status: false,
          id_feeder: null,
          id_kelas_kuliah: item.id_kelas_kuliah,
        }));

      // Jika ada data yang benar-benar baru, lakukan bulk insert
      if (dataInsert.length > 0) {
        await KelasKuliahSync.bulkCreate(dataInsert);
        console.log(`${dataInsert.length} data baru berhasil ditambahkan ke sinkron sementara dengan jenis delete.`);
      } else {
        console.log("Tidak ada data baru untuk disinkronkan.");
      }
    }

    console.log("Matching kelas kuliah lokal ke feeder berhasil.");
  } catch (error) {
    console.error("Error during matchingDataKelasKuliah:", error.message);
    throw error;
  }
}

const matchingSyncDataKelasKuliah = async (req, res, next) => {
  try {
    await matchingDataKelasKuliah(req, res, next);
    res.status(200).json({ message: "Matching kelas kuliah lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

// fungsi singkron kelas kuliah
const insertKelasKuliah = async (id_kelas_kuliah, req, res, next) => {
  try {
    // get data kelas kuliah from local
    let kelas_kuliah = await KelasKuliah.findByPk(id_kelas_kuliah);

    if (!kelas_kuliah) {
      return res.status(404).json({ message: "Kelas kuliah not found" });
    }

    // get data detail kelas kuliah from local
    const detail_kelas_kuliah = await DetailKelasKuliah.findOne({
      where: {
        id_kelas_kuliah: kelas_kuliah.id_kelas_kuliah,
      },
    });

    if (!detail_kelas_kuliah) {
      return res.status(404).json({ message: "Detail Kelas kuliah not found" });
    }

    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // melakukan konversi
    let tanggal_tutup_daftar = null;

    if (detail_kelas_kuliah.tanggal_tutup_daftar != null || detail_kelas_kuliah.tanggal_tutup_daftar != undefined) {
      tanggal_tutup_daftar = detail_kelas_kuliah.tanggal_tutup_daftar.toISOString().split("T")[0];
    }

    // akan insert data kelas kuliah dan detail kelas kuliah ke feeder
    const requestBody = {
      act: "InsertKelasKuliah",
      token: `${token}`,
      record: {
        id_prodi: kelas_kuliah.id_prodi,
        id_semester: kelas_kuliah.id_semester,
        id_matkul: kelas_kuliah.id_matkul,
        nama_kelas_kuliah: kelas_kuliah.nama_kelas_kuliah,
        sks_mk: kelas_kuliah.sks,
        sks_tm: kelas_kuliah.sks,
        sks_prak: 0,
        sks_prak_lap: 0,
        sks_sim: 0,
        bahasan: detail_kelas_kuliah.bahasan,
        tanggal_tutup_daftar: tanggal_tutup_daftar,
        // kapasitas: detail_kelas_kuliah.kapasitas,
        // jumlah_mahasiswa: kelas_kuliah.jumlah_mahasiswa,
        tanggal_mulai_efektif: detail_kelas_kuliah.tanggal_mulai_efektif,
        tanggal_akhir_efektif: detail_kelas_kuliah.tanggal_akhir_efektif,
        lingkup: kelas_kuliah.lingkup,
        mode: kelas_kuliah.mode,
        apa_untuk_pditt: kelas_kuliah.apa_untuk_pditt,
        a_selenggara_pditt: 1,
        id_mou: null,
      },
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // Mendapatkan id_kelas_kuliah dari response feeder
    const idFeederKelasKuliah = response.data.data.id_kelas_kuliah;

    // update id_feeder dan last sync pada kelas kuliah local
    kelas_kuliah.id_feeder = idFeederKelasKuliah;
    kelas_kuliah.last_sync = new Date();
    await kelas_kuliah.save();

    // update status pada kelas_kuliah_sync local
    let kelas_kuliah_sync = await KelasKuliahSync.findOne({
      where: {
        id_kelas_kuliah: id_kelas_kuliah,
        status: false,
        jenis_singkron: "create",
        id_feeder: null,
      },
    });

    if (!kelas_kuliah_sync) {
      return res.status(404).json({ message: "Kelas kuliah sync not found" });
    }

    kelas_kuliah_sync.status = true;
    await kelas_kuliah_sync.save();

    // result
    console.log(`Successfully inserted kelas kuliah with ID ${kelas_kuliah_sync.id_kelas_kuliah} to feeder`);
  } catch (error) {
    next(error);
  }
};

const updateKelasKuliah = async (id_kelas_kuliah, req, res, next) => {
  try {
    // get data kelas kuliah from local
    let kelas_kuliah = await KelasKuliah.findByPk(id_kelas_kuliah);

    if (!kelas_kuliah) {
      return res.status(404).json({ message: "Kelas kuliah not found" });
    }

    if (kelas_kuliah.id_feeder == null || kelas_kuliah.id_feeder == "") {
      return res.status(404).json({ message: `Kelas kuliah dengan ID ${kelas_kuliah.id_kelas_kuliah} belum dilakukan singkron ke feeder` });
    }

    // get data detail kelas kuliah from local
    const detail_kelas_kuliah = await DetailKelasKuliah.findOne({
      where: {
        id_kelas_kuliah: kelas_kuliah.id_kelas_kuliah,
      },
    });

    if (!detail_kelas_kuliah) {
      return res.status(404).json({ message: "Detail Kelas kuliah not found" });
    }

    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // melakukan konversi
    let tanggal_tutup_daftar = null;
    if (detail_kelas_kuliah.tanggal_tutup_daftar != null || detail_kelas_kuliah.tanggal_tutup_daftar != undefined) {
      tanggal_tutup_daftar = detail_kelas_kuliah.tanggal_tutup_daftar.toISOString().split("T")[0];
    }

    // akan update data kelas kuliah dan detail kelas kuliah ke feeder
    const requestBody = {
      act: "UpdateKelasKuliah",
      token: `${token}`,
      key: {
        id_kelas_kuliah: kelas_kuliah.id_feeder,
      },
      record: {
        id_prodi: kelas_kuliah.id_prodi,
        id_semester: kelas_kuliah.id_semester,
        id_matkul: kelas_kuliah.id_matkul,
        nama_kelas_kuliah: kelas_kuliah.nama_kelas_kuliah,
        sks: kelas_kuliah.sks,
        bahasan: detail_kelas_kuliah.bahasan,
        tanggal_tutup_daftar: tanggal_tutup_daftar,
        jumlah_mahasiswa: kelas_kuliah.jumlah_mahasiswa,
        kapasitas: detail_kelas_kuliah.kapasitas,
        tanggal_mulai_efektif: detail_kelas_kuliah.tanggal_mulai_efektif,
        tanggal_akhir_efektif: detail_kelas_kuliah.tanggal_akhir_efektif,
        lingkup: kelas_kuliah.lingkup,
        mode: kelas_kuliah.mode,
        apa_untuk_pditt: kelas_kuliah.apa_untuk_pditt,
      },
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // update status pada kelas_kuliah_sync local
    let kelas_kuliah_sync = await KelasKuliahSync.findOne({
      where: {
        id_kelas_kuliah: id_kelas_kuliah,
        status: false,
        jenis_singkron: "update",
        id_feeder: kelas_kuliah.id_feeder,
      },
    });

    if (!kelas_kuliah_sync) {
      return res.status(404).json({ message: "Kelas kuliah sync not found" });
    }

    kelas_kuliah_sync.status = true;
    await kelas_kuliah_sync.save();

    // update last sync pada kelas kuliah
    kelas_kuliah.last_sync = new Date();
    await kelas_kuliah.save();

    // result
    console.log(`Successfully updated kelas kuliah with ID Feeder ${kelas_kuliah_sync.id_feeder} to feeder`);
  } catch (error) {
    next(error);
  }
};

// dinonaktifkan
// const deleteKelasKuliah = async (id_feeder, req, res, next) => {
//   try {
//     // Mendapatkan token
//     const { token, url_feeder } = await getToken();

//     // akan delete data kelas kuliah dan detail kelas kuliah ke feeder
//     const requestBody = {
//       act: "DeleteKelasKuliah",
//       token: `${token}`,
//       key: {
//         id_kelas_kuliah: id_feeder,
//       },
//     };

//     // Menggunakan token untuk mengambil data
//     const response = await axios.post(url_feeder, requestBody);

//     // Mengecek jika ada error pada respons dari server
//     if (response.data.error_code !== 0) {
//       throw new Error(`Error from Feeder: ${response.data.error_desc}`);
//     }

//     // update status pada kelas_kuliah_sync local
//     let kelas_kuliah_sync = await KelasKuliahSync.findOne({
//       where: {
//         id_feeder: id_feeder,
//         status: false,
//         jenis_singkron: "delete",
//         id_kelas_kuliah: null,
//       },
//     });

//     if (!kelas_kuliah_sync) {
//       return res.status(404).json({ message: "Kelas kuliah sync not found" });
//     }

//     kelas_kuliah_sync.status = true;
//     await kelas_kuliah_sync.save();

//     // result
//     console.log(`Successfully deleted kelas kuliah with ID Feeder ${kelas_kuliah_sync.id_feeder} to feeder`);
//   } catch (error) {
//     next(error);
//   }
// };

// untuk create data feeder ke local
const getAndCreateKelasKuliah = async (id_feeder, req, res, next) => {
  try {
    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetListKelasKuliah",
      token: `${token}`,
      filter: `id_kelas_kuliah='${id_feeder}'`,
    };

    const requestBodyDetailKelas = {
      act: "GetDetailKelasKuliah",
      token: `${token}`,
      filter: `id_kelas_kuliah='${id_feeder}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody); // kelas kuliah

    // Menggunakan token untuk mengambil data
    const responseDetailKelas = await axios.post(url_feeder, requestBodyDetailKelas); // detail kelas

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }
    if (responseDetailKelas.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // Tanggapan dari API
    const dataKelasKuliah = response.data.data;

    // Tanggapan dari API
    const dataDetailKelasKuliah = responseDetailKelas.data.data;

    // create data kelas
    for (const kelas_kuliah of dataKelasKuliah) {
      // Periksa apakah data sudah ada di tabel
      const existingKelasKuliah = await KelasKuliah.findOne({
        where: {
          id_feeder: kelas_kuliah.id_kelas_kuliah,
        },
      });

      if (!existingKelasKuliah) {
        // Data belum ada, buat entri baru di database
        await KelasKuliah.create({
          id_kelas_kuliah: kelas_kuliah.id_kelas_kuliah,
          nama_kelas_kuliah: kelas_kuliah.nama_kelas_kuliah,
          sks: kelas_kuliah.sks,
          jumlah_mahasiswa: kelas_kuliah.jumlah_mahasiswa,
          apa_untuk_pditt: kelas_kuliah.apa_untuk_pditt,
          lingkup: kelas_kuliah.lingkup,
          mode: kelas_kuliah.mode,
          last_sync: new Date(),
          id_feeder: kelas_kuliah.id_kelas_kuliah,
          id_prodi: kelas_kuliah.id_prodi,
          id_semester: kelas_kuliah.id_semester,
          id_matkul: kelas_kuliah.id_matkul,
          id_dosen: kelas_kuliah.id_dosen,
        });
      }
    }

    // create data detail kelas
    for (const detail_kelas_kuliah of dataDetailKelasKuliah) {
      let tanggal_mulai, tanggal_akhir; // Deklarasikan variabel di luar blok if

      //   melakukan pengecekan data tanggal
      if (detail_kelas_kuliah.tanggal_mulai_efektif != null) {
        const date_start = detail_kelas_kuliah.tanggal_mulai_efektif.split("-");
        tanggal_mulai = `${date_start[2]}-${date_start[1]}-${date_start[0]}`;
      }

      if (detail_kelas_kuliah.tanggal_akhir_efektif != null) {
        const date_end = detail_kelas_kuliah.tanggal_akhir_efektif.split("-");
        tanggal_akhir = `${date_end[2]}-${date_end[1]}-${date_end[0]}`;
      }

      await DetailKelasKuliah.create({
        id_detail_kelas_kuliah: detail_kelas_kuliah.id_detail_kelas_kuliah,
        bahasan: detail_kelas_kuliah.bahasan,
        tanggal_mulai_efektif: tanggal_mulai,
        tanggal_akhir_efektif: tanggal_akhir,
        kapasitas: detail_kelas_kuliah.kapasitas === null ? null : detail_kelas_kuliah.kapasitas,
        tanggal_tutup_daftar: detail_kelas_kuliah.tanggal_tutup_daftar,
        prodi_penyelenggara: detail_kelas_kuliah.prodi_penyelenggara,
        perguruan_tinggi_penyelenggara: detail_kelas_kuliah.perguruan_tinggi_penyelenggara,
        id_kelas_kuliah: detail_kelas_kuliah.id_kelas_kuliah,
      });
    }

    // update status pada kelas_kuliah_sync local
    let kelas_kuliah_sync = await KelasKuliahSync.findOne({
      where: {
        id_feeder: id_feeder,
        status: false,
        jenis_singkron: "get",
        id_kelas_kuliah: null,
      },
    });

    if (!kelas_kuliah_sync) {
      return res.status(404).json({ message: "Kelas kuliah sync not found" });
    }

    kelas_kuliah_sync.status = true;
    await kelas_kuliah_sync.save();

    // result
    console.log(`Successfully inserted kelas kuliah with ID Feeder ${kelas_kuliah_sync.id_feeder} to feeder`);
  } catch (error) {
    next(error);
  }
};

const deleteKelasKuliahLocal = async (id_kelas_kuliah, req, res, next) => {
  try {
    const kelas_kuliah = await KelasKuliah.findByPk(id_kelas_kuliah);

    if (!kelas_kuliah) {
      return res.status(400).json({
        message: "Kelas Kuliah not found",
      });
    }

    // delete kelas kuliah
    await kelas_kuliah.destroy();

    console.log(`Successfully deleted kelas kuliah in local with ID ${id_kelas_kuliah} to feeder`);
  } catch (error) {
    next(error);
  }
};

const syncKelasKuliahs = async (req, res, next) => {
  try {
    const { kelas_kuliah_syncs } = req.body;

    // Validasi input
    if (!kelas_kuliah_syncs || !Array.isArray(kelas_kuliah_syncs)) {
      return res.status(400).json({ message: "Request body tidak valid" });
    }

    // perulangan untuk aksi data kelas kuliah berdasarkan jenis singkron
    for (const kelas_kuliah_sync of kelas_kuliah_syncs) {
      // get data kelas kuliah sync
      const data_kelas_kuliah_sync = await KelasKuliahSync.findByPk(kelas_kuliah_sync.id);

      if (!data_kelas_kuliah_sync) {
        return res.status(404).json({ message: "Data Kelas kuliah sync not found" });
      }

      if (data_kelas_kuliah_sync.status === false) {
        if (data_kelas_kuliah_sync.jenis_singkron === "create") {
          await insertKelasKuliah(data_kelas_kuliah_sync.id_kelas_kuliah, req, res, next);
        } else if (data_kelas_kuliah_sync.jenis_singkron === "update") {
          await updateKelasKuliah(data_kelas_kuliah_sync.id_kelas_kuliah, req, res, next);
        } else if (data_kelas_kuliah_sync.jenis_singkron === "get") {
          await getAndCreateKelasKuliah(data_kelas_kuliah_sync.id_feeder, req, res, next);
        } else if (data_kelas_kuliah_sync.jenis_singkron === "delete") {
          await deleteKelasKuliahLocal(data_kelas_kuliah_sync.id_kelas_kuliah, req, res, next);
        }
        // dinonaktifkan
        // else if (data_kelas_kuliah_sync.jenis_singkron === "delete") {
        //   await deleteKelasKuliah(data_kelas_kuliah_sync.id_feeder, req, res, next);
        // }
      } else {
        console.log(`Data Kelas Kuliah Sync dengan ID ${data_kelas_kuliah_sync.id} tidak valid untuk dilakukan singkron`);
      }
    }

    // return
    return res.status(200).json({ message: "Singkron kelas kuliah lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  matchingDataKelasKuliah,
  matchingSyncDataKelasKuliah,
  syncKelasKuliahs,
};
