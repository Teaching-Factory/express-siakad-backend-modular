const { Kurikulum } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar kurikulum dari Feeder
async function getKurikulumFromFeeder() {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetKurikulum",
      token: token,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar kurikulum dari database lokal
async function getKurikulumFromLocal() {
  try {
    return await Kurikulum.findAll();
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi utama untuk sinkronisasi kurikulum
async function syncDataKurikulum() {
  try {
    const kurikulumFeeder = await getKurikulumFromFeeder();
    const kurikulumLocal = await getKurikulumFromLocal();

    const localMap = kurikulumLocal.reduce((map, kurikulum) => {
      map[kurikulum.id_feeder] = kurikulum;
      return map;
    }, {});

    // Sinkronisasi data dari Feeder ke Lokal
    for (let feederKurikulum of kurikulumFeeder) {
      if (!localMap[feederKurikulum.id_kurikulum]) {
        // Buat entri baru kurikulum
        await Kurikulum.create({
          id_kurikulum: feederKurikulum.id_kurikulum,
          nama_kurikulum: feederKurikulum.nama_kurikulum,
          semester_mulai_berlaku: feederKurikulum.semester_mulai_berlaku,
          jumlah_sks_lulus: feederKurikulum.jumlah_sks_lulus,
          jumlah_sks_wajib: feederKurikulum.jumlah_sks_wajib,
          jumlah_sks_pilihan: feederKurikulum.jumlah_sks_pilihan,
          jumlah_sks_mata_kuliah_wajib: feederKurikulum.jumlah_sks_mata_kuliah_wajib,
          jumlah_sks_mata_kuliah_pilihan: feederKurikulum.jumlah_sks_mata_kuliah_pilihan,
          id_prodi: feederKurikulum.id_prodi,
          id_semester: feederKurikulum.id_semester,
          last_sync: new Date(),
          id_feeder: feederKurikulum.id_kurikulum,
        });

        console.log(`Data kurikulum ${feederKurikulum.nama_kurikulum} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localKurikulum = localMap[feederKurikulum.id_kurikulum];

        // mengecek jika terdapat perubahan terbaru dari feeder
        if (
          feederKurikulum.id_kurikulum !== localKurikulum.id_kurikulum ||
          feederKurikulum.nama_kurikulum !== localKurikulum.nama_kurikulum ||
          feederKurikulum.semester_mulai_berlaku !== localKurikulum.semester_mulai_berlaku ||
          feederKurikulum.jumlah_sks_lulus !== localKurikulum.jumlah_sks_lulus ||
          feederKurikulum.jumlah_sks_wajib !== localKurikulum.jumlah_sks_wajib ||
          feederKurikulum.jumlah_sks_pilihan !== localKurikulum.jumlah_sks_pilihan ||
          feederKurikulum.jumlah_sks_mata_kuliah_wajib !== localKurikulum.jumlah_sks_mata_kuliah_wajib ||
          feederKurikulum.jumlah_sks_mata_kuliah_pilihan !== localKurikulum.jumlah_sks_mata_kuliah_pilihan ||
          feederKurikulum.id_prodi !== localKurikulum.id_prodi ||
          feederKurikulum.id_semester !== localKurikulum.id_semester
        ) {
          await Kurikulum.update(
            {
              id_kurikulum: feederKurikulum.id_kurikulum,
              nama_kurikulum: feederKurikulum.nama_kurikulum,
              semester_mulai_berlaku: feederKurikulum.semester_mulai_berlaku,
              jumlah_sks_lulus: feederKurikulum.jumlah_sks_lulus,
              jumlah_sks_wajib: feederKurikulum.jumlah_sks_wajib,
              jumlah_sks_pilihan: feederKurikulum.jumlah_sks_pilihan,
              jumlah_sks_mata_kuliah_wajib: feederKurikulum.jumlah_sks_mata_kuliah_wajib,
              jumlah_sks_mata_kuliah_pilihan: feederKurikulum.jumlah_sks_mata_kuliah_pilihan,
              id_prodi: feederKurikulum.id_prodi,
              id_semester: feederKurikulum.id_semester,
              last_sync: new Date(),
              id_feeder: feederKurikulum.id_kurikulum,
            },
            { where: { id_feeder: feederKurikulum.id_kurikulum } }
          );

          console.log(`Data kurikulum ${feederKurikulum.nama_kurikulum} di-update di lokal.`);
        }
      }
    }

    console.log("Sinkronisasi kurikulum selesai.");
  } catch (error) {
    console.error("Error during syncKurikulum:", error.message);
    throw error;
  }
}

const syncKurikulum = async (req, res, next) => {
  try {
    await syncDataKurikulum();
    res.status(200).json({ message: "Sinkronisasi kurikulum berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncKurikulum,
};
