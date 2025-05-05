const { syncListPeriodePerkuliahan } = require("../../controllers/sync-feeder/list-periode-perkuliahan");

async function singkronPeriodePerkuliahan() {
  console.log("Cronjob singkron periode perkuliahan started");

  try {
    // proses singkron periode perkuliahan
    await syncListPeriodePerkuliahan({}, { status: () => ({ json: () => {} }) }, (error) => {
      if (error) {
        console.error("Error during syncListPeriodePerkuliahan:", error.message);
      }
    });

    console.log("Cronjob singkron periode perkuliahan finished");
  } catch (error) {
    console.error("Error saat cronjob singkron periode perkuliahan dijalankan:", error.message);
  }
}

module.exports = singkronPeriodePerkuliahan;
