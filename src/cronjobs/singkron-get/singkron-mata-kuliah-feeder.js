const { syncListMataKuliah } = require("../../controllers/sync-feeder/list-mata-kuliah");

async function singkronMataKuliah(req, res, next) {
  console.log("Cronjob singkron mata kuliah started");

  try {
    // proses singkron mata kuliah
    await syncListMataKuliah();

    console.log("Cronjob singkron mata kuliah finished");
  } catch (error) {
    if (error.response) {
      console.error("Error saat cronjob singkron mata kuliah dijalankan:", error.message);
    }
    next(error);
  }
}

module.exports = singkronMataKuliah;
