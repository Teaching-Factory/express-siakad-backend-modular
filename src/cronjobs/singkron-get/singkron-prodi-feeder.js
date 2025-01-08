const { syncProdi } = require("../../controllers/sync-feeder/prodi");

async function singkronProdi() {
  console.log("Cronjob singkron prodi started");

  try {
    // proses singkron prodi
    await syncProdi({}, { status: () => ({ json: () => {} }) }, (error) => {
      if (error) {
        console.error("Error during syncProdi:", error.message);
      }
    });

    console.log("Cronjob singkron prodi finished");
  } catch (error) {
    console.error("Error saat cronjob singkron dosen dijalankan:", error.message);
  }
}

module.exports = singkronProdi;
