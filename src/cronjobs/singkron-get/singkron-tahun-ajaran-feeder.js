const { syncTahunAjaran } = require("../../modules/sync-feeder/data-feeder/tahun-ajaran");

async function singkronTahunAjaran() {
  console.log("Cronjob singkron tahun ajaran started");

  try {
    // proses singkron tahun ajaran
    await syncTahunAjaran({}, { status: () => ({ json: () => {} }) }, (error) => {
      if (error) {
        console.error("Error during syncTahunAjaran:", error.message);
      }
    });

    console.log("Cronjob singkron tahun ajaran finished");
  } catch (error) {
    console.error("Error saat cronjob tahun ajaran dosen dijalankan:", error.message);
  }
}

module.exports = singkronTahunAjaran;
