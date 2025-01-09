const { SettingGlobalSemester } = require("../../../models");
const { matchingSyncDataKelasKuliah, syncKelasKuliahs, KelasKuliahSync } = require("../../controllers/sync-feeder/kelas-kuliah-sync");

async function singkronKelasKuliah() {
  console.log("Cronjob singkron kelas kuliah started");

  try {
    // get data setting global semester yang status nya aktif
    const setting_global_semester_aktif = await SettingGlobalSemester.findOne({
      status: true,
    });

    if (!setting_global_semester_aktif) {
      return res.status(400).json({
        message: "Setting Global Semester Aktif not found",
      });
    }

    // proses singkron kelas kuliah
    await matchingSyncDataKelasKuliah(setting_global_semester_aktif.id_semester_aktif, {}, { status: () => ({ json: () => {} }) }, (error) => {
      if (error) {
        console.error("Error during matchingSyncDataKelasKuliah:", error.message);
      }
    });

    // get data kelas kuliah sync yang belum di singkron dengan jenis singkron create dan delete
    const kelas_kuliah_syncs = await KelasKuliahSync.findAll({
      where: {
        jenis_singkron: ["create", "delete"],
        status: false,
      },
      attributes: ["id"],
    });

    // Ubah data menjadi format yang dibutuhkan (request body)
    const formattedData = kelas_kuliah_syncs.map((kelas) => ({ id: kelas.id }));

    // proses singkron kelas kuliah
    await syncKelasKuliahs(formattedData, {}, { status: () => ({ json: () => {} }) }, (error) => {
      if (error) {
        console.error("Error during syncKelasKuliahs:", error.message);
      }
    });

    console.log("Cronjob singkron kelas kuliah finished");
  } catch (error) {
    console.error("Error saat cronjob singkron dosen dijalankan:", error.message);
  }
}

module.exports = singkronKelasKuliah;
