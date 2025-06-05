const { SettingGlobalSemester, PerkuliahanMahasiswaSync } = require("../../../models");
const { matchingPerkuliahanMahasiswa, syncPerkuliahanMahasiswas } = require("../../modules/sync-feeder/data-feeder/perkuliahan-mahasiswa-sync");
const { Op } = require("sequelize");

async function singkronPerkuliahanMahasiswa() {
  console.log("Cronjob singkron perkuliahan mahasiswa started");

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

    await matchingPerkuliahanMahasiswa(fakeReq, fakeRes, () => {});

    // get data perkuliahan mahasiswa sync yang belum di singkron dengan jenis singkron create dan delete
    const perkuliahan_mahasiswas = await PerkuliahanMahasiswaSync.findAll({
      where: {
        jenis_singkron: {
          [Op.in]: ["get", "create", "update"], // Memfilter hanya "get", "create" dan "update"
        },
        status: false,
      },
      attributes: ["id"],
    });

    if (perkuliahan_mahasiswas.length === 0) {
      console.log("Tidak ada data perkuliahan mahasiswa yang perlu disinkron.");
      return;
    }

    // **Format request body sesuai dengan kebutuhan API**
    const formattedData = { perkuliahan_mahasiswas: perkuliahan_mahasiswas.map((perkuliahan_mhs) => ({ id: perkuliahan_mhs.id })) };

    // Buat objek request palsu untuk `syncPerkuliahanMahasiswas`
    const fakeSyncReq = {
      body: formattedData,
    };

    // Simulasi response kosong agar tidak mempengaruhi output
    const fakeSyncRes = {
      status: () => ({
        json: () => {},
      }),
    };

    // Panggil fungsi `syncPerkuliahanMahasiswas`
    await syncPerkuliahanMahasiswas(fakeSyncReq, fakeSyncRes, (error) => {
      if (error) {
        console.error("Error during syncPerkuliahanMahasiswas:", error.message);
      }
    });

    console.log("Cronjob singkron perkuliahan mahasiswa finished");
  } catch (error) {
    console.error("Error saat cronjob singkron perkuliahan mahasiswa dijalankan:", error.message);
  }
}

module.exports = singkronPerkuliahanMahasiswa;
