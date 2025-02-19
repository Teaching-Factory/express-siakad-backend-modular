const { SettingGlobalSemester, DosenPengajarKelasKuliahSync } = require("../../../models");
const { matchingcDataDosenPengajarKelasKuliah, syncDosenPengajarKelasKuliahs } = require("../../controllers/sync-feeder/dosen-pengajar-kelas-kuliah");

async function singkronDosenPengajarKelasKuliah() {
  console.log("Cronjob singkron dosen pengajar kelas kuliah started");

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

    await matchingcDataDosenPengajarKelasKuliah(fakeReq, fakeRes, () => {});

    // get data dosen pengajar kelas kuliah sync yang belum di singkron dengan jenis singkron create dan delete
    const dosen_pengajar_kelas_kuliah_syncs = await DosenPengajarKelasKuliahSync.findAll({
      where: {
        jenis_singkron: ["create"], // hanya jenis singkron create yang dikirimkan
        status: false,
      },
      attributes: ["id"],
    });

    if (dosen_pengajar_kelas_kuliah_syncs.length === 0) {
      console.log("Tidak ada data dosen pengajar kelas kuliah yang perlu disinkron.");
      return;
    }

    // **Format request body sesuai dengan kebutuhan API**
    const formattedData = { dosen_pengajar_kelas_kuliah_syncs: dosen_pengajar_kelas_kuliah_syncs.map((dosen_pengajar_kelas) => ({ id: dosen_pengajar_kelas.id })) };

    // Buat objek request palsu untuk `syncDosenPengajarKelasKuliahs`
    const fakeSyncReq = {
      body: formattedData,
    };

    // Simulasi response kosong agar tidak mempengaruhi output
    const fakeSyncRes = {
      status: () => ({
        json: () => {},
      }),
    };

    // Panggil fungsi `syncDosenPengajarKelasKuliahs`
    await syncDosenPengajarKelasKuliahs(fakeSyncReq, fakeSyncRes, (error) => {
      if (error) {
        console.error("Error during syncDosenPengajarKelasKuliahs:", error.message);
      }
    });

    console.log("Cronjob singkron dosen pengajar kelas kuliah finished");
  } catch (error) {
    console.error("Error saat cronjob singkron dosen pengajar kelas kuliah dijalankan:", error.message);
  }
}

module.exports = singkronDosenPengajarKelasKuliah;
