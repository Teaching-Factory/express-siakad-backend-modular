const { SettingGlobalSemester, RiwayatPendidikanMahasiswaSync } = require("../../../models");
const { matchingcDataRiwayatPendidikanMahasiswa, syncRiwayatPendidikanMahasiswas } = require("../../controllers/sync-feeder/riwayat-pendidikan-mahasiswa-sync");
const { Op } = require("sequelize");

async function singkronRiwayatPendidikanMahasiswa() {
  console.log("Cronjob singkron riwayat pendidikan mahasiswa started");

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

    await matchingcDataRiwayatPendidikanMahasiswa(fakeReq, fakeRes, () => {});

    // get data riwayat pendidikan mahasiswa sync yang belum di singkron dengan jenis singkron create dan delete
    const riwayat_pendidikan_mahasiswa_syncs = await RiwayatPendidikanMahasiswaSync.findAll({
      where: {
        jenis_singkron: {
          [Op.in]: ["create", "get", "update"], // Memfilter hanya "create", "get" dan "update"
        },
        status: false,
      },
      attributes: ["id"],
    });

    if (riwayat_pendidikan_mahasiswa_syncs.length === 0) {
      console.log("Tidak ada data riwayat pendidikan mahasiswa yang perlu disinkron.");
      return;
    }

    // **Format request body sesuai dengan kebutuhan API**
    const formattedData = { riwayat_pendidikan_mahasiswa_syncs: riwayat_pendidikan_mahasiswa_syncs.map((riwayat_pend_mhs) => ({ id: riwayat_pend_mhs.id })) };

    // Buat objek request palsu untuk `syncRiwayatPendidikanMahasiswas`
    const fakeSyncReq = {
      body: formattedData,
    };

    // Simulasi response kosong agar tidak mempengaruhi output
    const fakeSyncRes = {
      status: () => ({
        json: () => {},
      }),
    };

    // Panggil fungsi `syncRiwayatPendidikanMahasiswas`
    await syncRiwayatPendidikanMahasiswas(fakeSyncReq, fakeSyncRes, (error) => {
      if (error) {
        console.error("Error during syncRiwayatPendidikanMahasiswas:", error.message);
      }
    });

    console.log("Cronjob singkron riwayat pendidikan mahasiswa finished");
  } catch (error) {
    console.error("Error saat cronjob singkron riwayat pendidikan mahasiswa dijalankan:", error.message);
  }
}

module.exports = singkronRiwayatPendidikanMahasiswa;
