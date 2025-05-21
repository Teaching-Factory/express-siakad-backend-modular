const { PesertaKelasKuliahSync } = require("../../../models");

async function deletePesertaKelasKuliahSyncs() {
  console.log("Cronjob delete peserta kelas kuliah syncs started");

  try {
    const pesertaKelasKuliahSyncs = await PesertaKelasKuliahSync.findAll({
      where: {
        status: true,
      },
    });

    // Jika tidak ada data, log dan akhiri
    if (pesertaKelasKuliahSyncs.length === 0) {
      console.log("Tidak ada data peserta kelas kuliah syncs yang perlu dihapus.");
      return;
    }

    // Hapus data satu per satu atau sekaligus
    await PesertaKelasKuliahSync.destroy({
      where: {
        status: true,
      },
    });

    console.log(`Berhasil menghapus ${pesertaKelasKuliahSyncs.length} data peserta kelas kuliah syncs.`);
    console.log("Cronjob delete peserta kelas kuliah syncs finished");
  } catch (error) {
    console.error("Error saat cronjob delete peserta kelas kuliah syncs dijalankan:", error.message);
  }
}

module.exports = deletePesertaKelasKuliahSyncs;
