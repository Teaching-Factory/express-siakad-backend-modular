const { SettingGlobalSemester, DetailNilaiPerkuliahanKelasSync } = require("../../../models");
const { matchingDataDetailNilaiPerkuliahanKelas, syncNilaiPerkuliahans } = require("../../controllers/sync-feeder/detail-nilai-perkuliahan-kelas-sync");
const { Op } = require("sequelize");

async function singkronDetailNilaiPerkuliahanKelas() {
  console.log("Cronjob singkron detail nilai perkuliahan kelas started");

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
        id_semester: setting_global_semester_aktif.id_semester_nilai,
      },
    };

    // Objek response kosong agar tidak mempengaruhi output
    const fakeRes = {
      status: () => ({
        json: () => {},
      }),
    };

    await matchingDataDetailNilaiPerkuliahanKelas(fakeReq, fakeRes, () => {});

    // get data detail nilai perkuliahan kelas sync yang belum di singkron dengan jenis singkron create dan delete
    const nilai_perkuliahans = await DetailNilaiPerkuliahanKelasSync.findAll({
      where: {
        jenis_singkron: {
          [Op.in]: ["create", "get", "update"], // Memfilter hanya "create", "get" dan "update"
        },
        status: false,
      },
      attributes: ["id"],
    });

    if (nilai_perkuliahans.length === 0) {
      console.log("Tidak ada data detail nilai perkuliahan kelas yang perlu disinkron.");
      return;
    }

    // **Format request body sesuai dengan kebutuhan API**
    const formattedData = { nilai_perkuliahans: nilai_perkuliahans.map((nilai) => ({ id: nilai.id })) };

    // Buat objek request palsu untuk `syncNilaiPerkuliahans`
    const fakeSyncReq = {
      body: formattedData,
    };

    // Simulasi response kosong agar tidak mempengaruhi output
    const fakeSyncRes = {
      status: () => ({
        json: () => {},
      }),
    };

    // Panggil fungsi `syncNilaiPerkuliahans`
    await syncNilaiPerkuliahans(fakeSyncReq, fakeSyncRes, (error) => {
      if (error) {
        console.error("Error during syncNilaiPerkuliahans:", error.message);
      }
    });

    console.log("Cronjob singkron detail nilai perkuliahan kelas finished");
  } catch (error) {
    console.error("Error saat cronjob singkron detail nilai perkuliahan kelas dijalankan:", error.message);
  }
}

module.exports = singkronDetailNilaiPerkuliahanKelas;
