const { RencanaEvaluasi, RencanaEvaluasiSync, MataKuliah } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

async function getRencanaEvaluasiFromFeeder(prodiId, req, res, next) {
  try {
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }

    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetListRencanaEvaluasi",
      token: token,
      filter: `id_prodi='${prodiId}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

async function getRencanaEvaluasiFromLocal(prodiId, req, res, next) {
  try {
    return await RencanaEvaluasi.findAll({
      include: [
        {
          model: MataKuliah,
          where: {
            id_prodi: prodiId,
          },
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi pembanding nilai
function areEqual(value1, value2) {
  return value1 === value2 || (value1 == null && value2 == null);
}

async function matchingDataRencanaEvaluasi(req, res, next) {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;

    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }

    // get rencana evaluasi local dan feeder
    const rencanaEvaluasiFeeder = await getRencanaEvaluasiFromFeeder(prodiId);
    const rencanaEvaluasiLocal = await getRencanaEvaluasiFromLocal(prodiId);

    // rencana evaluasi feeder
    const rencanaEvaluasiFeederMap = rencanaEvaluasiFeeder.reduce((map, rencana_evaluasi) => {
      map[rencana_evaluasi.id_rencana_evaluasi] = rencana_evaluasi;
      return map;
    }, {});

    // Loop untuk proses sinkronisasi
    for (let localRencanaEvaluasi of rencanaEvaluasiLocal) {
      const feederRencanaEvaluasi = rencanaEvaluasiFeederMap[localRencanaEvaluasi.id_feeder];
      const existingSync = await RencanaEvaluasiSync.findOne({
        where: {
          id_rencana_evaluasi: localRencanaEvaluasi.id_rencana_evaluasi,
          jenis_singkron: feederRencanaEvaluasi ? "update" : "create",
          status: false,
          id_feeder: feederRencanaEvaluasi ? localRencanaEvaluasi.id_feeder : null,
        },
      });

      if (existingSync) {
        console.log(`Data rencana evaluasi ${localRencanaEvaluasi.id_rencana_evaluasi} sudah disinkronisasi.`);
        continue;
      }

      if (!feederRencanaEvaluasi) {
        // Proses create
        await RencanaEvaluasiSync.create({
          jenis_singkron: "create",
          status: false,
          id_feeder: null,
          id_rencana_evaluasi: localRencanaEvaluasi.id_rencana_evaluasi,
        });
        console.log(`Data rencana evaluasi ${localRencanaEvaluasi.id_rencana_evaluasi} ditambahkan ke sinkronisasi dengan jenis 'create'.`);
      } else {
        const isUpdated = compareRencanaEvaluasi(localRencanaEvaluasi, feederRencanaEvaluasi);

        if (isUpdated) {
          await RencanaEvaluasiSync.create({
            jenis_singkron: "update",
            status: false,
            id_feeder: localRencanaEvaluasi.id_feeder,
            id_rencana_evaluasi: localRencanaEvaluasi.id_rencana_evaluasi,
          });
          console.log(`Data rencana evaluasi ${localRencanaEvaluasi.id_rencana_evaluasi} ditambahkan ke sinkronisasi dengan jenis 'update'.`);
        }
      }
    }

    // Fungsi pembanding data local dengan feeder
    function compareRencanaEvaluasi(localRencanaEvaluasi, feederRencanaEvaluasi) {
      return (
        localRencanaEvaluasi.id_matkul !== feederRencanaEvaluasi.id_matkul ||
        localRencanaEvaluasi.id_jenis_evaluasi !== feederRencanaEvaluasi.id_jenis_evaluasi ||
        // !areEqual(localRencanaEvaluasi.nama_evaluasi, feederRencanaEvaluasi.nama_evaluasi) ||
        localRencanaEvaluasi.deskripsi_indonesia !== feederRencanaEvaluasi.deskripsi_indonesia ||
        !areEqual(localRencanaEvaluasi.deskripsi_inggris, feederRencanaEvaluasi.deskripsi_inggris) ||
        !areEqual(localRencanaEvaluasi.nomor_urut, feederRencanaEvaluasi.nomor_urut) ||
        !areEqual(localRencanaEvaluasi.bobot_evaluasi, feederRencanaEvaluasi.bobot_evaluasi)
      );
    }

    // mengecek jikalau data rencana evaluasi tidak ada di local namun ada di feeder, maka data rencana evaluasi di feeder akan tercatat sebagai get
    for (let feederRencanaEvaluasiId in rencanaEvaluasiFeederMap) {
      const feederRencanaEvaluasi = rencanaEvaluasiFeederMap[feederRencanaEvaluasiId];

      // Jika data Feeder tidak ada di Lokal, tambahkan dengan jenis "get"
      const localRencanaEvaluasi = rencanaEvaluasiLocal.find((rencana_evaluasi) => rencana_evaluasi.id_feeder === feederRencanaEvaluasiId);

      if (!localRencanaEvaluasi) {
        const existingSync = await RencanaEvaluasiSync.findOne({
          where: {
            id_feeder: feederRencanaEvaluasi.id_rencana_evaluasi,
            jenis_singkron: "get",
            status: false,
            id_rencana_evaluasi: null,
          },
        });

        if (!existingSync) {
          await RencanaEvaluasiSync.create({
            jenis_singkron: "get",
            status: false,
            id_feeder: feederRencanaEvaluasi.id_rencana_evaluasi,
            id_rencana_evaluasi: null,
          });
          console.log(`Data rencana evaluasi ${feederRencanaEvaluasi.id_rencana_evaluasi} ditambahkan ke sinkronisasi dengan jenis 'get'.`);
        }
      }
    }

    console.log("Matching rencana evaluasi lokal ke feeder berhasil.");
  } catch (error) {
    console.error("Error during matchingDataRencanaEvaluasi:", error.message);
    throw error;
  }
}

const matchingSyncDataRencanaEvaluasi = async (req, res, next) => {
  try {
    await matchingDataRencanaEvaluasi(req, res, next);
    res.status(200).json({ message: "Matching rencana evaluasi lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

// fungsi singkron rencana evaluasi
const insertRencanaEvaluasi = async (id_rencana_evaluasi, req, res, next) => {
  try {
    // get data rencana evaluasi from local
    let rencana_evaluasi = await RencanaEvaluasi.findByPk(id_rencana_evaluasi);

    if (!rencana_evaluasi) {
      return res.status(404).json({ message: "Rencana Evaluasi not found" });
    }

    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // akan insert data rencana evaluasi dan detail rencana evaluasi ke feeder
    const requestBody = {
      act: "InsertRencanaEvaluasi",
      token: `${token}`,
      record: {
        id_matkul: rencana_evaluasi.id_matkul,
        id_jenis_evaluasi: rencana_evaluasi.id_jenis_evaluasi,
        nama_evaluasi: rencana_evaluasi.nama_evaluasi,
        deskripsi_indonesia: rencana_evaluasi.deskripsi_indonesia,
        deskripsi_inggris: rencana_evaluasi.deskripsi_inggris,
        nomor_urut: rencana_evaluasi.nomor_urut,
        bobot_evaluasi: rencana_evaluasi.bobot_evaluasi,
      },
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // Mendapatkan id_rencana_evaluasi dari response feeder
    const idRencanaEvaluasi = response.data.data.id_rencana_evaluasi;

    // update id_feeder dan last sync pada rencana evaluasi local
    rencana_evaluasi.id_feeder = idRencanaEvaluasi;
    rencana_evaluasi.last_sync = new Date();
    await rencana_evaluasi.save();

    // update status pada rencana_evaluasi_sync local
    let rencana_evaluasi_sync = await RencanaEvaluasiSync.findOne({
      where: {
        id_rencana_evaluasi: id_rencana_evaluasi,
        status: false,
        jenis_singkron: "create",
        id_feeder: null,
      },
    });

    if (!rencana_evaluasi_sync) {
      return res.status(404).json({ message: "Rencana evaluasi sync not found" });
    }

    rencana_evaluasi_sync.status = true;
    await rencana_evaluasi_sync.save();

    // result
    console.log(`Successfully inserted rencana evaluasi with ID ${rencana_evaluasi_sync.id_rencana_evaluasi} to feeder`);
  } catch (error) {
    next(error);
  }
};

const updateRencanaEvaluasi = async (id_rencana_evaluasi, req, res, next) => {
  try {
    // get data rencana evaluasi from local
    let rencana_evaluasi = await RencanaEvaluasi.findByPk(id_rencana_evaluasi);

    if (!rencana_evaluasi) {
      return res.status(404).json({ message: "Rencana evaluasi not found" });
    }

    if (rencana_evaluasi.id_feeder == null || rencana_evaluasi.id_feeder == "") {
      return res.status(404).json({ message: `Rencana evaluasi dengan ID ${rencana_evaluasi.id_rencana_evaluasi} belum dilakukan singkron ke feeder` });
    }

    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // akan update data rencana evaluasi ke feeder
    const requestBody = {
      act: "UpdateRencanaEvaluasi",
      token: `${token}`,
      key: {
        id_rencana_evaluasi: rencana_evaluasi.id_feeder,
      },
      record: {
        id_matkul: rencana_evaluasi.id_matkul,
        id_jenis_evaluasi: rencana_evaluasi.id_jenis_evaluasi,
        nama_evaluasi: rencana_evaluasi.nama_evaluasi,
        deskripsi_indonesia: rencana_evaluasi.deskripsi_indonesia,
        deskripsi_inggris: rencana_evaluasi.deskripsi_inggris,
        nomor_urut: rencana_evaluasi.nomor_urut,
        bobot_evaluasi: rencana_evaluasi.bobot_evaluasi,
      },
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // update status pada rencana_evaluasi_sync local
    let rencana_evaluasi_sync = await RencanaEvaluasiSync.findOne({
      where: {
        id_rencana_evaluasi: id_rencana_evaluasi,
        status: false,
        jenis_singkron: "update",
        id_feeder: rencana_evaluasi.id_feeder,
      },
    });

    if (!rencana_evaluasi_sync) {
      return res.status(404).json({ message: "Rencana evaluasi sync not found" });
    }

    rencana_evaluasi_sync.status = true;
    await rencana_evaluasi_sync.save();

    // update last sync pada rencana evaluasi
    rencana_evaluasi.last_sync = new Date();
    await rencana_evaluasi.save();

    // result
    console.log(`Successfully updated rencana evaluasi with ID Feeder ${rencana_evaluasi_sync.id_feeder} to feeder`);
  } catch (error) {
    next(error);
  }
};

// dinonaktifkan
// const deleteRencanaEvaluasi = async (id_feeder, req, res, next) => {
//   try {
//     // Mendapatkan token
//     const { token, url_feeder } = await getToken();

//     // akan delete data rencana evaluasi ke feeder
//     const requestBody = {
//       act: "DeleteRencanaEvaluasi",
//       token: `${token}`,
//       key: {
//         id_rencana_evaluasi: id_feeder,
//       },
//     };

//     // Menggunakan token untuk mengambil data
//     const response = await axios.post(url_feeder, requestBody);

//     // Mengecek jika ada error pada respons dari server
//     if (response.data.error_code !== 0) {
//       throw new Error(`Error from Feeder: ${response.data.error_desc}`);
//     }

//     // update status pada rencana_evaluasi_sync local
//     let rencana_evaluasi_sync = await RencanaEvaluasiSync.findOne({
//       where: {
//         id_feeder: id_feeder,
//         status: false,
//         jenis_singkron: "delete",
//         id_rencana_evaluasi: null,
//       },
//     });

//     if (!rencana_evaluasi_sync) {
//       return res.status(404).json({ message: "Rencana evaluasi sync not found" });
//     }

//     rencana_evaluasi_sync.status = true;
//     await rencana_evaluasi_sync.save();

//     // result
//     console.log(`Successfully deleted rencana evaluasi with ID Feeder ${rencana_evaluasi_sync.id_feeder} to feeder`);
//   } catch (error) {
//     next(error);
//   }
// };

const syncRencanaEvaluasis = async (req, res, next) => {
  try {
    const { rencana_evaluasi_syncs } = req.body;

    // Validasi input
    if (!rencana_evaluasi_syncs || !Array.isArray(rencana_evaluasi_syncs)) {
      return res.status(400).json({ message: "Request body tidak valid" });
    }

    // perulangan untuk aksi data rencana evaluasi berdasarkan jenis singkron
    for (const rencana_evaluasi_sync of rencana_evaluasi_syncs) {
      // get data rencana evaluasi sync
      const data_rencana_evaluasi_sync = await RencanaEvaluasiSync.findByPk(rencana_evaluasi_sync.id);

      if (!data_rencana_evaluasi_sync) {
        return res.status(404).json({ message: "Data Rencana evaluasi sync not found" });
      }

      if (data_rencana_evaluasi_sync.status === false) {
        if (data_rencana_evaluasi_sync.jenis_singkron === "create") {
          await insertRencanaEvaluasi(data_rencana_evaluasi_sync.id_rencana_evaluasi, req, res, next);
        } else if (data_rencana_evaluasi_sync.jenis_singkron === "update") {
          await updateRencanaEvaluasi(data_rencana_evaluasi_sync.id_rencana_evaluasi, req, res, next);
        }
        // dinonaktifkan
        // else if (data_rencana_evaluasi_sync.jenis_singkron === "delete") {
        //   await deleteRencanaEvaluasi(data_rencana_evaluasi_sync.id_feeder, req, res, next);
        // }
      } else {
        console.log(`Data Rencana Evaluasi Sync dengan ID ${data_rencana_evaluasi_sync.id} tidak valid untuk dilakukan singkron`);
      }
    }

    // return
    res.status(200).json({ message: "Singkron rencana evaluasi lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  matchingDataRencanaEvaluasi,
  matchingSyncDataRencanaEvaluasi,
  syncRencanaEvaluasis,
};
