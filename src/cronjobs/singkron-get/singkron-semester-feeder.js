const { syncSemester } = require("../../controllers/sync-feeder/semester");

async function singkronSemester() {
  console.log("Cronjob singkron semester started");

  try {
    // proses singkron semester
    await syncSemester({}, { status: () => ({ json: () => {} }) }, (error) => {
      if (error) {
        console.error("Error during syncSemester:", error.message);
      }
    });

    console.log("Cronjob singkron semester finished");
  } catch (error) {
    console.error("Error saat cronjob singkron semester dijalankan:", error.message);
  }
}

module.exports = singkronSemester;
