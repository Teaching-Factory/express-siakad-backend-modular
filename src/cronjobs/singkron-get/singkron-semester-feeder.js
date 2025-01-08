const { syncSemester } = require("../../controllers/sync-feeder/semester");

async function singkronSemester(req, res, next) {
  console.log("Cronjob singkron semester started");

  try {
    // proses singkron semester
    await syncSemester();

    console.log("Cronjob singkron semester finished");
  } catch (error) {
    if (error.response) {
      console.error("Error saat cronjob singkron semester dijalankan:", error.message);
    }
    next(error);
  }
}

module.exports = singkronSemester;
