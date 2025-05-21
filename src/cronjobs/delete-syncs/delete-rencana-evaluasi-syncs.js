const { RencanaEvaluasiSync } = require("../../../models");

async function deleteRencanaEvaluasiSyncs() {
  console.log("Cronjob delete rencana evaluasi syncs started");

  try {
    const rencanaEvaluasiSyncs = await RencanaEvaluasiSync.findAll({
      where: {
        status: true,
      },
    });

    // Jika tidak ada data, log dan akhiri
    if (rencanaEvaluasiSyncs.length === 0) {
      console.log("Tidak ada data rencana evaluasi syncs yang perlu dihapus.");
      return;
    }

    // Hapus data satu per satu atau sekaligus
    await RencanaEvaluasiSync.destroy({
      where: {
        status: true,
      },
    });

    console.log(`Berhasil menghapus ${rencanaEvaluasiSyncs.length} data rencana evaluasi syncs.`);
    console.log("Cronjob delete rencana evaluasi syncs finished");
  } catch (error) {
    console.error("Error saat cronjob delete rencana evaluasi syncs dijalankan:", error.message);
  }
}

module.exports = deleteRencanaEvaluasiSyncs;
