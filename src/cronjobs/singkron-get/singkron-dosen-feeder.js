const { syncListDosen } = require("../../controllers/sync-feeder/list-dosen");

async function singkronDosen() {
  console.log("Cronjob singkron dosen started");

  try {
    // proses singkron dosen
    await syncListDosen({}, { status: () => ({ json: () => {} }) }, (error) => {
      if (error) {
        console.error("Error during syncListDosen:", error.message);
      }
    });

    console.log("Cronjob singkron dosen finished");
  } catch (error) {
    console.error("Error saat cronjob singkron dosen dijalankan:", error);
  }
}

module.exports = singkronDosen;
