const { syncListDosen } = require("../../controllers/sync-feeder/list-dosen");

async function singkronDosen(req, res, next) {
  console.log("Cronjob singkron dosen started");

  try {
    // proses singkron dosen
    await syncListDosen();

    console.log("Cronjob singkron dosen finished");
  } catch (error) {
    if (error.response) {
      console.error("Error saat cronjob singkron dosen dijalankan:", error.message);
    }
    next(error);
  }
}

module.exports = singkronDosen;
