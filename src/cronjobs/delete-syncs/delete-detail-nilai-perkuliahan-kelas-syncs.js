const { DetailNilaiPerkuliahanKelasSync } = require("../../../models");

async function deleteDetailNilaiPerkuliahanKelasSyncs() {
  console.log("Cronjob delete detail nilai perkulihan kelas syncs started");

  try {
    const detailNilaiPerkuliahanKelasSyncs = await DetailNilaiPerkuliahanKelasSync.findAll({
      where: {
        status: true,
      },
    });

    // Jika tidak ada data, log dan akhiri
    if (detailNilaiPerkuliahanKelasSyncs.length === 0) {
      console.log("Tidak ada data detail nilai perkulihan kelas syncs yang perlu dihapus.");
      return;
    }

    // Hapus data satu per satu atau sekaligus
    await DetailNilaiPerkuliahanKelasSync.destroy({
      where: {
        status: true,
      },
    });

    console.log(`Berhasil menghapus ${detailNilaiPerkuliahanKelasSyncs.length} data detail nilai perkulihan kelas syncs.`);
    console.log("Cronjob delete detail nilai perkulihan kelas syncs finished");
  } catch (error) {
    console.error("Error saat cronjob delete detail nilai perkulihan kelas syncs dijalankan:", error.message);
  }
}

module.exports = deleteDetailNilaiPerkuliahanKelasSyncs;
