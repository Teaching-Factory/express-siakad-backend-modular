const { syncSekolah } = require("../../controllers/sync-feeder/sekolah");

async function singkronSekolah() {
  console.log("Cronjob singkron sekolah started");

  try {
    // proses singkron sekolah
    await syncSekolah({}, { status: () => ({ json: () => {} }) }, (error) => {
      if (error) {
        console.error("Error during syncSekolah:", error.message);
      }
    });

    console.log("Cronjob singkron sekolah finished");
  } catch (error) {
    console.error("Error saat cronjob singkron dosen dijalankan:", error.message);
  }
}

module.exports = singkronSekolah;
