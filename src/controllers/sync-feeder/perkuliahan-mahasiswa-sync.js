const { PerkuliahanMahasiswa, PerkuliahanMahasiswaSync, Semester, Mahasiswa, RiwayatPendidikanMahasiswa, MahasiswaLulusDO } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");
// const { fetchAllMahasiswaLulusDOIds } = require("../mahasiswa-lulus-do");

async function getPerkuliahanMahasiswaFromFeeder(semesterId, req, res, next) {
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
      act: "GetListPerkuliahanMahasiswa",
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

async function getPerkuliahanMahasiswaFromLocal(semesterId, req, res, next) {
  try {
    // Ambil semua mahasiswa DO/lulus
    const mahasiswaLulusIds = await fetchAllMahasiswaLulusDOIds();

    // Dapatkan data perkuliahan mahasiswa berdasarkan angkatan
    const perkuliahanMahasiswa = await PerkuliahanMahasiswa.findAll({
      where: {
        id_semester: semesterId,
      },
      include: [
        {
          model: Mahasiswa,
          attributes: ["id_registrasi_mahasiswa"],
          include: [{ model: RiwayatPendidikanMahasiswa, attributes: ["id_feeder"] }],
        },
      ],
    });

    // Filter agar mahasiswa yang lulus tidak ikut
    const filtered = perkuliahanMahasiswa.filter((pm) => !mahasiswaLulusIds.includes(pm.Mahasiswa?.id_registrasi_mahasiswa));

    return filtered;
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi pembanding data
function areEqual(value1, value2) {
  return value1 === value2 || (value1 == null && value2 == null);
}

async function matchingPerkuliahanMahasiswa(req, res, next) {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID required",
      });
    }

    // get perkuliahan mahasiswa local dan feeder
    const perkuliahanMahasiswaFeeder = await getPerkuliahanMahasiswaFromFeeder(semesterId);
    const perkuliahanMahasiswaLocal = await getPerkuliahanMahasiswaFromLocal(semesterId);

    let perkuliahanMahasiswaFeederMap = perkuliahanMahasiswaFeeder.reduce((map, perkuliahan_mahasiswa) => {
      let uniqueKey = `${perkuliahan_mahasiswa.id_semester}-${perkuliahan_mahasiswa.id_registrasi_mahasiswa}`;
      map[uniqueKey] = perkuliahan_mahasiswa;
      return map;
    }, {});

    // Loop untuk proses sinkronisasi
    for (let localPerkuliahanMahasiswa of perkuliahanMahasiswaLocal) {
      // get data semester (id_semester) dan riwayat_pendidikan_mahasiswa.id_feeder
      let semester = await Semester.findByPk(localPerkuliahanMahasiswa.id_semester, {
        attributes: ["id_semester", "nama_semester"],
      });

      if (!semester) {
        return res.status(404).json({
          message: `Semester With ID ${localPerkuliahanMahasiswa.id_semester} Not Found:`,
        });
      }

      // get data mahasiswa
      let mahasiswa = await Mahasiswa.findByPk(localPerkuliahanMahasiswa.id_registrasi_mahasiswa, {
        attributes: ["id_registrasi_mahasiswa"],
      });

      if (!mahasiswa) {
        return res.status(404).json({
          message: `Mahasiswa With ID ${localPerkuliahanMahasiswa.id_registrasi_mahasiswa} Not Found:`,
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
      const uniqueKey = `${semester.id_semester}-${riwayat_pendidikan_mahasiswa.id_feeder}`;

      // Ambil data feeder berdasarkan kunci unik
      const feederPerkuliahanMahasiswa = perkuliahanMahasiswaFeederMap[uniqueKey];

      const existingSync = await PerkuliahanMahasiswaSync.findOne({
        where: {
          id_perkuliahan_mahasiswa: localPerkuliahanMahasiswa.id_perkuliahan_mahasiswa,
          jenis_singkron: feederPerkuliahanMahasiswa ? "update" : "create",
          status: false,
          id_semester_feeder: feederPerkuliahanMahasiswa ? localPerkuliahanMahasiswa.id_semester : null,
          id_registrasi_mahasiswa_feeder: feederPerkuliahanMahasiswa ? localPerkuliahanMahasiswa.id_registrasi_mahasiswa : null,
        },
      });

      if (existingSync) {
        console.log(`Data perkuliahan mahasiswa ${localPerkuliahanMahasiswa.id_perkuliahan_mahasiswa} sudah disinkronisasi.`);
        continue;
      }

      if (!feederPerkuliahanMahasiswa) {
        // Proses create
        await PerkuliahanMahasiswaSync.create({
          jenis_singkron: "create",
          status: false,
          id_semester_feeder: null,
          id_registrasi_mahasiswa_feeder: null,
          id_perkuliahan_mahasiswa: localPerkuliahanMahasiswa.id_perkuliahan_mahasiswa,
        });
        console.log(`Data perkuliahan ${localPerkuliahanMahasiswa.id_perkuliahan_mahasiswa} ditambahkan ke sinkronisasi dengan jenis 'create'.`);
      } else if (feederPerkuliahanMahasiswa) {
        let perkuliahan_mahasiswa_sync_local = await PerkuliahanMahasiswaSync.findOne({
          where: {
            jenis_singkron: "update",
            status: false,
            id_semester_feeder: feederPerkuliahanMahasiswa.id_semester,
            id_registrasi_mahasiswa_feeder: feederPerkuliahanMahasiswa.id_registrasi_mahasiswa,
            id_perkuliahan_mahasiswa: localPerkuliahanMahasiswa.id_perkuliahan_mahasiswa,
          },
        });

        if (!perkuliahan_mahasiswa_sync_local) {
          // proses perbandingan data local dengan data feeder
          const isUpdated = comparePerkuliahanMahasiswa(localPerkuliahanMahasiswa, feederPerkuliahanMahasiswa);

          if (isUpdated) {
            await PerkuliahanMahasiswaSync.create({
              jenis_singkron: "update",
              status: false,
              id_semester_feeder: feederPerkuliahanMahasiswa.id_semester,
              id_registrasi_mahasiswa_feeder: feederPerkuliahanMahasiswa.id_registrasi_mahasiswa,
              id_perkuliahan_mahasiswa: localPerkuliahanMahasiswa.id_perkuliahan_mahasiswa,
            });
            console.log(`Data perkuliahan mahasiswa ${localPerkuliahanMahasiswa.id_perkuliahan_mahasiswa} ditambahkan ke sinkronisasi dengan jenis 'update'.`);
          }
        }
      } else {
        console.error(`Perkuliahan mahasiswa lokal untuk ${localPerkuliahanMahasiswa.id_perkuliahan_mahasiswa} tidak ditemukan.`);
      }
    }

    // Fungsi pembanding perkuliahan mahasiswa
    function comparePerkuliahanMahasiswa(localPerkuliahanMhs, feederPerkuliahanMhs) {
      return (
        !areEqual(localPerkuliahanMhs.angkatan, feederPerkuliahanMhs.angkatan) ||
        !areEqual(localPerkuliahanMhs.ips, feederPerkuliahanMhs.ips) ||
        !areEqual(localPerkuliahanMhs.ipk, feederPerkuliahanMhs.ipk) ||
        !areEqual(localPerkuliahanMhs.sks_semester, feederPerkuliahanMhs.sks_semester) ||
        !areEqual(localPerkuliahanMhs.sks_total, feederPerkuliahanMhs.sks_total) ||
        !areEqual(localPerkuliahanMhs.biaya_kuliah_smt, feederPerkuliahanMhs.biaya_kuliah_smt) ||
        localPerkuliahanMhs.id_registrasi_mahasiswa !== feederPerkuliahanMhs.id_registrasi_mahasiswa ||
        localPerkuliahanMhs.id_semester !== feederPerkuliahanMhs.id_semester ||
        localPerkuliahanMhs.id_status_mahasiswa !== feederPerkuliahanMhs.id_status_mahasiswa ||
        !areEqual(localPerkuliahanMhs.id_pembiayaan, feederPerkuliahanMhs.id_pembiayaan)
      );
    }

    // Array untuk menyimpan data yang akan ditambahkan ke PerkuliahanMahasiswaSync
    let syncData = [];

    for (let uniqueKey in perkuliahanMahasiswaFeederMap) {
      const feederPerkuliahanMahasiswa = perkuliahanMahasiswaFeederMap[uniqueKey];

      // Mendapatkan data semester
      let semester = await Semester.findOne({
        where: { id_semester: feederPerkuliahanMahasiswa.id_semester },
      });

      // Jika data semester tidak ditemukan, lanjutkan ke iterasi berikutnya
      if (!semester) {
        console.log(`Semester dengan ID ${feederPerkuliahanMahasiswa.id_semester} tidak ditemukan.`);
        continue; // Lanjutkan ke iterasi berikutnya
      }

      // Mendapatkan data riwayat pendidikan mahasiswa
      let riwayat_pendidikan_mahasiswa = await RiwayatPendidikanMahasiswa.findOne({
        where: { id_feeder: feederPerkuliahanMahasiswa.id_registrasi_mahasiswa },
      });

      // Jika data riwayat pendidikan tidak ditemukan, lanjutkan ke iterasi berikutnya
      if (!riwayat_pendidikan_mahasiswa) {
        console.log(`Riwayat Pendidikan Mahasiswa dengan Feeder ID ${feederPerkuliahanMahasiswa.id_registrasi_mahasiswa} tidak ditemukan.`);
        continue; // Lanjutkan ke iterasi berikutnya
      }

      // Cari data perkuliahan mahasiswa di lokal
      const localPerkuliahanMahasiswa = perkuliahanMahasiswaLocal.find((perkuliahan_mhs) => semester.id_semester === perkuliahan_mhs.id_semester && riwayat_pendidikan_mahasiswa.id_feeder === perkuliahan_mhs.id_registrasi_mahasiswa);

      // Jika tidak ditemukan di lokal, tambahkan ke array untuk sinkronisasi
      if (!localPerkuliahanMahasiswa) {
        const existingSync = await PerkuliahanMahasiswaSync.findOne({
          where: {
            id_semester_feeder: feederPerkuliahanMahasiswa.id_semester,
            id_registrasi_mahasiswa_feeder: feederPerkuliahanMahasiswa.id_registrasi_mahasiswa,
            jenis_singkron: "get",
            status: false,
            id_perkuliahan_mahasiswa: null,
          },
        });

        // Jika tidak ada sinkronisasi yang sama, simpan dalam array syncData
        if (!existingSync) {
          syncData.push({
            id_semester_feeder: feederPerkuliahanMahasiswa.id_semester,
            id_registrasi_mahasiswa_feeder: feederPerkuliahanMahasiswa.id_registrasi_mahasiswa,
            jenis_singkron: "get",
            status: false,
            id_perkuliahan_mahasiswa: null,
          });
          console.log(`Data perkuliahan mahasiswa dengan Semester ID ${feederPerkuliahanMahasiswa.id_semester} dan Mahasiswa ID ${feederPerkuliahanMahasiswa.id_registrasi_mahasiswa} ditambahkan ke sinkronisasi dengan jenis 'get'.`);
        }
      }
    }

    // menambahkan data perkuliahan mahasiswa sync
    if (syncData.length > 0) {
      await PerkuliahanMahasiswaSync.bulkCreate(syncData);
    }

    console.log("Matching perkuliahan mahasiswa lokal ke feeder berhasil.");
  } catch (error) {
    console.error("Error during matchingPerkuliahanMahasiswa:", error.message);
    throw error;
  }
}

const matchingSyncDataPerkuliahanMahasiswa = async (req, res, next) => {
  try {
    await matchingPerkuliahanMahasiswa(req, res, next);
    res.status(200).json({ message: "Matching perkuliahan mahasiswa lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

// matching khusus untuk delete
async function matchingPerkuliahanMahasiswaDelete(req, res, next) {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID required",
      });
    }

    // get perkuliahan local dan feeder
    const perkuliahanMahasiswaFeeder = await getPerkuliahanMahasiswaFromFeeder(semesterId);
    const perkuliahanMahasiswaLocal = await getPerkuliahanMahasiswaFromLocal(semesterId);

    let perkuliahanMahasiswaFeederMap = perkuliahanMahasiswaFeeder.reduce((map, perkuliahan_mhs) => {
      let uniqueKey = `${perkuliahan_mhs.id_semester}-${perkuliahan_mhs.id_registrasi_mahasiswa}`;
      map[uniqueKey] = perkuliahan_mhs;
      return map;
    }, {});

    // Menyaring data yang tidak ada di Feeder
    const dataTidakAdaDiFeeder = perkuliahanMahasiswaLocal.filter((item) => {
      const id_semester_feeder = item?.id_semester; // Ambil dari id_semester langsung
      const id_registrasi_mahasiswa_feeder = item.Mahasiswa?.RiwayatPendidikanMahasiswa?.id_feeder; // Ambil dari Mahasiswa

      // Jika salah satu ID tidak ada, maka data ini tidak valid untuk dihapus
      if (!id_semester_feeder || !id_registrasi_mahasiswa_feeder) return false;

      const uniqueKey = `${id_semester_feeder}-${id_registrasi_mahasiswa_feeder}`;
      return !perkuliahanMahasiswaFeederMap[uniqueKey]; // Jika tidak ada di Feeder, berarti harus dihapus (data lokalnya)
    });

    // Jika ada data yang harus disinkronkan sebagai delete
    if (dataTidakAdaDiFeeder.length > 0) {
      // Ambil semua data yang sudah ada di tabel sinkronisasi untuk mencegah duplikasi
      const existingSyncData = await PerkuliahanMahasiswaSync.findAll({
        where: {
          jenis_singkron: "delete",
          status: false,
        },
        attributes: ["id_semester_feeder", "id_registrasi_mahasiswa_feeder"],
      });

      // Buat set untuk menyimpan kombinasi id_semester dan id_registrasi_mahasiswa yang sudah ada di tabel sinkronisasi
      const existingSyncIds = new Set(existingSyncData.map((item) => `${item.id_semester_feeder}-${item.id_registrasi_mahasiswa_feeder}`));

      // Filter hanya data yang belum ada di tabel sinkronisasi
      const dataInsert = dataTidakAdaDiFeeder
        .filter((item) => {
          const key = `${item?.id_semester}-${item.Mahasiswa?.RiwayatPendidikanMahasiswa?.id_feeder}`;
          return !existingSyncIds.has(key);
        })
        .map((item) => ({
          jenis_singkron: "delete",
          status: false,
          id_semester_feeder: item?.id_semester,
          id_registrasi_mahasiswa_feeder: item.Mahasiswa?.RiwayatPendidikanMahasiswa?.id_feeder,
        }));

      // Jika ada data yang benar-benar baru, lakukan bulk insert
      if (dataInsert.length > 0) {
        await PerkuliahanMahasiswaSync.bulkCreate(dataInsert);
        console.log(`${dataInsert.length} data perkuliahan mahasiswa kuliah berhasil ditambahkan ke sinkron sementara dengan jenis delete.`);
      } else {
        console.log("Tidak ada data baru untuk disinkronkan sebagai delete.");
      }
    }

    console.log("Matching perkuliahan mahasiswa delete lokal ke feeder berhasil.");
  } catch (error) {
    console.error("Error during matchingPerkuliahanMahasiswa:", error.message);
    throw error;
  }
}

const matchingSyncDataPerkuliahanMahasiswaDelete = async (req, res, next) => {
  try {
    await matchingPerkuliahanMahasiswaDelete(req, res, next);
    res.status(200).json({ message: "Matching perkuliahan mahasiswa delete lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

// fungsi singkron perkuliahan mahasiswa
const insertPerkuliahanMahasiswa = async (id_perkuliahan_mahasiswa, req, res, next) => {
  try {
    // get data perkuliahan mahasiswa from local
    let perkuliahan_mahasiswa = await PerkuliahanMahasiswa.findByPk(id_perkuliahan_mahasiswa);

    if (!perkuliahan_mahasiswa) {
      return res.status(404).json({ message: "Perkuliahan mahasiswa not found" });
    }

    // get data perkuliahan mahasiswa sync dengan jenis create
    let perkuliahan_mahasiswa_sync = await PerkuliahanMahasiswaSync.findOne({
      where: {
        id_perkuliahan_mahasiswa: perkuliahan_mahasiswa.id_perkuliahan_mahasiswa,
        status: false,
        jenis_singkron: "create",
        id_semester_feeder: null,
        id_registrasi_mahasiswa_feeder: null,
      },
    });

    if (!perkuliahan_mahasiswa_sync) {
      return res.status(404).json({ message: "Perkuliahan Mahasiswa sync not found" });
    }

    // get data riwayat pendidikan mahasiswa
    let mahasiswa = await Mahasiswa.findOne({
      where: {
        id_registrasi_mahasiswa: perkuliahan_mahasiswa.id_registrasi_mahasiswa,
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

    // membuat request body untuk insert data perkuliahan mahasiswa ke feeder
    const requestBody = {
      act: "InsertPerkuliahanMahasiswa",
      token: `${token}`,
      record: {
        id_registrasi_mahasiswa: riwayat_pendidikan_mahasiswa.id_feeder,
        id_semester: perkuliahan_mahasiswa.id_semester,
        id_status_mahasiswa: perkuliahan_mahasiswa.id_status_mahasiswa,
        id_pembiayaan: perkuliahan_mahasiswa.id_pembiayaan ?? 1,
        ips: perkuliahan_mahasiswa.ips,
        ipk: perkuliahan_mahasiswa.ipk,
        sks_semester: perkuliahan_mahasiswa.sks_semester,
        total_sks: perkuliahan_mahasiswa.sks_total,
        biaya_kuliah_smt: perkuliahan_mahasiswa.biaya_kuliah_smt === null || perkuliahan_mahasiswa.biaya_kuliah_smt === undefined || perkuliahan_mahasiswa.biaya_kuliah_smt === 0 ? 100 : perkuliahan_mahasiswa.biaya_kuliah_smt,
      },
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code === 1260) {
      // jika eror Data aktivitas mahasiswa sudah ada, maka lakukan update
      const requestBodyUpdate = {
        act: "UpdatePerkuliahanMahasiswa",
        token: `${token}`,
        key: {
          id_registrasi_mahasiswa: riwayat_pendidikan_mahasiswa.id_feeder,
          id_semester: perkuliahan_mahasiswa.id_semester,
        },
        record: {
          id_status_mahasiswa: perkuliahan_mahasiswa.id_status_mahasiswa,
          id_pembiayaan: perkuliahan_mahasiswa.id_pembiayaan,
          ips: perkuliahan_mahasiswa.ips,
          ipk: perkuliahan_mahasiswa.ipk,
          sks_semester: perkuliahan_mahasiswa.sks_semester,
          total_sks: perkuliahan_mahasiswa.sks_total,
          biaya_kuliah_smt: perkuliahan_mahasiswa.biaya_kuliah_smt === null || perkuliahan_mahasiswa.biaya_kuliah_smt === undefined || perkuliahan_mahasiswa.biaya_kuliah_smt === 0 ? 100 : perkuliahan_mahasiswa.biaya_kuliah_smt,
        },
      };

      // Menggunakan token untuk mengambil data (update)
      await axios.post(url_feeder, requestBodyUpdate);

      perkuliahan_mahasiswa_sync.status = true;
      await perkuliahan_mahasiswa_sync.save();
    }

    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    perkuliahan_mahasiswa_sync.status = true;
    await perkuliahan_mahasiswa_sync.save();

    // result
    console.log(`Successfully inserted perkuliahan mahasiswa with ID ${perkuliahan_mahasiswa_sync.id_perkuliahan_mahasiswa} to feeder`);
  } catch (error) {
    next(error);
  }
};

const updatePerkuliahanMahasiswa = async (id_perkuliahan_mahasiswa, id_registrasi_mahasiswa_feeder, req, res, next) => {
  try {
    // get data perkuliahan mahasiswa from local
    const perkuliahan_mahasiswa = await PerkuliahanMahasiswa.findOne({
      where: {
        id_perkuliahan_mahasiswa: id_perkuliahan_mahasiswa,
      },
    });

    if (!perkuliahan_mahasiswa) {
      return res.status(404).json({ message: "Perkuliahan mahasiswa not found" });
    }

    // get data perkuliahan_mahasiswa_sync
    let perkuliahan_mahasiswa_sync = await PerkuliahanMahasiswaSync.findOne({
      where: {
        id_perkuliahan_mahasiswa: id_perkuliahan_mahasiswa,
        id_registrasi_mahasiswa_feeder: id_registrasi_mahasiswa_feeder,
        id_semester_feeder: perkuliahan_mahasiswa.id_semester,
        status: false,
        jenis_singkron: "update",
      },
    });

    if (!perkuliahan_mahasiswa_sync) {
      return res.status(404).json({ message: "Perkuliahan mahasiswa sync not found" });
    }

    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // akan update data perkuliahan mahasiswa ke feeder
    const requestBody = {
      act: "UpdatePerkuliahanMahasiswa",
      token: `${token}`,
      key: {
        id_registrasi_mahasiswa: id_registrasi_mahasiswa_feeder,
        id_semester: perkuliahan_mahasiswa.id_semester,
      },
      record: {
        id_status_mahasiswa: perkuliahan_mahasiswa.id_status_mahasiswa,
        id_pembiayaan: perkuliahan_mahasiswa.id_pembiayaan,
        ips: perkuliahan_mahasiswa.ips,
        ipk: perkuliahan_mahasiswa.ipk,
        sks_semester: perkuliahan_mahasiswa.sks_semester,
        total_sks: perkuliahan_mahasiswa.sks_total,
        biaya_kuliah_smt: perkuliahan_mahasiswa.biaya_kuliah_smt,
      },
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // update status pada perkuliahan_mahasiswa_sync local
    perkuliahan_mahasiswa_sync.status = true;
    await perkuliahan_mahasiswa_sync.save();

    // result
    console.log(`Successfully updated perkuliahan mahasiswa with Mahasiswa ID ${perkuliahan_mahasiswa_sync.id_registrasi_mahasiswa_feeder} and Semester ID ${perkuliahan_mahasiswa_sync.id_semester_feeder} to feeder`);
  } catch (error) {
    next(error);
  }
};

const getAndCreatePerkuliahanMahasiswa = async (id_perkuliahan_mahasiswa, id_semester_feeder, id_registrasi_mahasiswa_feeder, req, res, next) => {
  try {
    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // get data perkuliahan mahasiswa sync
    let perkuliahan_mahasiswa_sync = await PerkuliahanMahasiswaSync.findOne({
      where: {
        id_perkuliahan_mahasiswa: id_perkuliahan_mahasiswa,
        id_registrasi_mahasiswa_feeder: id_registrasi_mahasiswa_feeder,
        id_semester_feeder: id_semester_feeder,
        status: false,
        jenis_singkron: "get",
      },
    });

    if (!perkuliahan_mahasiswa_sync) {
      return res.status(404).json({ message: "Perkuliahan mahasiswa sync not found" });
    }

    const requestBody = {
      act: "GetListPerkuliahanMahasiswa",
      token: `${token}`,
      filter: `id_registrasi_mahasiswa='${id_registrasi_mahasiswa_feeder}' and id_semester='${id_semester_feeder}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // Tanggapan dari API
    const dataPerkuliahanMahasiswa = response.data.data;

    // create data perkuliahan mahasiswa
    for (const perkuliahan_mahasiswa of dataPerkuliahanMahasiswa) {
      // Periksa apakah data sudah ada di tabel
      const existingPerkuliahanMahasiswa = await PerkuliahanMahasiswa.findOne({
        where: {
          id_registrasi_mahasiswa: perkuliahan_mahasiswa.id_registrasi_mahasiswa,
          id_semester: perkuliahan_mahasiswa.id_semester,
        },
      });

      if (!existingPerkuliahanMahasiswa) {
        // Data belum ada, buat entri baru di database
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
      }
    }

    // update status pada perkuliahan_mahasiswa_sync local
    perkuliahan_mahasiswa_sync.status = true;
    await perkuliahan_mahasiswa_sync.save();

    // result
    console.log(`Successfully inserted perkuliahan mahasiswa with Mahasiswa ID ${id_registrasi_mahasiswa_feeder} and Semester ID ${id_semester_feeder} to feeder`);
  } catch (error) {
    next(error);
  }
};

const deletePerkuliahanMahasiswaLocal = async (id_perkuliahan_mahasiswa, req, res, next) => {
  try {
    const perkuliahan_mahasiswa = await PerkuliahanMahasiswa.findByPk(id_perkuliahan_mahasiswa);

    if (!perkuliahan_mahasiswa) {
      return res.status(400).json({
        message: "Perkuliahan mahasiswa not found",
      });
    }

    // delete perkuliahan mahasiswa
    await perkuliahan_mahasiswa.destroy();

    console.log(`Successfully deleted perkuliahan mahasiswa in local with ID ${id_perkuliahan_mahasiswa}`);
  } catch (error) {
    next(error);
  }
};

const syncPerkuliahanMahasiswas = async (req, res, next) => {
  try {
    const { perkuliahan_mahasiswas } = req.body;

    // Validasi input
    if (!perkuliahan_mahasiswas || !Array.isArray(perkuliahan_mahasiswas)) {
      return res.status(400).json({ message: "Request body tidak valid" });
    }

    // perulangan untuk aksi data perkuliahan mahasiswa berdasarkan jenis singkron
    for (const perkuliahan_mhs_sync of perkuliahan_mahasiswas) {
      // get data perkuliahan mahasiswa sync
      const data_perkuliahan_mahasiswa_sync = await PerkuliahanMahasiswaSync.findByPk(perkuliahan_mhs_sync.id);

      if (!data_perkuliahan_mahasiswa_sync) {
        return res.status(404).json({ message: "Data Perkuliahan Mahasiswa sync not found" });
      }

      if (data_perkuliahan_mahasiswa_sync.status === false) {
        if (data_perkuliahan_mahasiswa_sync.jenis_singkron === "create") {
          await insertPerkuliahanMahasiswa(data_perkuliahan_mahasiswa_sync.id_perkuliahan_mahasiswa, req, res, next);
        } else if (data_perkuliahan_mahasiswa_sync.jenis_singkron === "update") {
          await updatePerkuliahanMahasiswa(data_perkuliahan_mahasiswa_sync.id_perkuliahan_mahasiswa, data_perkuliahan_mahasiswa_sync.id_registrasi_mahasiswa_feeder, req, res, next);
        } else if (data_perkuliahan_mahasiswa_sync.jenis_singkron === "get") {
          await getAndCreatePerkuliahanMahasiswa(data_perkuliahan_mahasiswa_sync.id_perkuliahan_mahasiswa, data_perkuliahan_mahasiswa_sync.id_semester_feeder, data_perkuliahan_mahasiswa_sync.id_registrasi_mahasiswa_feeder, req, res, next);
        } else if (data_perkuliahan_mahasiswa_sync.jenis_singkron === "delete") {
          await deletePerkuliahanMahasiswaLocal(data_perkuliahan_mahasiswa_sync.id_perkuliahan_mahasiswa, req, res, next);
        }
      } else {
        console.log(`Data Perkuliahan Mahasiswa Sync dengan ID ${perkuliahan_mhs_sync.id} tidak valid untuk dilakukan singkron`);
      }
    }

    // return
    return res.status(200).json({ message: "Singkron perkuliahan mahasiswa lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  matchingPerkuliahanMahasiswa,
  matchingSyncDataPerkuliahanMahasiswa,
  matchingSyncDataPerkuliahanMahasiswaDelete,
  syncPerkuliahanMahasiswas,
};
