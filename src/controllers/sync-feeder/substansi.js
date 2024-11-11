const { Substansi } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar substansi dari Feeder
async function getSubstansiFromFeeder() {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetSubstansi",
      token: token,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar substansi dari database lokal
async function getSubstansiFromLocal() {
  try {
    return await Substansi.findAll();
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi utama untuk sinkronisasi substansi
async function syncDataSubstansi() {
  try {
    const substansiFeeder = await getSubstansiFromFeeder();
    const substansiLocal = await getSubstansiFromLocal();

    const localMap = substansiLocal.reduce((map, substansi) => {
      map[substansi.id_feeder] = substansi;
      return map;
    }, {});

    // Sinkronisasi data dari Feeder ke Lokal
    for (let feederSubstansi of substansiFeeder) {
      if (!localMap[feederSubstansi.id_substansi]) {
        // Buat entri baru substansi
        await Substansi.create({
          id_substansi: feederSubstansi.id_substansi,
          nama_substansi: feederSubstansi.nama_substansi,
          sks_mata_kuliah: feederSubstansi.sks_mata_kuliah,
          sks_tatap_muka: feederSubstansi.sks_tatap_muka,
          sks_praktek: feederSubstansi.sks_praktek,
          sks_praktek_lapangan: feederSubstansi.sks_praktek_lapangan,
          sks_simulasi: feederSubstansi.sks_simulasi,
          id_prodi: feederSubstansi.id_prodi,
          id_jenis_substansi: feederSubstansi.id_jenis_substansi,
          last_sync: new Date(),
          id_feeder: feederSubstansi.id_substansi,
        });

        console.log(`Data substansi ${feederSubstansi.nama_substansi} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localSubstansi = localMap[feederSubstansi.id_substansi];

        // mengecek jika terdapat perubahan terbaru dari feeder
        if (
          feederSubstansi.id_substansi !== localSubstansi.id_substansi ||
          feederSubstansi.nama_substansi !== localSubstansi.nama_substansi ||
          feederSubstansi.sks_mata_kuliah !== localSubstansi.sks_mata_kuliah ||
          feederSubstansi.sks_tatap_muka !== localSubstansi.sks_tatap_muka ||
          feederSubstansi.sks_praktek !== localSubstansi.sks_praktek ||
          feederSubstansi.sks_praktek_lapangan !== localSubstansi.sks_praktek_lapangan ||
          feederSubstansi.sks_simulasi !== localSubstansi.sks_simulasi ||
          feederSubstansi.id_prodi !== localSubstansi.id_prodi ||
          feederSubstansi.id_jenis_substansi !== localSubstansi.id_jenis_substansi
        ) {
          await Substansi.update(
            {
              id_substansi: feederSubstansi.id_substansi,
              nama_substansi: feederSubstansi.nama_substansi,
              sks_mata_kuliah: feederSubstansi.sks_mata_kuliah,
              sks_tatap_muka: feederSubstansi.sks_tatap_muka,
              sks_praktek: feederSubstansi.sks_praktek,
              sks_praktek_lapangan: feederSubstansi.sks_praktek_lapangan,
              sks_simulasi: feederSubstansi.sks_simulasi,
              id_prodi: feederSubstansi.id_prodi,
              id_jenis_substansi: feederSubstansi.id_jenis_substansi,
              last_sync: new Date(),
              id_feeder: feederSubstansi.id_substansi,
            },
            { where: { id_feeder: feederSubstansi.id_substansi } }
          );

          console.log(`Data substansi ${feederSubstansi.nama_substansi} di-update di lokal.`);
        }
      }
    }

    console.log("Sinkronisasi substansi selesai.");
  } catch (error) {
    console.error("Error during syncSubstansi:", error.message);
    throw error;
  }
}

const syncSubstansi = async (req, res, next) => {
  try {
    await syncDataSubstansi();
    res.status(200).json({ message: "Sinkronisasi substansi berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncSubstansi,
};
