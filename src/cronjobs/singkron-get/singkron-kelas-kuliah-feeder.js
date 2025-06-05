const { SettingGlobalSemester, KelasKuliahSync } = require("../../../models");
const { matchingDataKelasKuliah, syncKelasKuliahs } = require("../../modules/sync-feeder/data-feeder/kelas-kuliah-sync");
const { Op } = require("sequelize");

async function singkronKelasKuliah() {
  console.log("Cronjob singkron kelas kuliah started");

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
        id_semester: setting_global_semester_aktif.id_semester_krs,
      },
    };

    // Objek response kosong agar tidak mempengaruhi output
    const fakeRes = {
      status: () => ({
        json: () => {},
      }),
    };

    await matchingDataKelasKuliah(fakeReq, fakeRes, () => {});

    // get data kelas kuliah sync yang belum di singkron dengan jenis singkron create dan delete
    const kelas_kuliah_syncs = await KelasKuliahSync.findAll({
      where: {
        jenis_singkron: {
          [Op.in]: ["create", "get", "update"], // Memfilter hanya "create", "get" dan "update"
        },
        status: false,
      },
      attributes: ["id"],
    });

    if (kelas_kuliah_syncs.length === 0) {
      console.log("Tidak ada data kelas kuliah yang perlu disinkron.");
      return;
    }

    // **Format request body sesuai dengan kebutuhan API**
    const formattedData = { kelas_kuliah_syncs: kelas_kuliah_syncs.map((kelas) => ({ id: kelas.id })) };

    // Buat objek request palsu untuk `syncKelasKuliahs`
    const fakeSyncReq = {
      body: formattedData,
    };

    // Simulasi response kosong agar tidak mempengaruhi output
    const fakeSyncRes = {
      status: () => ({
        json: () => {},
      }),
    };

    // Panggil fungsi `syncKelasKuliahs`
    await syncKelasKuliahs(fakeSyncReq, fakeSyncRes, (error) => {
      if (error) {
        console.error("Error during syncKelasKuliahs:", error.message);
      }
    });

    console.log("Cronjob singkron kelas kuliah finished");
  } catch (error) {
    console.error("Error saat cronjob singkron kelas kuliah dijalankan:", error.message);
  }
}

module.exports = singkronKelasKuliah;
