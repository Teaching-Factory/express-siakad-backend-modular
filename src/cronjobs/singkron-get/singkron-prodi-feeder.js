const { syncProdi } = require("../../modules/sync-feeder/data-feeder/prodi");

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
    console.error("Error saat cronjob singkron prodi dijalankan:", error.message);
  }
}

module.exports = singkronProdi;
