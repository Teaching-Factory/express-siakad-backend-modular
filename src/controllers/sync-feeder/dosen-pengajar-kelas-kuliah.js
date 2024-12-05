const { KelasKuliah, PenugasanDosen, DosenPengajarKelasKuliah, Dosen, DosenPengajarKelasKuliahSync } = require("../../../models");
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
          feederKelasKuliahId !== feederDosenPengajar.id_kelas_kuliah || // menambahkan pengecekan id_kelas_kuliah
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

module.exports = {
  matchingSyncDataDosenPengajarKelasKuliah,
};
