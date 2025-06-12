const { syncKurikulum } = require("../../modules/sync-feeder/data-feeder/kurikulum");

async function singkronKurikulum() {
  console.log("Cronjob singkron kurikulum started");

  try {
    // proses singkron kurikulum
    await syncKurikulum({}, { status: () => ({ json: () => {} }) }, (error) => {
      if (error) {
        console.error("Error during syncKurikulum:", error.message);
      }
    });

    console.log("Cronjob singkron kurikulum finished");
  } catch (error) {
    console.error("Error saat cronjob singkron kurikulum dijalankan:", error.message);
  }
}

module.exports = singkronKurikulum;
