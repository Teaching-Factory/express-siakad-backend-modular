const { SettingGlobalSemester, PesertaKelasKuliahSync, Angkatan } = require("../../../models");
const { matchingDataPesertaKelasKuliah, syncPesertaKelasKuliahs } = require("../../modules/sync-feeder/data-feeder/peserta-kelas-kuliah-sync");
const { Op } = require("sequelize");

async function singkronPesertaKelasKuliah() {
  console.log("Cronjob singkron peserta kelas kuliah started");

  try {
    // get data setting global semester yang status nya aktif
    const setting_global_semester_aktif = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    if (!setting_global_semester_aktif) {
      console.error("Error: Setting Global Semester Aktif tidak ditemukan.");
      return;
    }

    // Ambil 4 digit pertama dari id_semester_krs dan konversi ke integer
    const tahunSekarang = parseInt(setting_global_semester_aktif.id_semester_krs.slice(0, 4), 10);

    // Hitung tahun awal (4 tahun ke belakang)
    const tahunAwal = tahunSekarang - 4;

    const angkatans = await Angkatan.findAll({
      where: {
        tahun: {
          [Op.between]: [tahunAwal, tahunSekarang],
        },
      },
      order: [["createdAt", "DESC"]],
    });

    for (const angkatan of angkatans) {
      console.log(`Proses sinkron angkatan tahun ${angkatan.tahun} (id: ${angkatan.id})`);

      // Buat objek request palsu untuk pemanggilan internal tanpa API
      const fakeReq = {
        params: {
          id_angkatan: angkatan.id,
        },
      };

      // Objek response kosong agar tidak mempengaruhi output
      const fakeRes = {
        status: () => ({
          json: () => {},
        }),
      };

      await matchingDataPesertaKelasKuliah(fakeReq, fakeRes, () => {});

      // get data peserta kelas kuliah sync yang belum di singkron dengan jenis singkron create dan delete
      const peserta_kelas_kuliah_syncs = await PesertaKelasKuliahSync.findAll({
        where: {
          jenis_singkron: {
            [Op.in]: ["create", "get", "update"], // Memfilter hanya "create", "get" dan "update"
          },
          status: false,
        },
        attributes: ["id"],
      });

      if (peserta_kelas_kuliah_syncs.length === 0) {
        console.log("Tidak ada data peserta kelas kuliah yang perlu disinkron.");
        return;
      }

      // **Format request body sesuai dengan kebutuhan API**
      const formattedData = { peserta_kelas_kuliah_syncs: peserta_kelas_kuliah_syncs.map((peserta_kelas) => ({ id: peserta_kelas.id })) };

      // Buat objek request palsu untuk `syncPesertaKelasKuliahs`
      const fakeSyncReq = {
        body: formattedData,
      };

      // Simulasi response kosong agar tidak mempengaruhi output
      const fakeSyncRes = {
        status: () => ({
          json: () => {},
        }),
      };

      // Panggil fungsi `syncPesertaKelasKuliahs`
      await syncPesertaKelasKuliahs(fakeSyncReq, fakeSyncRes, (error) => {
        if (error) {
          console.error("Error during syncPesertaKelasKuliahs:", error.message);
        }
      });
    }

    console.log("Cronjob singkron peserta kelas kuliah finished");
  } catch (error) {
    console.error("Error saat cronjob singkron peserta kelas kuliah dijalankan:", error.message);
  }
}

module.exports = singkronPesertaKelasKuliah;
