const { DosenPengajarKelasKuliahSync } = require("../../../models");

async function deleteDosenPengajarKelasKuliahSyncs() {
  console.log("Cronjob delete dosen pengajar kelas kuliah syncs started");

  try {
    const dosenPengajarKelasKuliahSyncs = await DosenPengajarKelasKuliahSync.findAll({
      where: {
        status: true,
      },
    });

    // Jika tidak ada data, log dan akhiri
    if (dosenPengajarKelasKuliahSyncs.length === 0) {
      console.log("Tidak ada data dosen pengajar kelas kuliah syncs yang perlu dihapus.");
      return;
    }

    // Hapus data satu per satu atau sekaligus
    await DosenPengajarKelasKuliahSync.destroy({
      where: {
        status: true,
      },
    });

    console.log(`Berhasil menghapus ${dosenPengajarKelasKuliahSyncs.length} data dosen pengajar kelas kuliah syncs.`);
    console.log("Cronjob delete dosen pengajar kelas kuliah syncs finished");
  } catch (error) {
    console.error("Error saat cronjob delete dosen pengajar kelas kuliah syncs dijalankan:", error.message);
  }
}

module.exports = deleteDosenPengajarKelasKuliahSyncs;
