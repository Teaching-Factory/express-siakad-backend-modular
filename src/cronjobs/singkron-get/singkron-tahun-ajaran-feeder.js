const { syncTahunAjaran } = require("../../controllers/sync-feeder/tahun-ajaran");

async function singkronTahunAjaran(req, res, next) {
  console.log("Cronjob singkron tahun ajaran started");

  try {
    // proses singkron tahun ajaran
    await syncTahunAjaran();

    console.log("Cronjob singkron tahun ajaran finished");
  } catch (error) {
    if (error.response) {
      console.error("Error saat cronjob singkron tahun ajaran dijalankan:", error.message);
    }
    next(error);
  }
}

module.exports = singkronTahunAjaran;
