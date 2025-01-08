const { syncProdi } = require("../../controllers/sync-feeder/prodi");

async function singkronProdi(req, res, next) {
  console.log("Cronjob singkron prodi started");

  try {
    // proses singkron prodi
    await syncProdi();

    console.log("Cronjob singkron prodi finished");
  } catch (error) {
    if (error.response) {
      console.error("Error saat cronjob singkron prodi dijalankan:", error.message);
    }
    next(error);
  }
}

module.exports = singkronProdi;
