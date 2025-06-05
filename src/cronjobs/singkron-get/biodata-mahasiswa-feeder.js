const { SettingGlobalSemester, BiodataMahasiswaSync } = require("../../../models");
const { matchingDataBiodataMahasiswa, syncBiodataMahasiswas } = require("../../modules/sync-feeder/data-feeder/biodata-mahasiswa-sync");
const { Op } = require("sequelize");

async function singkronBiodataMahasiswa() {
  console.log("Cronjob singkron biodata mahasiswa started");

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

    await matchingDataBiodataMahasiswa(fakeReq, fakeRes, () => {});

    // get data biodata mahasiswa sync yang belum di singkron dengan jenis singkron create dan delete
    const biodata_mahasiswa_syncs = await BiodataMahasiswaSync.findAll({
      where: {
        jenis_singkron: {
          [Op.in]: ["create", "get", "update"], // Memfilter hanya "create", "get" dan "update"
        },
        status: false,
      },
      attributes: ["id"],
    });

    if (biodata_mahasiswa_syncs.length === 0) {
      console.log("Tidak ada data biodata mahasiswa yang perlu disinkron.");
      return;
    }

    // **Format request body sesuai dengan kebutuhan API**
    const formattedData = { biodata_mahasiswa_syncs: biodata_mahasiswa_syncs.map((biodata_mahasiswa) => ({ id: biodata_mahasiswa.id })) };

    // Buat objek request palsu untuk `syncBiodataMahasiswas`
    const fakeSyncReq = {
      body: formattedData,
    };

    // Simulasi response kosong agar tidak mempengaruhi output
    const fakeSyncRes = {
      status: () => ({
        json: () => {},
      }),
    };

    // Panggil fungsi `syncBiodataMahasiswas`
    await syncBiodataMahasiswas(fakeSyncReq, fakeSyncRes, (error) => {
      if (error) {
        console.error("Error during syncBiodataMahasiswas:", error.message);
      }
    });

    console.log("Cronjob singkron biodata mahasiswa finished");
  } catch (error) {
    console.error("Error saat cronjob singkron biodata mahasiswa dijalankan:", error.message);
  }
}

module.exports = singkronBiodataMahasiswa;
