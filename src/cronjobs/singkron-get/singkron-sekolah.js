const { syncSekolah } = require("../../modules/sync-feeder/data-feeder/sekolah");

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
    console.error("Error saat cronjob singkron sekolah dijalankan:", error.message);
  }
}

module.exports = singkronSekolah;
