const { DetailKurikulum } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar detail kurikulum dari Feeder
async function getDetailKurikulumFromFeeder() {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetDetailKurikulum",
      token: token,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar detail kurikulum dari database lokal
async function getDetailKurikulumFromLocal() {
  try {
    return await DetailKurikulum.findAll();
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi utama untuk sinkronisasi detail kurikulum (get dan update ke lokal)
async function syncDataDetailKurikulum() {
  try {
    const detailKurikulumFeeder = await getDetailKurikulumFromFeeder();
    const detailKurikulumLocal = await getDetailKurikulumFromLocal();

    const localMap = detailKurikulumLocal.reduce((map, detail_kurikulum) => {
      map[detail_kurikulum.id_kurikulum] = detail_kurikulum;
      return map;
    }, {});

    // Sinkronisasi data dari Feeder ke Lokal (get dan update ke lokal)
    for (let feederDetailKurikulum of detailKurikulumFeeder) {
      if (!localMap[feederDetailKurikulum.id_kurikulum]) {
        // Buat entri baru detail kurikulum
        await DetailKurikulum.create({
          sks_wajib: feederDetailKurikulum.jumlah_sks_wajib,
          sks_pilihan: feederDetailKurikulum.jumlah_sks_pilihan,
          id_kurikulum: feederDetailKurikulum.id_kurikulum,
        });

        console.log(`Data detail kurikulum ${feederDetailKurikulum.id_kurikulum} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localDetailKurikulum = localMap[feederDetailKurikulum.id_kurikulum];

        // mengecek jika terdapat perubahan terbaru dari feeder
        if (
          feederDetailKurikulum.jumlah_sks_wajib !== localDetailKurikulum.sks_wajib ||
          feederDetailKurikulum.jumlah_sks_pilihan !== localDetailKurikulum.sks_pilihan ||
          feederDetailKurikulum.id_kurikulum !== localDetailKurikulum.id_kurikulum
        ) {
          await DetailKurikulum.update(
            {
              sks_wajib: feederDetailKurikulum.jumlah_sks_wajib,
              sks_pilihan: feederDetailKurikulum.jumlah_sks_pilihan,
              id_kurikulum: feederDetailKurikulum.id_kurikulum,
            },
            { where: { id_kurikulum: feederDetailKurikulum.id_kurikulum } }
          );

          console.log(`Data detail kurikulum ${feederDetailKurikulum.id_kurikulum} di-update di lokal.`);
        }
      }
    }

    console.log("Sinkronisasi detail kurikulum selesai.");
  } catch (error) {
    console.error("Error during syncDetailKurikulum:", error.message);
    throw error;
  }
}

const syncDetailKurikulum = async (req, res, next) => {
  try {
    await syncDataDetailKurikulum();
    res.status(200).json({ message: "Sinkronisasi detail kurikulum berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncDetailKurikulum,
};
