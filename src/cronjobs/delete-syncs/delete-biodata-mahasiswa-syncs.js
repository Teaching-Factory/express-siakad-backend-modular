const { BiodataMahasiswaSync } = require("../../../models");

async function deleteBiodataMahasiswaSyncs() {
  console.log("Cronjob delete biodata mahasiswa syncs started");

  try {
    const biodataMahasiswaSyncs = await BiodataMahasiswaSync.findAll({
      where: {
        status: true,
      },
    });

    // Jika tidak ada data, log dan akhiri
    if (biodataMahasiswaSyncs.length === 0) {
      console.log("Tidak ada data biodata mahasiswa syncs yang perlu dihapus.");
      return;
    }

    // Hapus data satu per satu atau sekaligus
    await BiodataMahasiswaSync.destroy({
      where: {
        status: true,
      },
    });

    console.log(`Berhasil menghapus ${biodataMahasiswaSyncs.length} data biodata mahasiswa syncs.`);
    console.log("Cronjob delete biodata mahasiswa syncs finished");
  } catch (error) {
    console.error("Error saat cronjob delete biodata mahasiswa syncs dijalankan:", error.message);
  }
}

module.exports = deleteBiodataMahasiswaSyncs;
