const { MatkulKurikulum } = require("../../../../models");
const { getToken } = require("../../api-feeder/data-feeder/get-token");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar matkul kurikulum dari Feeder
async function getMatkulKurikulumFromFeeder() {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetMatkulKurikulum",
      token: token,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar matkul kurikulum dari database lokal
async function getMatkulKurikulumFromLocal() {
  try {
    return await MatkulKurikulum.findAll();
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi utama untuk sinkronisasi matkul kurikulum (get dan update ke lokal)
async function syncDataMatkulKurikulum() {
  try {
    const matkulKurikulumFeeder = await getMatkulKurikulumFromFeeder();
    const matkulKurikulumLocal = await getMatkulKurikulumFromLocal();

    const localMap = matkulKurikulumLocal.reduce((map, matkul_kurikulum) => {
      let uniqueKey = `${matkul_kurikulum.id_kurikulum}-${matkul_kurikulum.id_matkul}`;
      map[uniqueKey] = matkul_kurikulum;
      return map;
    }, {});

    let tanggal_dibuat;

    // Sinkronisasi data dari Feeder ke Lokal (get dan update ke lokal)
    for (let feederMatkulKurikulum of matkulKurikulumFeeder) {
      let uniqueKey = `${feederMatkulKurikulum.id_kurikulum}-${feederMatkulKurikulum.id_matkul}`;

      tanggal_dibuat = null;

      //   melakukan pengecekan data tanggal
      if (feederMatkulKurikulum.tgl_create != null) {
        const date_create = feederMatkulKurikulum.tgl_create.split("-");
        tanggal_dibuat = `${date_create[2]}-${date_create[1]}-${date_create[0]}`;
      }

      if (!localMap[uniqueKey]) {
        // Buat entri baru matkul kurikulum
        await MatkulKurikulum.create({
          semester: feederMatkulKurikulum.semester,
          apakah_wajib: feederMatkulKurikulum.apakah_wajib,
          tgl_create: tanggal_dibuat,
          id_kurikulum: feederMatkulKurikulum.id_kurikulum,
          id_matkul: feederMatkulKurikulum.id_matkul,
        });

        console.log(`Data matkul kurikulum ${feederMatkulKurikulum.id_kurikulum}-${feederMatkulKurikulum.id_matkul} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localMatkulKurikulum = localMap[uniqueKey];

        // mengecek jika terdapat perubahan terbaru dari feeder
        if (
          feederMatkulKurikulum.semester !== localMatkulKurikulum.semester ||
          feederMatkulKurikulum.apakah_wajib !== localMatkulKurikulum.apakah_wajib ||
          feederMatkulKurikulum.tgl_create !== tanggal_dibuat ||
          feederMatkulKurikulum.id_kurikulum !== localMatkulKurikulum.id_kurikulum ||
          feederMatkulKurikulum.id_matkul !== localMatkulKurikulum.id_matkul
        ) {
          await MatkulKurikulum.update(
            {
              semester: feederMatkulKurikulum.semester,
              apakah_wajib: feederMatkulKurikulum.apakah_wajib,
              tgl_create: tanggal_dibuat,
              id_kurikulum: feederMatkulKurikulum.id_kurikulum,
              id_matkul: feederMatkulKurikulum.id_matkul,
            },
            {
              where: {
                id_kurikulum: feederMatkulKurikulum.id_kurikulum,
                id_matkul: feederMatkulKurikulum.id_matkul,
              },
            }
          );

          console.log(`Data matkul kurikulum ${feederMatkulKurikulum.id_kurikulum}-${feederMatkulKurikulum.id_matkul} di-update di lokal.`);
        }
      }
    }

    console.log("Sinkronisasi matkul kurikulum selesai.");
  } catch (error) {
    console.error("Error during syncMatkulKurikulum:", error.message);
    throw error;
  }
}

const syncMatkulKurikulum = async (req, res, next) => {
  try {
    await syncDataMatkulKurikulum();
    res.status(200).json({ message: "Sinkronisasi matkul kurikulum berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncMatkulKurikulum,
};
