const { DosenPengajarKelasKuliah, DosenPengajarKelasKuliahSync, KelasKuliah } = require("../../../models");
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

    // Tambahkan mapping untuk data KelasKuliah dari Feeder
    const kelasKuliahFeeder = await getKelasKuliahFromFeeder(semesterId);
    const kelasKuliahFeederMap = kelasKuliahFeeder.reduce((map, kelas) => {
      map[kelas.id_feeder] = kelas.id_kelas_kuliah; // Mapping id_feeder ke id_kelas_kuliah Feeder
      return map;
    }, {});

    // Perbarui logika sinkronisasi
    for (let localDosenPengajar of dosenPengajarKelasKuliahLocal) {
      const feederDosenPengajar = dosenPengajarKelasKuliahFeederMap[localDosenPengajar.id_feeder];

      // Ambil id_kelas_kuliah dari Feeder berdasarkan id_feeder
      const feederKelasKuliahId = kelasKuliahFeederMap[localDosenPengajar.id_kelas_kuliah];

      // Jika data lokal tidak ada di Feeder, tambahkan sebagai create
      if (!feederDosenPengajar) {
        const existingSync = await DosenPengajarKelasKuliahSync.findOne({
          where: {
            id_aktivitas_mengajar: localDosenPengajar.id_aktivitas_mengajar,
          },
        });

        if (!existingSync) {
          await DosenPengajarKelasKuliahSync.create({
            jenis_singkron: "create",
            status: false,
            id_feeder: null,
            id_aktivitas_mengajar: localDosenPengajar.id_aktivitas_mengajar,
          });
          console.log(`Data dosen pengajar kelas kuliah ${localDosenPengajar.id_aktivitas_mengajar} ditambahkan ke sinkronisasi dengan jenis 'create'.`);
        }
      } else {
        // Perbarui logika update untuk juga mengecek id_kelas_kuliah
        const isUpdated =
          localDosenPengajar.sks_substansi_total !== feederDosenPengajar.sks_substansi_total ||
          localDosenPengajar.rencana_minggu_pertemuan !== feederDosenPengajar.rencana_minggu_pertemuan ||
          localDosenPengajar.realisasi_minggu_pertemuan !== feederDosenPengajar.realisasi_minggu_pertemuan ||
          localDosenPengajar.id_registrasi_dosen !== feederDosenPengajar.id_registrasi_dosen ||
          localDosenPengajar.id_dosen !== feederDosenPengajar.id_dosen ||
          feederKelasKuliahId !== feederDosenPengajar.id_kelas_kuliah ||
          localDosenPengajar.id_substansi !== feederDosenPengajar.id_substansi ||
          localDosenPengajar.id_jenis_evaluasi !== feederDosenPengajar.id_jenis_evaluasi ||
          localDosenPengajar.id_prodi !== feederDosenPengajar.id_prodi ||
          localDosenPengajar.id_semester !== feederDosenPengajar.id_semester;

        if (isUpdated) {
          const existingSync = await DosenPengajarKelasKuliahSync.findOne({
            where: {
              id_aktivitas_mengajar: localDosenPengajar.id_aktivitas_mengajar,
            },
          });

          if (!existingSync) {
            await DosenPengajarKelasKuliahSync.create({
              jenis_singkron: "update",
              status: false,
              id_feeder: localDosenPengajar.id_feeder,
              id_aktivitas_mengajar: localDosenPengajar.id_aktivitas_mengajar,
            });
            console.log(`Data dosen pengajar kelas kuliah ${localDosenPengajar.id_aktivitas_mengajar} ditambahkan ke sinkronisasi dengan jenis 'update'.`);
          }
        }
      }
    }

    // mengecek jikalau data dosen pengajar kelas kuliah tidak ada di local namun ada di feeder, maka data dosen pengajar kelas kuliah di feeder akan tercatat sebagai delete
    for (let feederDosenPengajarId in dosenPengajarKelasKuliahFeederMap) {
      const feederDosenPengajar = dosenPengajarKelasKuliahFeederMap[feederDosenPengajarId];

      // Jika data Feeder tidak ada di Lokal, tambahkan dengan jenis "delete"
      const localDosenPengajar = dosenPengajarKelasKuliahLocal.find((dosen_pengajar) => dosen_pengajar.id_feeder === feederDosenPengajarId);

      if (!localDosenPengajar) {
        const existingSync = await DosenPengajarKelasKuliahSync.findOne({
          where: {
            id_feeder: feederDosenPengajar.id_aktivitas_mengajar,
          },
        });

        if (!existingSync) {
          await DosenPengajarKelasKuliahSync.create({
            jenis_singkron: "delete",
            status: false,
            id_feeder: feederDosenPengajar.id_aktivitas_mengajar,
            id_aktivitas_mengajar: null,
          });
          console.log(`Data dosen pengajar kelas kuliah ${feederDosenPengajar.id_aktivitas_mengajar} ditambahkan ke sinkronisasi dengan jenis 'delete'.`);
        }
      }
    }

    console.log("Sinkronisasi dosen pengajar kelas kuliah selesai.");
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
      return res.status(404).json({ message: "Kelas kuliah belum dilakukan singkron ke feeder" });
    }

    // Mendapatkan token
    const token = await getToken();

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
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

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
      },
    });

    if (!dosen_pengajar_kelas_kuliah_sync) {
      return res.status(404).json({ message: "Dosen Pengajar Kelas kuliah sync not found" });
    }

    dosen_pengajar_kelas_kuliah_sync.status = true;
    await dosen_pengajar_kelas_kuliah_sync.save();

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Insert Dosen Pengajar Kelas Kuliah from local to feeder Success",
    });
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
      return res.status(404).json({ message: "Kelas kuliah belum dilakukan singkron ke feeder" });
    }

    // Mendapatkan token
    const token = await getToken();

    // akan update data dosen pengajar kelas kuliah ke feeder
    const requestBody = {
      act: "UpdateDosenPengajarKelasKuliah",
      token: `${token}`,
      key: `id_aktivitas_mengajar='${dosen_pengajar_kelas_kuliah.id_feeder}'`,
      record: {
        id_registrasi_dosen: dosen_pengajar_kelas_kuliah.id_registrasi_dosen,
        id_kelas_kuliah: kelas_kuliah.id_feeder,
        sks_substansi_total: dosen_pengajar_kelas_kuliah.sks_substansi_total,
        rencana_minggu_pertemuan: dosen_pengajar_kelas_kuliah.rencana_minggu_pertemuan,
        id_jenis_evaluasi: dosen_pengajar_kelas_kuliah.id_jenis_evaluasi,
      },
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // update status pada dosen_pengajar_kelas_kuliah_sync local
    let dosen_pengajar_kelas_kuliah_sync = await DosenPengajarKelasKuliahSync.findOne({
      where: {
        id_aktivitas_mengajar: id_aktivitas_mengajar,
      },
    });

    if (!dosen_pengajar_kelas_kuliah_sync) {
      return res.status(404).json({ message: "Dosen Pengajar Kelas kuliah sync not found" });
    }

    dosen_pengajar_kelas_kuliah_sync.status = true;
    await dosen_pengajar_kelas_kuliah_sync.save();

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Update Dosen Pengaar Kelas Kuliah from local to feeder Success",
    });
  } catch (error) {
    next(error);
  }
};

const deleteDosenPengajarKelasKuliah = async (id_feeder, req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    // akan delete data dosen pengajar kelas kuliah ke feeder
    const requestBody = {
      act: "DeleteDosenPengajarKelasKuliah",
      token: `${token}`,
      key: `id_aktivitas_mengajar='${id_feeder}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // update status pada dosen_pengajar_kelas_kuliah_sync local
    let dosen_pengajar_kelas_kuliah_sync = await DosenPengajarKelasKuliahSync.findOne({
      where: {
        id_feeder: id_feeder,
      },
    });

    if (!dosen_pengajar_kelas_kuliah_sync) {
      return res.status(404).json({ message: "Dosen Pengajar Kelas kuliah sync not found" });
    }

    dosen_pengajar_kelas_kuliah_sync.status = true;
    await dosen_pengajar_kelas_kuliah_sync.save();

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Delete Dosen Pengajar Kelas Kuliah feeder Success",
    });
  } catch (error) {
    next(error);
  }
};

const syncDosenPengajarKelasKuliahs = async (req, res, next) => {
  try {
    const { dosen_pengajar_kelas_kuliah_syncs } = req.body;

    // perulangan untuk aksi data dosen pengajar kelas kuliah berdasarkan jenis singkron
    for (const dosen_pengajar_kelas_kuliah_sync of dosen_pengajar_kelas_kuliah_syncs) {
      let { id_aktivitas_mengajar } = dosen_pengajar_kelas_kuliah_sync.id_aktivitas_mengajar;
      let { id_feeder } = dosen_pengajar_kelas_kuliah_sync.id_feeder;

      if (dosen_pengajar_kelas_kuliah_sync.status === false) {
        if (dosen_pengajar_kelas_kuliah_sync.jenis_singkron === "create") {
          await insertDosenPengajarKelasKuliah(id_aktivitas_mengajar, req, res, next);
        } else if (dosen_pengajar_kelas_kuliah_sync.jenis_singkron === "update") {
          await updateDosenPengajarKelasKuliah(id_aktivitas_mengajar, req, res, next);
        } else if (dosen_pengajar_kelas_kuliah_sync.jenis_singkron === "delete") {
          await deleteDosenPengajarKelasKuliah(id_feeder, req, res, next);
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  matchingSyncDataDosenPengajarKelasKuliah,
  syncDosenPengajarKelasKuliahs,
};
