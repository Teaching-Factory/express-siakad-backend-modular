const { syncDetailKurikulum } = require("../../modules/sync-feeder/data-feeder/detail-kurikulum");

async function singkronDetailKurikulum() {
  console.log("Cronjob singkron detail kurikulum started");

  try {
    // proses singkron detail kurikulum
    await syncDetailKurikulum({}, { status: () => ({ json: () => {} }) }, (error) => {
      if (error) {
        console.error("Error during syncDetailKurikulum:", error.message);
      }
    });

    console.log("Cronjob singkron detail kurikulum finished");
  } catch (error) {
    console.error("Error saat cronjob singkron detail kurikulum dijalankan:", error.message);
  }
}

module.exports = singkronDetailKurikulum;
