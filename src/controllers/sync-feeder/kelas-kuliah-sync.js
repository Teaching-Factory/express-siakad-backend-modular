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

    // Perbandingan lokal ke feeder (create)
    for (let localKelas of kelasLocal) {
      const feederKelas = kelasKuliahFeederMap[localKelas.id_feeder];

      // Jika data lokal tidak ada di Feeder, maka tambahkan dengan jenis "create"
      if (!feederKelas) {
        const existingSync = await KelasKuliahSync.findOne({
          where: {
            id_kelas_kuliah: localKelas.id_kelas_kuliah,
          },
        });

        if (!existingSync) {
          await KelasKuliahSync.create({
            jenis_singkron: "create",
            status: false,
            id_feeder: null,
            id_kelas_kuliah: localKelas.id_kelas_kuliah,
          });
          console.log(`Data kelas kuliah ${localKelas.id_kelas_kuliah} ditambahkan ke sinkronisasi dengan jenis 'create'.`);
        }
      } else {
        // get data detail kelas kuliah from local
        let detail_kelas_kuliah_from_local = await DetailKelasKuliah.findOne({
          where: {
            id_kelas_kuliah: localKelas.id_kelas_kuliah,
          },
        });

        if (!detail_kelas_kuliah_from_local) {
          return res.status(404).json({ message: "Detail Kelas kuliah from local not found" });
        }

        // get data detail kelas kuliah from feeder
        const detail_kelas_kuliah_from_feeder = await getDetailKelasKuliahFromFeeder(localKelas.id_feeder);

        if (!detail_kelas_kuliah_from_feeder) {
          return res.status(404).json({ message: "Detail Kelas kuliah from feeder not found" });
        }

        // Jika data ada di Feeder, cek apakah ada perubahan (update)
        const isUpdated =
          localKelas.id_prodi !== feederKelas.id_prodi ||
          localKelas.id_semester !== feederKelas.id_semester ||
          localKelas.id_matkul !== feederKelas.id_matkul ||
          localKelas.nama_kelas_kuliah !== feederKelas.nama_kelas_kuliah ||
          localKelas.sks !== feederKelas.sks ||
          detail_kelas_kuliah_from_local.bahasan !== detail_kelas_kuliah_from_feeder.bahasan ||
          localKelas.jumlah_mahasiswa !== feederKelas.jumlah_mahasiswa ||
          detail_kelas_kuliah_from_local.kapasitas !== detail_kelas_kuliah_from_feeder.kapasitas ||
          detail_kelas_kuliah_from_local.tanggal_mulai_efektif !== detail_kelas_kuliah_from_feeder.tanggal_mulai_efektif ||
          detail_kelas_kuliah_from_local.tanggal_akhir_efektif !== detail_kelas_kuliah_from_feeder.tanggal_akhir_efektif ||
          localKelas.lingkup !== feederKelas.lingkup ||
          localKelas.mode !== feederKelas.mode ||
          localKelas.apa_untuk_pditt !== feederKelas.apa_untuk_pditt ||
          localKelas.id_dosen !== feederKelas.id_dosen;

        if (isUpdated) {
          const existingSync = await KelasKuliahSync.findOne({
            where: {
              id_kelas_kuliah: localKelas.id_kelas_kuliah,
            },
          });

          if (!existingSync) {
            await KelasKuliahSync.create({
              jenis_singkron: "update",
              status: false,
              id_feeder: localKelas.id_feeder,
              id_kelas_kuliah: localKelas.id_kelas_kuliah,
            });
            console.log(`Data kelas kuliah ${localKelas.id_kelas_kuliah} ditambahkan ke sinkronisasi dengan jenis 'update'.`);
          }
        }
      }
    }

    // mengecek jikalau data kelas kuliah tidak ada di local namun ada di feeder, maka data kelas kuliah di feeder akan tercatat sebagai delete
    for (let feederKelasId in kelasKuliahFeederMap) {
      const feederKelas = kelasKuliahFeederMap[feederKelasId];

      // Jika data Feeder tidak ada di Lokal, tambahkan dengan jenis "delete"
      const localKelas = kelasLocal.find((kelas) => kelas.id_feeder === feederKelasId);

      if (!localKelas) {
        const existingSync = await KelasKuliahSync.findOne({
          where: {
            id_feeder: feederKelas.id_kelas_kuliah,
          },
        });

        if (!existingSync) {
          await KelasKuliahSync.create({
            jenis_singkron: "delete",
            status: false,
            id_feeder: feederKelas.id_kelas_kuliah,
            id_kelas_kuliah: null,
          });
          console.log(`Data kelas kuliah ${feederKelas.id_kelas_kuliah} ditambahkan ke sinkronisasi dengan jenis 'delete'.`);
        }
      }
    }

    console.log("Sinkronisasi kelas kuliah selesai.");
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
    const token = await getToken();

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
        bahasan: null,
        kapasitas: kelas_kuliah.jumlah_mahasiswa,
        tanggal_mulai_efektif: detail_kelas_kuliah.tanggal_mulai_efektif,
        tanggal_akhir_efektif: detail_kelas_kuliah.tanggal_akhir_efektif,
        lingkup: kelas_kuliah.lingkup,
        mode: kelas_kuliah.mode,
        apa_untuk_pditt: 0,
        a_selenggara_pditt: 1,
        id_mou: null,
      },
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

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
      },
    });

    if (!kelas_kuliah_sync) {
      return res.status(404).json({ message: "Kelas kuliah sync not found" });
    }

    kelas_kuliah_sync.status = true;
    await kelas_kuliah_sync.save();

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Insert Kelas Kuliah from local to feeder Success",
    });
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
    const token = await getToken();

    // akan update data kelas kuliah dan detail kelas kuliah ke feeder
    const requestBody = {
      act: "UpdateKelasKuliah",
      token: `${token}`,
      key: `id_kelas_kuliah='${kelas_kuliah.id_feeder}'`,
      record: {
        id_prodi: kelas_kuliah.id_prodi,
        id_semester: kelas_kuliah.id_semester,
        id_matkul: kelas_kuliah.id_matkul,
        nama_kelas_kuliah: kelas_kuliah.nama_kelas_kuliah,
        sks: kelas_kuliah.sks,
        bahasan: detail_kelas_kuliah.bahasan,
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
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // update status pada kelas_kuliah_sync local
    let kelas_kuliah_sync = await KelasKuliahSync.findOne({
      where: {
        id_kelas_kuliah: id_kelas_kuliah,
      },
    });

    if (!kelas_kuliah_sync) {
      return res.status(404).json({ message: "Kelas kuliah sync not found" });
    }

    kelas_kuliah_sync.status = true;
    await kelas_kuliah_sync.save();

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Update Kelas Kuliah from local to feeder Success",
    });
  } catch (error) {
    next(error);
  }
};

const deleteKelasKuliah = async (id_feeder, req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    // akan delete data kelas kuliah dan detail kelas kuliah ke feeder
    const requestBody = {
      act: "DeleteKelasKuliah",
      token: `${token}`,
      key: `id_kelas_kuliah='${id_feeder}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // update status pada kelas_kuliah_sync local
    let kelas_kuliah_sync = await KelasKuliahSync.findOne({
      where: {
        id_feeder: id_feeder,
      },
    });

    if (!kelas_kuliah_sync) {
      return res.status(404).json({ message: "Kelas kuliah sync not found" });
    }

    kelas_kuliah_sync.status = true;
    await kelas_kuliah_sync.save();

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Delete Kelas Kuliah feeder Success",
    });
  } catch (error) {
    next(error);
  }
};

const syncKelasKuliahs = async (req, res, next) => {
  try {
    const { kelas_kuliah_syncs } = req.body;

    // perulangan untuk aksi data kelas kuliah berdasarkan jenis singkron
    for (const kelas_kuliah_sync of kelas_kuliah_syncs) {
      let { id_kelas_kuliah } = kelas_kuliah_sync.id_kelas_kuliah;
      let { id_feeder } = kelas_kuliah_sync.id_feeder;

      if (kelas_kuliah_sync.status === false) {
        if (kelas_kuliah_sync.jenis_singkron === "create") {
          await insertKelasKuliah(id_kelas_kuliah, req, res, next);
        } else if (kelas_kuliah_sync.jenis_singkron === "update") {
          await updateKelasKuliah(id_kelas_kuliah, req, res, next);
        } else if (kelas_kuliah_sync.jenis_singkron === "delete") {
          await deleteKelasKuliah(id_feeder, req, res, next);
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  matchingSyncDataKelasKuliah,
  syncKelasKuliahs,
};
