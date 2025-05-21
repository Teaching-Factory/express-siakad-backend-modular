const { PerkuliahanMahasiswaSync } = require("../../../models");

async function deletePerkuliahanMahasiswaSyncs() {
  console.log("Cronjob delete perkuliahan mahasiswa syncs started");

  try {
    const perkuliahanMahasiswaSyncs = await PerkuliahanMahasiswaSync.findAll({
      where: {
        status: true,
      },
    });

    // Jika tidak ada data, log dan akhiri
    if (perkuliahanMahasiswaSyncs.length === 0) {
      console.log("Tidak ada data perkuliahan mahasiswa syncs yang perlu dihapus.");
      return;
    }

    // Hapus data satu per satu atau sekaligus
    await PerkuliahanMahasiswaSync.destroy({
      where: {
        status: true,
      },
    });

    console.log(`Berhasil menghapus ${perkuliahanMahasiswaSyncs.length} data perkuliahan mahasiswa syncs.`);
    console.log("Cronjob delete perkuliahan mahasiswa syncs finished");
  } catch (error) {
    console.error("Error saat cronjob delete perkuliahan mahasiswa syncs dijalankan:", error.message);
  }
}

module.exports = deletePerkuliahanMahasiswaSyncs;
