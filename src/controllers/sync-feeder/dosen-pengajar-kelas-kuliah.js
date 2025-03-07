const { DosenPengajarKelasKuliah, DosenPengajarKelasKuliahSync, KelasKuliah } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

async function getDosenPengajarKelasKuliahFromFeeder(semesterId, req, res, next) {
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
      act: "GetDosenPengajarKelasKuliah",
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

async function getDosenPengajarKelasKuliahFromLocal(semesterId, req, res, next) {
  try {
    return await DosenPengajarKelasKuliah.findAll({
      where: {
        id_semester: semesterId,
      },
    });
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

async function matchingcDataDosenPengajarKelasKuliah(req, res, next) {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    // get dosen pengajar kelas kuliah dari local dan feeder
    const dosenPengajarKelasKuliahFeeder = await getDosenPengajarKelasKuliahFromFeeder(semesterId);
    const dosenPengajarKelasKuliahLocal = await getDosenPengajarKelasKuliahFromLocal(semesterId);

    // Buat map untuk data Feeder
    const dosenPengajarKelasKuliahFeederMap = dosenPengajarKelasKuliahFeeder.reduce((map, dosenPengajar) => {
      map[dosenPengajar.id_aktivitas_mengajar] = dosenPengajar;
      return map;
    }, {});

    // Perbarui logika sinkronisasi
    for (let localDosenPengajar of dosenPengajarKelasKuliahLocal) {
      const feederDosenPengajar = dosenPengajarKelasKuliahFeederMap[localDosenPengajar.id_feeder];

      // get kelas kuliah yang terkait dengan localDosenPengajar
      let kelasKuliahLocal = await KelasKuliah.findOne({
        where: {
          id_kelas_kuliah: localDosenPengajar.id_kelas_kuliah,
        },
      });

      if (!kelasKuliahLocal) {
        console.warn(`Kelas kuliah ${localDosenPengajar.id_kelas_kuliah} tidak ditemukan. Melewatkan data ini.`);
        continue;
      }

      const existingSync = await DosenPengajarKelasKuliahSync.findOne({
        where: {
          id_aktivitas_mengajar: localDosenPengajar.id_aktivitas_mengajar,
          jenis_singkron: feederDosenPengajar ? "update" : "create",
          status: false,
          id_feeder: feederDosenPengajar ? localDosenPengajar.id_feeder : null,
        },
      });

      if (existingSync) {
        console.log(`Data dosen pengajar kelas kuliah ${localDosenPengajar.id_aktivitas_mengajar} sudah disinkronisasi.`);
        continue;
      }

      // Jika data lokal tidak ada di Feeder, tambahkan sebagai create
      if (!feederDosenPengajar) {
        await DosenPengajarKelasKuliahSync.create({
          id_aktivitas_mengajar: localDosenPengajar.id_aktivitas_mengajar,
          jenis_singkron: "create",
          status: false,
          id_feeder: null,
        });
        console.log(`Data dosen pengajar kelas kuliah ${localDosenPengajar.id_aktivitas_mengajar} ditambahkan ke sinkronisasi dengan jenis 'create'.`);
      } else {
        // Perbarui logika update untuk juga mengecek id_kelas_kuliah
        const isUpdated = compareDosenPengajarKelasKuliah(localDosenPengajar, feederDosenPengajar, kelasKuliahLocal);

        if (isUpdated) {
          await DosenPengajarKelasKuliahSync.create({
            id_aktivitas_mengajar: localDosenPengajar.id_aktivitas_mengajar,
            jenis_singkron: "update",
            status: false,
            id_feeder: localDosenPengajar.id_feeder,
          });
          console.log(`Data dosen pengajar kelas kuliah ${localDosenPengajar.id_aktivitas_mengajar} ditambahkan ke sinkronisasi dengan jenis 'update'.`);
        }
      }
    }

    // Fungsi pembanding detail kelas
    function compareDosenPengajarKelasKuliah(localDosenPengajar, feederDosenPengajar, kelasKuliahLocal) {
      return (
        kelasKuliahLocal.id_feeder !== feederDosenPengajar.id_kelas_kuliah ||
        localDosenPengajar.sks_substansi_total !== feederDosenPengajar.sks_substansi_total ||
        localDosenPengajar.rencana_minggu_pertemuan !== feederDosenPengajar.rencana_minggu_pertemuan ||
        localDosenPengajar.realisasi_minggu_pertemuan !== feederDosenPengajar.realisasi_minggu_pertemuan ||
        localDosenPengajar.id_registrasi_dosen !== feederDosenPengajar.id_registrasi_dosen ||
        localDosenPengajar.id_dosen !== feederDosenPengajar.id_dosen ||
        localDosenPengajar.id_substansi !== feederDosenPengajar.id_substansi ||
        localDosenPengajar.id_jenis_evaluasi !== feederDosenPengajar.id_jenis_evaluasi ||
        localDosenPengajar.id_prodi !== feederDosenPengajar.id_prodi ||
        localDosenPengajar.id_semester !== feederDosenPengajar.id_semester
      );
    }

    // mengecek jikalau data dosen pengajar kelas kuliah tidak ada di local namun ada di feeder, maka data dosen pengajar kelas kuliah di feeder akan tercatat sebagai get
    for (let feederDosenPengajarId in dosenPengajarKelasKuliahFeederMap) {
      const feederDosenPengajar = dosenPengajarKelasKuliahFeederMap[feederDosenPengajarId];

      // Jika data Feeder tidak ada di Lokal, tambahkan dengan jenis "get"
      const localDosenPengajar = dosenPengajarKelasKuliahLocal.find((dosen_pengajar) => dosen_pengajar.id_feeder === feederDosenPengajarId);

      if (!localDosenPengajar) {
        const existingSync = await DosenPengajarKelasKuliahSync.findOne({
          where: {
            id_feeder: feederDosenPengajar.id_aktivitas_mengajar,
            jenis_singkron: "get",
            status: false,
            id_aktivitas_mengajar: null,
          },
        });

        if (!existingSync) {
          await DosenPengajarKelasKuliahSync.create({
            id_feeder: feederDosenPengajar.id_aktivitas_mengajar,
            jenis_singkron: "get",
            status: false,
            id_aktivitas_mengajar: null,
          });
          console.log(`Data dosen pengajar kelas kuliah ${feederDosenPengajar.id_aktivitas_mengajar} ditambahkan ke sinkronisasi dengan jenis 'get'.`);
        }
      }
    }

    console.log("Matching dosen pengajar kelas kuliah selesai.");
  } catch (error) {
    console.error("Error during matchingDataKelasKuliah:", error.message);
    throw error;
  }
}

const matchingSyncDataDosenPengajarKelasKuliah = async (req, res, next) => {
  try {
    await matchingcDataDosenPengajarKelasKuliah(req, res, next);
    res.status(200).json({ message: "Matching dosen pengajar kelas kuliah lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

// fungsi singkron dosen pengajar kelas kuliah
const insertDosenPengajarKelasKuliah = async (id_aktivitas_mengajar, req, res, next) => {
  try {
    // get data dosen pengajar kelas kuliah from local
    let dosen_pengajar_kelas_kuliah = await DosenPengajarKelasKuliah.findByPk(id_aktivitas_mengajar);

    if (!dosen_pengajar_kelas_kuliah) {
      return res.status(404).json({ message: "Dosen Pengajar Kelas kuliah not found" });
    }

    // get data kelas kuliah yang sudah di singkron ke feeder
    let kelas_kuliah = await KelasKuliah.findByPk(dosen_pengajar_kelas_kuliah.id_kelas_kuliah);

    if (!kelas_kuliah) {
      return res.status(404).json({ message: "Kelas kuliah not found" });
    }

    if (kelas_kuliah.id_feeder == null || kelas_kuliah.id_feeder == "") {
      return res.status(404).json({ message: `Kelas kuliah dengan ID ${kelas_kuliah.id_kelas_kuliah} belum dilakukan singkron ke feeder` });
    }

    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // akan insert data dosen pengajar kelas kuliah ke feeder
    const requestBody = {
      act: "InsertDosenPengajarKelasKuliah",
      token: `${token}`,
      record: {
        id_registrasi_dosen: dosen_pengajar_kelas_kuliah.id_registrasi_dosen,
        id_kelas_kuliah: kelas_kuliah.id_feeder,
        sks_substansi_total: dosen_pengajar_kelas_kuliah.sks_substansi_total,
        rencana_minggu_pertemuan: dosen_pengajar_kelas_kuliah.rencana_minggu_pertemuan,
        id_jenis_evaluasi: dosen_pengajar_kelas_kuliah.id_jenis_evaluasi,
      },
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // Mendapatkan id_aktivitas_mengajar dari response feeder
    const idFeederDosenPengajarKelasKuliah = response.data.data.id_aktivitas_mengajar;

    // update id_feeder dan last sync pada dosen pengajar kelas kuliah local
    dosen_pengajar_kelas_kuliah.id_feeder = idFeederDosenPengajarKelasKuliah;
    dosen_pengajar_kelas_kuliah.last_sync = new Date();
    await dosen_pengajar_kelas_kuliah.save();

    // update status pada dosen_pengajar_kelas_kuliah_sync local
    let dosen_pengajar_kelas_kuliah_sync = await DosenPengajarKelasKuliahSync.findOne({
      where: {
        id_aktivitas_mengajar: id_aktivitas_mengajar,
        status: false,
        jenis_singkron: "create",
        id_feeder: null,
      },
    });

    if (!dosen_pengajar_kelas_kuliah_sync) {
      return res.status(404).json({ message: "Dosen Pengajar Kelas kuliah sync not found" });
    }

    dosen_pengajar_kelas_kuliah_sync.status = true;
    await dosen_pengajar_kelas_kuliah_sync.save();

    // result
    console.log(`Successfully inserted dosen pengajar kelas kuliah with ID ${dosen_pengajar_kelas_kuliah_sync.id_aktivitas_mengajar} to feeder`);
  } catch (error) {
    next(error);
  }
};

const updateDosenPengajarKelasKuliah = async (id_aktivitas_mengajar, req, res, next) => {
  try {
    // get data dosen pengajar kelas kuliah from local
    let dosen_pengajar_kelas_kuliah = await DosenPengajarKelasKuliah.findByPk(id_aktivitas_mengajar);

    if (!dosen_pengajar_kelas_kuliah) {
      return res.status(404).json({ message: "Dosen Pengajar Kelas kuliah not found" });
    }

    // get data kelas kuliah yang sudah di singkron ke feeder
    let kelas_kuliah = await KelasKuliah.findByPk(dosen_pengajar_kelas_kuliah.id_kelas_kuliah);

    if (!kelas_kuliah) {
      return res.status(404).json({ message: "Kelas kuliah not found" });
    }

    if (kelas_kuliah.id_feeder == null || kelas_kuliah.id_feeder == "") {
      return res.status(404).json({ message: `Kelas kuliah dengan ID ${kelas_kuliah.id_kelas_kuliah} belum dilakukan singkron ke feeder` });
    }

    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // akan update data dosen pengajar kelas kuliah ke feeder
    const requestBody = {
      act: "UpdateDosenPengajarKelasKuliah",
      token: `${token}`,
      key: {
        id_aktivitas_mengajar: dosen_pengajar_kelas_kuliah.id_feeder,
      },
      record: {
        id_registrasi_dosen: dosen_pengajar_kelas_kuliah.id_registrasi_dosen,
        id_kelas_kuliah: kelas_kuliah.id_feeder,
        sks_substansi_total: dosen_pengajar_kelas_kuliah.sks_substansi_total,
        rencana_minggu_pertemuan: dosen_pengajar_kelas_kuliah.rencana_minggu_pertemuan,
        id_jenis_evaluasi: dosen_pengajar_kelas_kuliah.id_jenis_evaluasi,
      },
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // update status pada dosen_pengajar_kelas_kuliah_sync local
    let dosen_pengajar_kelas_kuliah_sync = await DosenPengajarKelasKuliahSync.findOne({
      where: {
        id_aktivitas_mengajar: id_aktivitas_mengajar,
        status: false,
        jenis_singkron: "update",
        id_feeder: dosen_pengajar_kelas_kuliah.id_feeder,
      },
    });

    if (!dosen_pengajar_kelas_kuliah_sync) {
      return res.status(404).json({ message: "Dosen Pengajar Kelas kuliah sync not found" });
    }

    dosen_pengajar_kelas_kuliah_sync.status = true;
    await dosen_pengajar_kelas_kuliah_sync.save();

    // update last sync pada dosen pengajar kelas kuliah
    dosen_pengajar_kelas_kuliah.last_sync = new Date();
    await dosen_pengajar_kelas_kuliah.save();

    // result
    console.log(`Successfully updated dosen pengajar kelas kuliah with ID Feeder ${dosen_pengajar_kelas_kuliah.id_feeder} to feeder`);
  } catch (error) {
    next(error);
  }
};

// dinonaktifkan
// const deleteDosenPengajarKelasKuliah = async (id_feeder, req, res, next) => {
//   try {
//     // Mendapatkan token
//     const { token, url_feeder } = await getToken();

//     // akan delete data dosen pengajar kelas kuliah ke feeder
//     const requestBody = {
//       act: "DeleteDosenPengajarKelasKuliah",
//       token: `${token}`,
//       key: {
//         id_aktivitas_mengajar: id_feeder,
//       },
//     };

//     // Menggunakan token untuk mengambil data
//     const response = await axios.post(url_feeder, requestBody);

//     // Mengecek jika ada error pada respons dari server
//     if (response.data.error_code !== 0) {
//       throw new Error(`Error from Feeder: ${response.data.error_desc}`);
//     }

//     // update status pada dosen_pengajar_kelas_kuliah_sync local
//     let dosen_pengajar_kelas_kuliah_sync = await DosenPengajarKelasKuliahSync.findOne({
//       where: {
//         id_feeder: id_feeder,
//         status: false,
//         jenis_singkron: "delete",
//         id_aktivitas_mengajar: null,
//       },
//     });

//     if (!dosen_pengajar_kelas_kuliah_sync) {
//       return res.status(404).json({ message: "Dosen Pengajar Kelas kuliah sync not found" });
//     }

//     dosen_pengajar_kelas_kuliah_sync.status = true;
//     await dosen_pengajar_kelas_kuliah_sync.save();

//     // result
//     console.log(`Successfully deleted dosen pengajar kelas kuliah with ID Feeder ${dosen_pengajar_kelas_kuliah_sync.id_feeder} to feeder`);
//   } catch (error) {
//     next(error);
//   }
// };

const syncDosenPengajarKelasKuliahs = async (req, res, next) => {
  try {
    const { dosen_pengajar_kelas_kuliah_syncs } = req.body;

    // Validasi input
    if (!dosen_pengajar_kelas_kuliah_syncs || !Array.isArray(dosen_pengajar_kelas_kuliah_syncs)) {
      return res.status(400).json({ message: "Request body tidak valid" });
    }

    // perulangan untuk aksi data dosen pengajar kelas kuliah berdasarkan jenis singkron
    for (const dosen_pengajar_kelas_kuliah_sync of dosen_pengajar_kelas_kuliah_syncs) {
      // get data dosen pengajar kelas kuliah sync
      const data_dosen_pengajar_kelas_kuliah_sync = await DosenPengajarKelasKuliahSync.findByPk(dosen_pengajar_kelas_kuliah_sync.id);

      if (!data_dosen_pengajar_kelas_kuliah_sync) {
        return res.status(404).json({ message: "Data Dosen Pengajar Kelas kuliah sync not found" });
      }

      if (data_dosen_pengajar_kelas_kuliah_sync.status === false) {
        if (data_dosen_pengajar_kelas_kuliah_sync.jenis_singkron === "create") {
          await insertDosenPengajarKelasKuliah(data_dosen_pengajar_kelas_kuliah_sync.id_aktivitas_mengajar, req, res, next);
        } else if (data_dosen_pengajar_kelas_kuliah_sync.jenis_singkron === "update") {
          await updateDosenPengajarKelasKuliah(data_dosen_pengajar_kelas_kuliah_sync.id_aktivitas_mengajar, req, res, next);
        }
        // dinonaktifkan
        // else if (data_dosen_pengajar_kelas_kuliah_sync.jenis_singkron === "delete") {
        //   await deleteDosenPengajarKelasKuliah(data_dosen_pengajar_kelas_kuliah_sync.id_feeder, req, res, next);
        // }
      } else {
        console.log(`Data Dosen Pengajar Kelas Kuliah Sync dengan ID ${dosen_pengajar_kelas_kuliah_sync.id} tidak valid untuk dilakukan singkron`);
      }
    }

    // return
    res.status(200).json({ message: "Singkron dosen pengajar kelas kuliah lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  matchingcDataDosenPengajarKelasKuliah,
  matchingSyncDataDosenPengajarKelasKuliah,
  syncDosenPengajarKelasKuliahs,
};
