const { MataKuliah } = require("../../../../models");
const { getToken } = require("../../api-feeder/data-feeder/get-token");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar mata kuliah dari Feeder
async function getMataKuliahFromFeeder() {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetListMataKuliah",
      token: token,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar mata kuliah dari database lokal
async function getMataKuliahFromLocal() {
  try {
    return await MataKuliah.findAll();
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi utama untuk sinkronisasi mata kuliah
async function syncDataMataKuliah() {
  try {
    const mataKuliahFeeder = await getMataKuliahFromFeeder();
    const mataKuliahLocal = await getMataKuliahFromLocal();

    const localMap = mataKuliahLocal.reduce((map, mata_kuliah) => {
      map[mata_kuliah.id_feeder] = mata_kuliah;
      return map;
    }, {});

    // Sinkronisasi data dari Feeder ke Lokal
    for (let feederMataKuliah of mataKuliahFeeder) {
      if (!localMap[feederMataKuliah.id_matkul]) {
        // Buat entri baru mata kuliah
        await MataKuliah.create({
          id_matkul: feederMataKuliah.id_matkul,
          tgl_create: feederMataKuliah.tgl_create,
          jenis_mk: feederMataKuliah.jns_mk,
          kel_mk: feederMataKuliah.kel_mk,
          kode_mata_kuliah: feederMataKuliah.kode_mata_kuliah,
          nama_mata_kuliah: feederMataKuliah.nama_mata_kuliah,
          sks_mata_kuliah: feederMataKuliah.sks_mata_kuliah,
          id_jenis_mata_kuliah: feederMataKuliah.id_jenis_mata_kuliah,
          id_kelompok_mata_kuliah: feederMataKuliah.id_kelompok_mata_kuliah,
          sks_tatap_muka: feederMataKuliah.sks_tatap_muka,
          sks_praktek_lapangan: feederMataKuliah.sks_praktek_lapangan,
          sks_simulasi: feederMataKuliah.sks_simulasi,
          metode_kuliah: feederMataKuliah.metode_kuliah,
          ada_sap: feederMataKuliah.ada_sap,
          ada_silabus: feederMataKuliah.ada_silabus,
          ada_bahan_ajar: feederMataKuliah.ada_bahan_ajar,
          ada_acara_praktek: feederMataKuliah.ada_acara_praktek,
          ada_diktat: feederMataKuliah.ada_diktat,
          tanggal_mulai_efektif: feederMataKuliah.tanggal_mulai_efektif,
          tanggal_selesai_efektif: feederMataKuliah.tanggal_selesai_efektif,
          id_prodi: feederMataKuliah.id_prodi,
          last_sync: new Date(),
          id_feeder: feederMataKuliah.id_matkul,
        });

        console.log(`Data mata kuliah ${feederMataKuliah.nama_mata_kuliah} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localMataKuliah = localMap[feederMataKuliah.id_matkul];

        // mengecek jika terdapat perubahan terbaru dari feeder
        if (
          feederMataKuliah.id_matkul !== localMataKuliah.id_matkul ||
          feederMataKuliah.tgl_create !== localMataKuliah.tgl_create ||
          feederMataKuliah.jns_mk !== localMataKuliah.jns_mk ||
          feederMataKuliah.kel_mk !== localMataKuliah.kel_mk ||
          feederMataKuliah.kode_mata_kuliah !== localMataKuliah.kode_mata_kuliah ||
          feederMataKuliah.nama_mata_kuliah !== localMataKuliah.nama_mata_kuliah ||
          feederMataKuliah.sks_mata_kuliah !== localMataKuliah.sks_mata_kuliah ||
          feederMataKuliah.id_jenis_mata_kuliah !== localMataKuliah.id_jenis_mata_kuliah ||
          feederMataKuliah.id_kelompok_mata_kuliah !== localMataKuliah.id_kelompok_mata_kuliah ||
          feederMataKuliah.sks_tatap_muka !== localMataKuliah.sks_tatap_muka ||
          feederMataKuliah.sks_praktek_lapangan !== localMataKuliah.sks_praktek_lapangan ||
          feederMataKuliah.sks_simulasi !== localMataKuliah.sks_simulasi ||
          feederMataKuliah.metode_kuliah !== localMataKuliah.metode_kuliah ||
          feederMataKuliah.ada_sap !== localMataKuliah.ada_sap ||
          feederMataKuliah.ada_silabus !== localMataKuliah.ada_silabus ||
          feederMataKuliah.ada_bahan_ajar !== localMataKuliah.ada_bahan_ajar ||
          feederMataKuliah.ada_acara_praktek !== localMataKuliah.ada_acara_praktek ||
          feederMataKuliah.ada_diktat !== localMataKuliah.ada_diktat ||
          feederMataKuliah.tanggal_mulai_efektif !== localMataKuliah.tanggal_mulai_efektif ||
          feederMataKuliah.tanggal_selesai_efektif !== localMataKuliah.tanggal_selesai_efektif ||
          feederMataKuliah.id_prodi !== localMataKuliah.id_prodi
        ) {
          await MataKuliah.update(
            {
              id_matkul: feederMataKuliah.id_matkul,
              tgl_create: feederMataKuliah.tgl_create,
              jenis_mk: feederMataKuliah.jns_mk,
              kel_mk: feederMataKuliah.kel_mk,
              kode_mata_kuliah: feederMataKuliah.kode_mata_kuliah,
              nama_mata_kuliah: feederMataKuliah.nama_mata_kuliah,
              sks_mata_kuliah: feederMataKuliah.sks_mata_kuliah,
              id_jenis_mata_kuliah: feederMataKuliah.id_jenis_mata_kuliah,
              id_kelompok_mata_kuliah: feederMataKuliah.id_kelompok_mata_kuliah,
              sks_tatap_muka: feederMataKuliah.sks_tatap_muka,
              sks_praktek_lapangan: feederMataKuliah.sks_praktek_lapangan,
              sks_simulasi: feederMataKuliah.sks_simulasi,
              metode_kuliah: feederMataKuliah.metode_kuliah,
              ada_sap: feederMataKuliah.ada_sap,
              ada_silabus: feederMataKuliah.ada_silabus,
              ada_bahan_ajar: feederMataKuliah.ada_bahan_ajar,
              ada_acara_praktek: feederMataKuliah.ada_acara_praktek,
              ada_diktat: feederMataKuliah.ada_diktat,
              tanggal_mulai_efektif: feederMataKuliah.tanggal_mulai_efektif,
              tanggal_selesai_efektif: feederMataKuliah.tanggal_selesai_efektif,
              id_prodi: feederMataKuliah.id_prodi,
              last_sync: new Date(),
              id_feeder: feederMataKuliah.id_matkul,
            },
            { where: { id_feeder: feederMataKuliah.id_matkul } }
          );

          console.log(`Data mata kuliah ${feederMataKuliah.nama_mata_kuliah} di-update di lokal.`);
        }
      }
    }

    console.log("Sinkronisasi mata kuliah selesai.");
  } catch (error) {
    console.error("Error during syncMataKuliah:", error.message);
    throw error;
  }
}

const syncListMataKuliah = async (req, res, next) => {
  try {
    await syncDataMataKuliah();
    res.status(200).json({ message: "Sinkronisasi mata kuliah berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncListMataKuliah,
};
