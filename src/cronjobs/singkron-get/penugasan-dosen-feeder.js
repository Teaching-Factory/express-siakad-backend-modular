const { syncPenugasanDosen } = require("../../controllers/sync-feeder/penugasan-dosen");

async function singkronPenugasanDosen() {
  console.log("Cronjob singkron penugasan dosen started");

  try {
    // proses singkron penugasan dosen
    await syncPenugasanDosen({}, { status: () => ({ json: () => {} }) }, (error) => {
      if (error) {
        console.error("Error during syncPenugasanDosen:", error.message);
      }
    });

    console.log("Cronjob singkron penugasan dosen finished");
  } catch (error) {
    console.error("Error saat cronjob singkron penugasan dosen dijalankan:", error.message);
  }
}

module.exports = singkronPenugasanDosen;
