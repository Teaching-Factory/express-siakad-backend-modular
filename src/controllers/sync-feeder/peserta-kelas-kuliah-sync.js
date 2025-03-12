const { PesertaKelasKuliah, PesertaKelasKuliahSync, Mahasiswa, RiwayatPendidikanMahasiswa, Angkatan, KelasKuliah } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

async function getPesertaKelasKuliahFromFeeder(angkatanId, req, res, next) {
  try {
    if (!angkatanId) {
      return res.status(400).json({
        message: "Angkatan ID is required",
      });
    }

    // get data angkatan
    let angkatan = await Angkatan.findByPk(angkatanId);

    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetPesertaKelasKuliah",
      token: token,
      filter: `angkatan='${angkatan.tahun}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

async function getPesertaKelasKuliahFromLocal(angkatanId, req, res, next) {
  try {
    // get data angkatan
    let angkatan = await Angkatan.findByPk(angkatanId);

    // Dapatkan data peserta kelas kuliah berdasarkan angkatan
    const pesertaKelasKuliah = await PesertaKelasKuliah.findAll({
      where: {
        angkatan: angkatan.tahun,
      },
      include: [
        {
          model: KelasKuliah,
          attributes: ["id_feeder"],
        },
        {
          model: Mahasiswa,
          attributes: ["id_registrasi_mahasiswa"],
          include: [{ model: RiwayatPendidikanMahasiswa, attributes: ["id_feeder"] }],
        },
      ],
    });

    return pesertaKelasKuliah;
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

async function matchingDataPesertaKelasKuliah(req, res, next) {
  try {
    // Dapatkan ID dari parameter permintaan
    const angkatanId = req.params.id_angkatan;

    if (!angkatanId) {
      return res.status(400).json({
        message: "Angkatan ID required",
      });
    }

    // get peserta kelas kuliah local dan feeder
    const pesertaKelasKuliahFeeder = await getPesertaKelasKuliahFromFeeder(angkatanId);
    const pesertaKelasKuliahLocal = await getPesertaKelasKuliahFromLocal(angkatanId);

    let pesertaKelasKuliahFeederMap = pesertaKelasKuliahFeeder.reduce((map, peserta_kelas) => {
      let uniqueKey = `${peserta_kelas.id_kelas_kuliah}-${peserta_kelas.id_registrasi_mahasiswa}`;
      map[uniqueKey] = peserta_kelas;
      return map;
    }, {});

    // Loop untuk proses sinkronisasi
    for (let localPesertaKelasKuliah of pesertaKelasKuliahLocal) {
      // get data kelas_kuliah.id_feeder dan riwayat_pendidikan_mahasiswa.id_feeder
      let kelas_kuliah = await KelasKuliah.findByPk(localPesertaKelasKuliah.id_kelas_kuliah, {
        attributes: ["id_kelas_kuliah", "id_feeder"],
      });

      if (!kelas_kuliah) {
        return res.status(404).json({
          message: `Kelas Kuliah With ID ${localPesertaKelasKuliah.id_kelas_kuliah} Not Found:`,
        });
      }

      // get data mahasiswa
      let mahasiswa = await Mahasiswa.findByPk(localPesertaKelasKuliah.id_registrasi_mahasiswa, {
        attributes: ["id_registrasi_mahasiswa"],
      });

      if (!mahasiswa) {
        return res.status(404).json({
          message: `Mahasiswa With ID ${localPesertaKelasKuliah.id_registrasi_mahasiswa} Not Found:`,
        });
      }

      let riwayat_pendidikan_mahasiswa = await RiwayatPendidikanMahasiswa.findOne({
        where: {
          id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
        },
        attributes: ["id_riwayat_pend_mhs", "id_feeder"],
      });

      if (!riwayat_pendidikan_mahasiswa) {
        return res.status(404).json({
          message: `Riwayat Pendidikan Mahasiswa With ID ${mahasiswa.id_registrasi_mahasiswa} Not Found:`,
        });
      }

      // Membuat kunci unik dari data lokal
      const uniqueKey = `${kelas_kuliah.id_feeder}-${riwayat_pendidikan_mahasiswa.id_feeder}`;

      // Ambil data feeder berdasarkan kunci unik
      const feederPesertaKelasKuliah = pesertaKelasKuliahFeederMap[uniqueKey];

      const existingSync = await PesertaKelasKuliahSync.findOne({
        where: {
          id_peserta_kuliah: localPesertaKelasKuliah.id_peserta_kuliah,
          jenis_singkron: feederPesertaKelasKuliah ? "update" : "create",
          status: false,
          id_kelas_kuliah_feeder: feederPesertaKelasKuliah ? localPesertaKelasKuliah.id_kelas_kuliah : null,
          id_registrasi_mahasiswa_feeder: feederPesertaKelasKuliah ? localPesertaKelasKuliah.id_registrasi_mahasiswa : null,
        },
      });

      if (existingSync) {
        console.log(`Data peserta kelas kuliah ${localPesertaKelasKuliah.id_peserta_kuliah} sudah disinkronisasi.`);
        continue;
      }

      if (!feederPesertaKelasKuliah) {
        // Proses create
        await PesertaKelasKuliahSync.create({
          jenis_singkron: "create",
          status: false,
          id_kelas_kuliah_feeder: null,
          id_registrasi_mahasiswa_feeder: null,
          id_peserta_kuliah: localPesertaKelasKuliah.id_peserta_kuliah,
        });
        console.log(`Data peserta kelas kuliah ${localPesertaKelasKuliah.id_peserta_kuliah} ditambahkan ke sinkronisasi dengan jenis 'create'.`);
      }
    }

    // Array untuk menyimpan data yang akan ditambahkan ke PesertaKelasKuliahSync
    let syncData = [];

    for (let uniqueKey in pesertaKelasKuliahFeederMap) {
      const feederPesertaKelasKuliah = pesertaKelasKuliahFeederMap[uniqueKey];

      // Mendapatkan data kelas kuliah
      let kelas_kuliah = await KelasKuliah.findOne({
        where: { id_feeder: feederPesertaKelasKuliah.id_kelas_kuliah },
      });

      // Jika data kelas kuliah tidak ditemukan, lanjutkan ke iterasi berikutnya
      if (!kelas_kuliah) {
        console.log(`Kelas Kuliah dengan Feeder ID ${feederPesertaKelasKuliah.id_kelas_kuliah} tidak ditemukan.`);
        continue; // Lanjutkan ke iterasi berikutnya
      }

      // Mendapatkan data riwayat pendidikan mahasiswa
      let riwayat_pendidikan_mahasiswa = await RiwayatPendidikanMahasiswa.findOne({
        where: { id_feeder: feederPesertaKelasKuliah.id_registrasi_mahasiswa },
      });

      // Jika data riwayat pendidikan tidak ditemukan, lanjutkan ke iterasi berikutnya
      if (!riwayat_pendidikan_mahasiswa) {
        console.log(`Riwayat Pendidikan Mahasiswa dengan Feeder ID ${feederPesertaKelasKuliah.id_registrasi_mahasiswa} tidak ditemukan.`);
        continue; // Lanjutkan ke iterasi berikutnya
      }

      // Cari data peserta kelas kuliah di lokal
      const localPesertaKelasKuliah = pesertaKelasKuliahLocal.find(
        (peserta_kelas_kuliah) => kelas_kuliah.id_feeder === peserta_kelas_kuliah.id_kelas_kuliah && riwayat_pendidikan_mahasiswa.id_feeder === peserta_kelas_kuliah.id_registrasi_mahasiswa
      );

      // Jika tidak ditemukan di lokal, tambahkan ke array untuk sinkronisasi
      if (!localPesertaKelasKuliah) {
        const existingSync = await PesertaKelasKuliahSync.findOne({
          where: {
            id_kelas_kuliah_feeder: feederPesertaKelasKuliah.id_kelas_kuliah,
            id_registrasi_mahasiswa_feeder: feederPesertaKelasKuliah.id_registrasi_mahasiswa,
            jenis_singkron: "get",
            status: false,
            id_peserta_kuliah: null,
          },
        });

        // Jika tidak ada sinkronisasi yang sama, simpan dalam array syncData
        if (!existingSync) {
          syncData.push({
            id_kelas_kuliah_feeder: feederPesertaKelasKuliah.id_kelas_kuliah,
            id_registrasi_mahasiswa_feeder: feederPesertaKelasKuliah.id_registrasi_mahasiswa,
            jenis_singkron: "get",
            status: false,
            id_peserta_kuliah: null,
          });
          console.log(`Data peserta kelas kuliah dengan Kelas ID ${feederPesertaKelasKuliah.id_kelas_kuliah} dan Mahasiswa ID ${feederPesertaKelasKuliah.id_registrasi_mahasiswa} ditambahkan ke sinkronisasi dengan jenis 'get'.`);
        }
      }
    }

    // Setelah loop selesai, simpan data sinkronisasi sekaligus
    if (syncData.length > 0) {
      await PesertaKelasKuliahSync.bulkCreate(syncData);
      console.log(`${syncData.length} data peserta kelas kuliah ditambahkan ke sinkronisasi.`);
    }

    console.log("Matching peserta kelas kuliah lokal ke feeder berhasil.");
  } catch (error) {
    console.error("Error during matchingDataPesertaKelasKuliah:", error.message);
    throw error;
  }
}

const matchingSyncDataPesertaKelasKuliah = async (req, res, next) => {
  try {
    await matchingDataPesertaKelasKuliah(req, res, next);
    res.status(200).json({ message: "Matching peserta kelas kuliah lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

// matching khusus untuk delete
async function matchingDataPesertaKelasKuliahDelete(req, res, next) {
  try {
    // Dapatkan ID dari parameter permintaan
    const angkatanId = req.params.id_angkatan;

    if (!angkatanId) {
      return res.status(400).json({
        message: "Angkatan ID required",
      });
    }

    // get peserta kelas kuliah local dan feeder
    const pesertaKelasKuliahFeeder = await getPesertaKelasKuliahFromFeeder(angkatanId);
    const pesertaKelasKuliahLocal = await getPesertaKelasKuliahFromLocal(angkatanId);

    let pesertaKelasKuliahFeederMap = pesertaKelasKuliahFeeder.reduce((map, peserta_kelas) => {
      let uniqueKey = `${peserta_kelas.id_kelas_kuliah}-${peserta_kelas.id_registrasi_mahasiswa}`;
      map[uniqueKey] = peserta_kelas;
      return map;
    }, {});

    // Menyaring data yang tidak ada di Feeder
    const dataTidakAdaDiFeeder = pesertaKelasKuliahLocal.filter((item) => {
      const id_kelas_kuliah_feeder = item.KelasKuliah?.id_feeder; // Ambil dari KelasKuliah
      const id_registrasi_mahasiswa_feeder = item.Mahasiswa?.RiwayatPendidikanMahasiswa?.id_feeder; // Ambil dari Mahasiswa

      // Jika salah satu ID tidak ada, maka data ini tidak valid untuk dihapus
      if (!id_kelas_kuliah_feeder || !id_registrasi_mahasiswa_feeder) return false;

      const uniqueKey = `${id_kelas_kuliah_feeder}-${id_registrasi_mahasiswa_feeder}`;
      return !pesertaKelasKuliahFeederMap[uniqueKey]; // Jika tidak ada di Feeder, berarti harus dihapus
    });

    // Jika ada data yang harus disinkronkan sebagai delete
    if (dataTidakAdaDiFeeder.length > 0) {
      // Ambil semua data yang sudah ada di tabel sinkronisasi untuk mencegah duplikasi
      const existingSyncData = await PesertaKelasKuliahSync.findAll({
        where: {
          jenis_singkron: "delete",
          status: false,
        },
        attributes: ["id_kelas_kuliah_feeder", "id_registrasi_mahasiswa_feeder"],
      });

      // Buat set untuk menyimpan kombinasi id_kelas_kuliah dan id_registrasi_mahasiswa yang sudah ada di tabel sinkronisasi
      const existingSyncIds = new Set(existingSyncData.map((item) => `${item.id_kelas_kuliah_feeder}-${item.id_registrasi_mahasiswa_feeder}`));

      // Filter hanya data yang belum ada di tabel sinkronisasi
      const dataInsert = dataTidakAdaDiFeeder
        .filter((item) => {
          const key = `${item.KelasKuliah?.id_feeder}-${item.Mahasiswa?.RiwayatPendidikanMahasiswa?.id_feeder}`;
          return !existingSyncIds.has(key);
        })
        .map((item) => ({
          jenis_singkron: "delete",
          status: false,
          id_kelas_kuliah_feeder: item.KelasKuliah?.id_feeder,
          id_registrasi_mahasiswa_feeder: item.Mahasiswa?.RiwayatPendidikanMahasiswa?.id_feeder,
        }));

      // Jika ada data yang benar-benar baru, lakukan bulk insert
      if (dataInsert.length > 0) {
        await PesertaKelasKuliahSync.bulkCreate(dataInsert);
        console.log(`${dataInsert.length} data peserta kelas kuliah berhasil ditambahkan ke sinkron sementara dengan jenis delete.`);
      } else {
        console.log("Tidak ada data baru untuk disinkronkan sebagai delete.");
      }
    }

    console.log("Matching peserta kelas kuliah delete lokal ke feeder berhasil.");
  } catch (error) {
    console.error("Error during matchingDataPesertaKelasKuliah:", error.message);
    throw error;
  }
}

const matchingSyncDataPesertaKelasKuliahDelete = async (req, res, next) => {
  try {
    await matchingDataPesertaKelasKuliahDelete(req, res, next);
    res.status(200).json({ message: "Matching peserta kelas kuliah delete lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

// fungsi singkron peserta kelas kuliah
const insertPesertaKelasKuliah = async (id, req, res, next) => {
  try {
    // get data peserta kelas kuliah from local
    let peserta_kelas_kuliah = await PesertaKelasKuliah.findByPk(id);

    if (!peserta_kelas_kuliah) {
      return res.status(404).json({ message: "Peserta Kelas kuliah not found" });
    }

    // get data kelas kuliah yang sudah di singkron ke feeder
    let kelas_kuliah = await KelasKuliah.findOne({
      where: {
        id_kelas_kuliah: peserta_kelas_kuliah.id_kelas_kuliah,
      },
    });

    if (!kelas_kuliah) {
      return res.status(404).json({ message: "Kelas kuliah not found" });
    }

    if (kelas_kuliah.id_feeder == null || kelas_kuliah.id_feeder == "") {
      return res.status(404).json({ message: `Kelas kuliah dengan ID ${kelas_kuliah.id_kelas_kuliah} belum dilakukan singkron ke feeder` });
    }

    // get data riwayat pendidikan mahasiswa
    let mahasiswa = await Mahasiswa.findOne({
      where: {
        id_registrasi_mahasiswa: peserta_kelas_kuliah.id_registrasi_mahasiswa,
      },
    });

    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa not found" });
    }

    let riwayat_pendidikan_mahasiswa = await RiwayatPendidikanMahasiswa.findOne({
      where: {
        id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
      },
    });

    if (!riwayat_pendidikan_mahasiswa) {
      return res.status(404).json({ message: "Riwayat Pendidikan Mahasiswa not found" });
    }

    if (riwayat_pendidikan_mahasiswa.id_feeder == null || riwayat_pendidikan_mahasiswa.id_feeder == "") {
      return res.status(404).json({ message: `Riwayat pendidikan mahasiswa dengan ID ${riwayat_pendidikan_mahasiswa.id_riwayat_pend_mhs} belum dilakukan singkron ke feeder` });
    }

    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // update status pada peserta_kelas_kuliah_sync local
    let peserta_kelas_kuliah_sync = await PesertaKelasKuliahSync.findOne({
      where: {
        id_peserta_kuliah: peserta_kelas_kuliah.id_peserta_kuliah,
        status: false,
        jenis_singkron: "create",
        id_kelas_kuliah_feeder: null,
        id_registrasi_mahasiswa_feeder: null,
      },
    });

    if (!peserta_kelas_kuliah_sync) {
      return res.status(404).json({ message: "Peserta Kelas kuliah sync not found" });
    }

    peserta_kelas_kuliah_sync.status = true;
    await peserta_kelas_kuliah_sync.save();

    // result
    console.log(`Successfully inserted peserta kelas kuliah with ID ${peserta_kelas_kuliah_sync.id} to feeder`);

    // akan insert data peserta kelas kuliah ke feeder
    const requestBody = {
      act: "InsertPesertaKelasKuliah",
      token: `${token}`,
      record: {
        id_registrasi_mahasiswa: riwayat_pendidikan_mahasiswa.id_feeder,
        id_kelas_kuliah: kelas_kuliah.id_feeder,
      },
    };

    // Menggunakan token untuk mengambil data
    await axios.post(url_feeder, requestBody);
  } catch (error) {
    next(error);
  }
};

// dinonaktifkan
// const deletePesertaKelasKuliah = async (id_kelas_kuliah, id_registrasi_mahasiswa, req, res, next) => {
//   try {
//     // Mendapatkan token
//     const { token, url_feeder } = await getToken();

//     // akan delete data peserta kelas kuliah ke feeder
//     const requestBody = {
//       act: "DeletePesertaKelasKuliah",
//       token: `${token}`,
//       key: {
//         id_kelas_kuliah: id_kelas_kuliah,
//         id_registrasi_mahasiswa: id_registrasi_mahasiswa,
//       },
//     };

//     // Menggunakan token untuk mengambil data
//     const response = await axios.post(url_feeder, requestBody);

//     // Mengecek jika ada error pada respons dari server
//     if (response.data.error_code !== 0) {
//       throw new Error(`Error from Feeder: ${response.data.error_desc}`);
//     }

//     // update status pada peserta_kelas_kuliah_sync local
//     let peserta_kelas_kuliah_sync = await PesertaKelasKuliahSync.findOne({
//       where: {
//         id_kelas_kuliah_feeder: id_kelas_kuliah,
//         id_registrasi_mahasiswa_feeder: id_registrasi_mahasiswa,
//         status: false,
//         jenis_singkron: "delete",
//         id_peserta_kuliah: null,
//       },
//     });

//     if (!peserta_kelas_kuliah_sync) {
//       return res.status(404).json({ message: "Peserta Kelas kuliah sync not found" });
//     }

//     peserta_kelas_kuliah_sync.status = true;
//     await peserta_kelas_kuliah_sync.save();

//     // result
//     console.log(
//       `Successfully deleted peserta kelas kuliah with Kelas Kuliah ID Feeder ${peserta_kelas_kuliah_sync.id_kelas_kuliah_feeder} and Riwayat Pendidikan Mahasiswa ID ${peserta_kelas_kuliah_sync.id_registrasi_mahasiswa_feeder} Feeder to feeder`
//     );
//   } catch (error) {
//     next(error);
//   }
// };

// untuk create data feeder ke local
const getAndCreatePesertaKelasKuliah = async (id_kelas_kuliah, id_registrasi_mahasiswa, req, res, next) => {
  try {
    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetPesertaKelasKuliah",
      token: `${token}`,
      filter: `id_kelas_kuliah='${id_kelas_kuliah}' and id_registrasi_mahasiswa='${id_registrasi_mahasiswa}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // Tanggapan dari API
    const dataPesertaKelasKuliah = response.data.data;

    for (const peserta_kelas_kuliah of dataPesertaKelasKuliah) {
      // get data kelas
      let kelas_kuliah = await KelasKuliah.findOne({
        where: {
          id_feeder: peserta_kelas_kuliah.id_kelas_kuliah,
        },
      });

      // get data riwayat pendidikan mahasiswa
      let riwayat_pendidikan_mahasiswa = await RiwayatPendidikanMahasiswa.findOne({
        where: {
          id_feeder: peserta_kelas_kuliah.id_registrasi_mahasiswa,
        },
        include: [{ model: Mahasiswa }],
      });

      // Periksa apakah data sudah ada di tabel
      const existingPesertaKelasKuliah = await PesertaKelasKuliah.findOne({
        where: {
          id_kelas_kuliah: kelas_kuliah.id_kelas_kuliah,
        },
        include: [
          {
            model: Mahasiswa,
            where: {
              id_mahasiswa: riwayat_pendidikan_mahasiswa.Mahasiswa.id_mahasiswa,
            },
          },
        ],
      });

      if (!existingPesertaKelasKuliah) {
        await PesertaKelasKuliah.create({
          angkatan: peserta_kelas_kuliah.angkatan,
          id_kelas_kuliah: peserta_kelas_kuliah.id_kelas_kuliah,
          id_registrasi_mahasiswa: peserta_kelas_kuliah.id_registrasi_mahasiswa,
        });
      }
    }

    // update status pada peserta_kelas_kuliah_sync local
    let peserta_kelas_kuliah_sync = await PesertaKelasKuliahSync.findOne({
      where: {
        id_kelas_kuliah_feeder: id_kelas_kuliah,
        id_registrasi_mahasiswa_feeder: id_registrasi_mahasiswa,
        status: false,
        jenis_singkron: "get",
        id_peserta_kuliah: null,
      },
    });

    if (!peserta_kelas_kuliah_sync) {
      return res.status(404).json({ message: "Peserta Kelas kuliah sync not found" });
    }

    peserta_kelas_kuliah_sync.status = true;
    await peserta_kelas_kuliah_sync.save();

    // result
    console.log(
      `Successfully inserted peserta kelas kuliah with Kelas Kuliah ID Feeder ${peserta_kelas_kuliah_sync.id_kelas_kuliah_feeder} and Riwayat Pendidikan Mahasiswa ID ${peserta_kelas_kuliah_sync.id_registrasi_mahasiswa_feeder} Feeder to feeder`
    );
  } catch (error) {
    next(error);
  }
};

const deletePesertaKelasKuliahLocal = async (id_peserta_kuliah, req, res, next) => {
  try {
    const peserta_kelas_kuliah = await PesertaKelasKuliah.findByPk(id_peserta_kuliah);

    if (!peserta_kelas_kuliah) {
      return res.status(400).json({
        message: "Peserta Kelas Kuliah not found",
      });
    }

    // delete peserta kelas kuliah
    await peserta_kelas_kuliah.destroy();

    console.log(`Successfully deleted peserta kelas kuliah in local with ID ${id_peserta_kuliah}`);
  } catch (error) {
    next(error);
  }
};

const syncPesertaKelasKuliahs = async (req, res, next) => {
  try {
    const { peserta_kelas_kuliah_syncs } = req.body;

    // Validasi input
    if (!peserta_kelas_kuliah_syncs || !Array.isArray(peserta_kelas_kuliah_syncs)) {
      return res.status(400).json({ message: "Request body tidak valid" });
    }

    // perulangan untuk aksi data peserta kelas kuliah berdasarkan jenis singkron
    for (const peserta_kelas_kuliah_sync of peserta_kelas_kuliah_syncs) {
      // get data peserta kelas kuliah sync
      const data_peserta_kelas_kuliah_sync = await PesertaKelasKuliahSync.findByPk(peserta_kelas_kuliah_sync.id);

      if (!data_peserta_kelas_kuliah_sync) {
        return res.status(404).json({ message: "Data Peserta Kelas kuliah sync not found" });
      }

      if (data_peserta_kelas_kuliah_sync.status === false) {
        if (data_peserta_kelas_kuliah_sync.jenis_singkron === "create") {
          await insertPesertaKelasKuliah(data_peserta_kelas_kuliah_sync.id_peserta_kuliah, req, res, next);
        } else if (data_peserta_kelas_kuliah_sync.jenis_singkron === "get") {
          await getAndCreatePesertaKelasKuliah(data_peserta_kelas_kuliah_sync.id_kelas_kuliah_feeder, data_peserta_kelas_kuliah_sync.id_registrasi_mahasiswa_feeder, req, res, next);
        } else if (data_peserta_kelas_kuliah_sync.jenis_singkron === "delete") {
          await deletePesertaKelasKuliahLocal(data_peserta_kelas_kuliah_sync.id_peserta_kuliah, req, res, next);
        }
        // dinonaktifkan
        // else if (data_peserta_kelas_kuliah_sync.jenis_singkron === "delete") {
        //   await deletePesertaKelasKuliah(data_peserta_kelas_kuliah_sync.id_kelas_kuliah_feeder, data_peserta_kelas_kuliah_sync.id_registrasi_mahasiswa_feeder, req, res, next);
        // }
      } else {
        console.log(`Data Peserta Kelas Kuliah Sync dengan ID ${peserta_kelas_kuliah_sync.id} tidak valid untuk dilakukan singkron`);
      }
    }

    // return
    return res.status(200).json({ message: "Singkron peserta kelas kuliah lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  matchingDataPesertaKelasKuliah,
  matchingSyncDataPesertaKelasKuliah,
  matchingSyncDataPesertaKelasKuliahDelete,
  syncPesertaKelasKuliahs,
};
