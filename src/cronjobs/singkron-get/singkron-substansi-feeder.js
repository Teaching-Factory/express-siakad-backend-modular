const { syncSubstansi } = require("../../modules/sync-feeder/data-feeder/substansi");

async function singkronSubstansi() {
  console.log("Cronjob singkron substansi started");

  try {
    // proses singkron substansi
    await syncSubstansi({}, { status: () => ({ json: () => {} }) }, (error) => {
      if (error) {
        console.error("Error during syncSubstansi:", error.message);
      }
    });

    console.log("Cronjob singkron substansi finished");
  } catch (error) {
    console.error("Error saat cronjob singkron substansi dijalankan:", error.message);
  }
}

module.exports = singkronSubstansi;
