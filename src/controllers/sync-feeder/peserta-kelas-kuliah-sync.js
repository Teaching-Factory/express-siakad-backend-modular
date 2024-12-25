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
    });

    return pesertaKelasKuliah;
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi pembanding nilai
function areEqual(value1, value2) {
  return value1 === value2 || (value1 == null && value2 == null);
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
      } else {
        // melakukan perbandingan data peserta kelas kuliah
        const isUpdated = comparePesertaKelasKuliah(localPesertaKelasKuliah, feederPesertaKelasKuliah, kelas_kuliah, riwayat_pendidikan_mahasiswa);

        if (isUpdated) {
          await PesertaKelasKuliahSync.create({
            jenis_singkron: "update",
            status: false,
            id_kelas_kuliah_feeder: null,
            id_registrasi_mahasiswa_feeder: null,
            id_peserta_kuliah: localPesertaKelasKuliah.id_peserta_kuliah,
          });
          console.log(`Data peserta kelas kuliah ${localPesertaKelasKuliah.id_peserta_kuliah} ditambahkan ke sinkronisasi dengan jenis 'update'.`);
        }
      }
    }

    // Fungsi pembanding data peserta kelas kuliah
    function comparePesertaKelasKuliah(localPesertaKelasKuliah, feederPesertaKelasKuliah, kelasKuliahLocal, riwayatPendidikanMahasiswaLocal) {
      return (
        !areEqual(localPesertaKelasKuliah.angkatan, feederPesertaKelasKuliah.angkatan) ||
        !areEqual(kelasKuliahLocal.id_feeder, feederPesertaKelasKuliah.id_kelas_kuliah) ||
        !areEqual(riwayatPendidikanMahasiswaLocal.id_feeder, feederPesertaKelasKuliah.id_registrasi_mahasiswa)
      );
    }

    // res.status(200).json({
    //   message: `Success:`,
    //   uniqueKeyLocal: uniqueKey,
    //   uniqueKeyFeeder: pesertaKelasKuliahFeederMap[uniqueKey],
    // });

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
            jenis_singkron: "delete",
            status: false,
            id_peserta_kuliah: null,
          },
        });

        // Jika tidak ada sinkronisasi yang sama, simpan dalam array syncData
        if (!existingSync) {
          syncData.push({
            id_kelas_kuliah_feeder: feederPesertaKelasKuliah.id_kelas_kuliah,
            id_registrasi_mahasiswa_feeder: feederPesertaKelasKuliah.id_registrasi_mahasiswa,
            jenis_singkron: "delete",
            status: false,
            id_peserta_kuliah: null,
          });
          console.log(`Data peserta kelas kuliah dengan Kelas ID ${feederPesertaKelasKuliah.id_kelas_kuliah} dan Mahasiswa ID ${feederPesertaKelasKuliah.id_registrasi_mahasiswa} ditambahkan ke sinkronisasi dengan jenis 'delete'.`);
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

module.exports = {
  matchingSyncDataPesertaKelasKuliah,
};
