const { syncListMataKuliah } = require("../../modules/sync-feeder/data-feeder/list-mata-kuliah");

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
