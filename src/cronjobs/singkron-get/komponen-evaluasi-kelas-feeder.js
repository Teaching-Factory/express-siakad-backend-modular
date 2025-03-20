const { SettingGlobalSemester, KomponenEvaluasiKelasSync } = require("../../../models");
const { matchingDataKomponenEvaluasiKelas, syncKomponenEvaluasiKelas } = require("../../controllers/sync-feeder/komponen-evaluasi-kelas-sync");
const { Op } = require("sequelize");

async function singkronKomponenEvaluasiKelas() {
  console.log("Cronjob singkron komponen evaluasi kelas started");

  try {
    // get data setting global semester yang status nya aktif
    const setting_global_semester_aktif = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    if (!setting_global_semester_aktif) {
      console.error("Error: Setting Global Semester Aktif tidak ditemukan.");
      return;
    }

    // Buat objek request palsu untuk pemanggilan internal tanpa API
    const fakeReq = {
      params: {
        id_semester: setting_global_semester_aktif.id_semester_aktif,
      },
    };

    // Objek response kosong agar tidak mempengaruhi output
    const fakeRes = {
      status: () => ({
        json: () => {},
      }),
    };

    await matchingDataKomponenEvaluasiKelas(fakeReq, fakeRes, () => {});

    // get data komponen evaluasi kelas sync yang belum di singkron dengan jenis singkron create dan delete
    const komponen_evaluasi_kelas_syncs = await KomponenEvaluasiKelasSync.findAll({
      where: {
        jenis_singkron: {
          [Op.in]: ["create", "get"], // Memfilter hanya "create" dan "get"
        },
        status: false,
      },
      attributes: ["id"],
    });

    if (komponen_evaluasi_kelas_syncs.length === 0) {
      console.log("Tidak ada data komponen evaluasi kelas yang perlu disinkron.");
      return;
    }

    // **Format request body sesuai dengan kebutuhan API**
    const formattedData = { komponen_evaluasi_kelas_syncs: komponen_evaluasi_kelas_syncs.map((komponen_eval_kelas) => ({ id: komponen_eval_kelas.id })) };

    // Buat objek request palsu untuk `syncKomponenEvaluasiKelas`
    const fakeSyncReq = {
      body: formattedData,
    };

    // Simulasi response kosong agar tidak mempengaruhi output
    const fakeSyncRes = {
      status: () => ({
        json: () => {},
      }),
    };

    // Panggil fungsi `syncKomponenEvaluasiKelas`
    await syncKomponenEvaluasiKelas(fakeSyncReq, fakeSyncRes, (error) => {
      if (error) {
        console.error("Error during syncKomponenEvaluasiKelas:", error.message);
      }
    });

    console.log("Cronjob singkron komponen evaluasi kelas finished");
  } catch (error) {
    console.error("Error saat cronjob singkron komponen evaluasi kelas dijalankan:", error.message);
  }
}

module.exports = singkronKomponenEvaluasiKelas;
