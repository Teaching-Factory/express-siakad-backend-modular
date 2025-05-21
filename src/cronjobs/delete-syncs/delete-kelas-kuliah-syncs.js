const { KelasKuliahSync } = require("../../../models");

async function deleteKelasKuliahSyncs() {
  console.log("Cronjob delete kelas kuliah syncs started");

  try {
    const kelasKuliahSyncs = await KelasKuliahSync.findAll({
      where: {
        status: true,
      },
    });

    // Jika tidak ada data, log dan akhiri
    if (kelasKuliahSyncs.length === 0) {
      console.log("Tidak ada data kelas kuliah syncs yang perlu dihapus.");
      return;
    }

    // Hapus data satu per satu atau sekaligus
    await KelasKuliahSync.destroy({
      where: {
        status: true,
      },
    });

    console.log(`Berhasil menghapus ${kelasKuliahSyncs.length} data kelas kuliah syncs.`);
    console.log("Cronjob delete kelas kuliah syncs finished");
  } catch (error) {
    console.error("Error saat cronjob delete kelas kuliah syncs dijalankan:", error.message);
  }
}

module.exports = deleteKelasKuliahSyncs;
