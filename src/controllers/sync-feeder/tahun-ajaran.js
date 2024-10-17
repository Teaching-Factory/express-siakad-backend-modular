const { TahunAjaran } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar tahun ajaran dari Feeder
async function getTahunAjaranFromFeeder() {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetTahunAjaran",
      token: token,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar tahun ajaran dari database lokal
async function getTahunAjaranFromLocal() {
  try {
    return await TahunAjaran.findAll();
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi utama untuk sinkronisasi tahun ajaran
async function syncTahunAjar() {
  try {
    const tahunAjaranFeeder = await getTahunAjaranFromFeeder();
    const tahunAjaranLocal = await getTahunAjaranFromLocal();

    const localMap = tahunAjaranLocal.reduce((map, tahun_ajaran) => {
      map[tahun_ajaran.id_tahun_ajaran] = tahun_ajaran;
      return map;
    }, {});

    // Sinkronisasi data dari Feeder ke Lokal
    for (let feederTahunAjaran of tahunAjaranFeeder) {
      if (!localMap[feederTahunAjaran.id_tahun_ajaran]) {
        // Buat entri baru tahun ajaran
        await TahunAjaran.create({
          id_tahun_ajaran: feederTahunAjaran.id_tahun_ajaran,
          nama_tahun_ajaran: feederTahunAjaran.nama_tahun_ajaran,
          a_periode: feederTahunAjaran.a_periode_aktif,
          tanggal_mulai: feederTahunAjaran.tanggal_mulai,
          tanggal_selesai: feederTahunAjaran.tanggal_selesai,
        });

        console.log(`Data tahun ajaran ${feederTahunAjaran.nama_tahun_ajaran} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localTahunAjaran = localMap[feederTahunAjaran.id_tahun_ajaran];

        // mengecek jika terdapat perubahan terbaru dari feeder
        if (
          feederTahunAjaran.id_tahun_ajaran !== localTahunAjaran.id_tahun_ajaran ||
          feederTahunAjaran.nama_tahun_ajaran !== localTahunAjaran.nama_tahun_ajaran ||
          feederTahunAjaran.a_periode_aktif !== localTahunAjaran.a_periode ||
          feederTahunAjaran.tanggal_mulai !== localTahunAjaran.tanggal_mulai ||
          feederTahunAjaran.tanggal_selesai !== localTahunAjaran.tanggal_selesai
        ) {
          await TahunAjaran.update(
            {
              id_tahun_ajaran: feederTahunAjaran.id_tahun_ajaran,
              nama_tahun_ajaran: feederTahunAjaran.nama_tahun_ajaran,
              a_periode: feederTahunAjaran.a_periode_aktif,
              tanggal_mulai: feederTahunAjaran.tanggal_mulai,
              tanggal_selesai: feederTahunAjaran.tanggal_selesai,
            },
            { where: { id_tahun_ajaran: feederTahunAjaran.id_tahun_ajaran } }
          );

          console.log(`Data tahun ajaran ${feederTahunAjaran.nama_tahun_ajaran} di-update di lokal.`);
        }
      }
    }

    console.log("Sinkronisasi tahun ajaran selesai.");
  } catch (error) {
    console.error("Error during syncTahunAjaran:", error.message);
    throw error;
  }
}

const syncTahunAjaran = async (req, res, next) => {
  try {
    await syncTahunAjar();
    res.status(200).json({ message: "Sinkronisasi tahun ajaran berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncTahunAjaran,
};
