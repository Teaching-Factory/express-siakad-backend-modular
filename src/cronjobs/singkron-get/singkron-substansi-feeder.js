const { syncSubstansi } = require("../../controllers/sync-feeder/substansi");

async function singkronSubstansi(req, res, next) {
  console.log("Cronjob singkron substansi started");

  try {
    // proses singkron substansi
    await syncSubstansi();

    console.log("Cronjob singkron substansi finished");
  } catch (error) {
    if (error.response) {
      console.error("Error saat cronjob singkron substansi dijalankan:", error.message);
    }
    next(error);
  }
}

module.exports = singkronSubstansi;
