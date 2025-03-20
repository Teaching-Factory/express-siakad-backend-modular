const { Prodi, RencanaEvaluasiSync } = require("../../../models");
const { matchingDataRencanaEvaluasi, syncRencanaEvaluasis } = require("../../controllers/sync-feeder/rencana-evaluasi-sync");
const { Op } = require("sequelize");

async function singkronRencanaEvaluasi() {
  console.log("Cronjob singkron rencana evaluasi started");

  try {
    // get data seluruh prodi
    const prodis = await Prodi.findAll();

    for (const data_prodi of prodis) {
      // Buat objek request palsu untuk pemanggilan internal tanpa API
      const fakeReq = {
        params: {
          id_prodi: data_prodi.id_prodi,
        },
      };

      // Objek response kosong agar tidak mempengaruhi output
      const fakeRes = {
        status: () => ({
          json: () => {},
        }),
      };

      await matchingDataRencanaEvaluasi(fakeReq, fakeRes, () => {});

      // get data rencana evaluasi sync yang belum di singkron dengan jenis singkron create dan delete
      const rencana_evaluasi_syncs = await RencanaEvaluasiSync.findAll({
        where: {
          jenis_singkron: {
            [Op.in]: ["create", "get"], // Memfilter hanya "create" dan "get"
          },
          status: false,
        },
        attributes: ["id"],
      });

      if (rencana_evaluasi_syncs.length === 0) {
        console.log("Tidak ada data rencana evaluasi yang perlu disinkron.");
        return;
      }

      // **Format request body sesuai dengan kebutuhan API**
      const formattedData = { rencana_evaluasi_syncs: rencana_evaluasi_syncs.map((rencana_evaluasi) => ({ id: rencana_evaluasi.id })) };

      // Buat objek request palsu untuk `syncRencanaEvaluasis`
      const fakeSyncReq = {
        body: formattedData,
      };

      // Simulasi response kosong agar tidak mempengaruhi output
      const fakeSyncRes = {
        status: () => ({
          json: () => {},
        }),
      };

      // Panggil fungsi `syncRencanaEvaluasis`
      await syncRencanaEvaluasis(fakeSyncReq, fakeSyncRes, (error) => {
        if (error) {
          console.error("Error during syncRencanaEvaluasis:", error.message);
        }
      });
    }

    console.log("Cronjob singkron rencana evaluasi finished");
  } catch (error) {
    console.error("Error saat cronjob singkron rencana evaluasi dijalankan:", error.message);
  }
}

module.exports = singkronRencanaEvaluasi;
