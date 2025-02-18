const { syncListMataKuliah } = require("../../controllers/sync-feeder/list-mata-kuliah");

async function singkronMataKuliah() {
  console.log("Cronjob singkron mata kuliah started");

  try {
    // proses singkron mata kuliah
    await syncListMataKuliah({}, { status: () => ({ json: () => {} }) }, (error) => {
      if (error) {
        console.error("Error during syncListMataKuliah:", error.message);
      }
    });

    console.log("Cronjob singkron mata kuliah finished");
  } catch (error) {
    console.error("Error saat cronjob singkron mata kuliah dijalankan:", error.message);
  }
}

module.exports = singkronMataKuliah;
