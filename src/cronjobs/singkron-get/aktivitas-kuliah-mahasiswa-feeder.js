const { syncAktivitasKuliahMahasiswa } = require("../../controllers/sync-feeder/aktivitas-kuliah-mahasiswa");

async function singkronAktivitasKuliahMahasiswa() {
  console.log("Cronjob singkron aktivitas kuliah mahasiswa started");

  try {
    // proses singkron aktivitas kuliah mahasiswa
    await syncAktivitasKuliahMahasiswa({}, { status: () => ({ json: () => {} }) }, (error) => {
      if (error) {
        console.error("Error during syncAktivitasKuliahMahasiswa:", error.message);
      }
    });

    console.log("Cronjob singkron aktivitas kuliah mahasiswa finished");
  } catch (error) {
    console.error("Error saat cronjob singkron aktivitas kuliah mahasiswa dijalankan:", error.message);
  }
}

module.exports = singkronAktivitasKuliahMahasiswa;
