const { syncKurikulum } = require("../../controllers/sync-feeder/kurikulum");

async function singkronKurikulum(req, res, next) {
  console.log("Cronjob singkron kurikulum started");

  try {
    // proses singkron kurikulum
    await syncKurikulum();

    console.log("Cronjob singkron kurikulum finished");
  } catch (error) {
    if (error.response) {
      console.error("Error saat cronjob singkron kurikulum dijalankan:", error.message);
    }
    next(error);
  }
}

module.exports = singkronKurikulum;
