const { RiwayatPendidikanMahasiswaSync } = require("../../../models");

async function deleteRiwayatPendidikanMahasiswaSyncs() {
  console.log("Cronjob delete riwayat pendidikan mahasiswa syncs started");

  try {
    const riwayatPendidikanMahasiswaSyncs = await RiwayatPendidikanMahasiswaSync.findAll({
      where: {
        status: true,
      },
    });

    // Jika tidak ada data, log dan akhiri
    if (riwayatPendidikanMahasiswaSyncs.length === 0) {
      console.log("Tidak ada data riwayat pendidikan mahasiswa syncs yang perlu dihapus.");
      return;
    }

    // Hapus data satu per satu atau sekaligus
    await RiwayatPendidikanMahasiswaSync.destroy({
      where: {
        status: true,
      },
    });

    console.log(`Berhasil menghapus ${riwayatPendidikanMahasiswaSyncs.length} data riwayat pendidikan mahasiswa syncs.`);
    console.log("Cronjob delete riwayat pendidikan mahasiswa syncs finished");
  } catch (error) {
    console.error("Error saat cronjob delete riwayat pendidikan mahasiswa syncs dijalankan:", error.message);
  }
}

module.exports = deleteRiwayatPendidikanMahasiswaSyncs;
