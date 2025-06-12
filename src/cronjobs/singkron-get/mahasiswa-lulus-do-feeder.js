const { syncMahasiswaLulusDO } = require("../../modules/sync-feeder/data-feeder/mahasiswa-lulus-do");

async function singkronMahasiswaLulusDO() {
  console.log("Cronjob singkron mahasiswa lulus do started");

  try {
    // proses singkron mahasiswa lulus do
    await syncMahasiswaLulusDO({}, { status: () => ({ json: () => {} }) }, (error) => {
      if (error) {
        console.error("Error during syncMahasiswaLulusDO:", error.message);
      }
    });

    console.log("Cronjob singkron mahasiswa lulus do finished");
  } catch (error) {
    console.error("Error saat cronjob singkron mahasiswa lulus do dijalankan:", error.message);
  }
}

module.exports = singkronMahasiswaLulusDO;
