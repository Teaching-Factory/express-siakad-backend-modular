const { KomponenEvaluasiKelasSync } = require("../../../models");

async function deleteKomponenEvaluasiKelasSyncs() {
  console.log("Cronjob delete komponen evaluasi kelas syncs started");

  try {
    const komponenEvaluasiKelasSyncs = await KomponenEvaluasiKelasSync.findAll({
      where: {
        status: true,
      },
    });

    // Jika tidak ada data, log dan akhiri
    if (komponenEvaluasiKelasSyncs.length === 0) {
      console.log("Tidak ada data komponen evaluasi kelas syncs yang perlu dihapus.");
      return;
    }

    // Hapus data satu per satu atau sekaligus
    await KomponenEvaluasiKelasSync.destroy({
      where: {
        status: true,
      },
    });

    console.log(`Berhasil menghapus ${komponenEvaluasiKelasSyncs.length} data komponen evaluasi kelas syncs.`);
    console.log("Cronjob delete komponen evaluasi kelas syncs finished");
  } catch (error) {
    console.error("Error saat cronjob delete komponen evaluasi kelas syncs dijalankan:", error.message);
  }
}

module.exports = deleteKomponenEvaluasiKelasSyncs;
