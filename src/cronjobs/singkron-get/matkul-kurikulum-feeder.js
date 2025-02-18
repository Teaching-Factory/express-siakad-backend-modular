const { syncMatkulKurikulum } = require("../../controllers/sync-feeder/matkul-kurikulum");

async function singkronMatkulKurikulum() {
  console.log("Cronjob singkron matkul kurikulum started");

  try {
    // proses singkron matkul kurikulum
    await syncMatkulKurikulum({}, { status: () => ({ json: () => {} }) }, (error) => {
      if (error) {
        console.error("Error during syncMatkulKurikulum:", error.message);
      }
    });

    console.log("Cronjob singkron matkul kurikulum finished");
  } catch (error) {
    console.error("Error saat cronjob singkron matkul kurikulum dijalankan:", error.message);
  }
}

module.exports = singkronMatkulKurikulum;
