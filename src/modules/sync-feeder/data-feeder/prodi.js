const { Prodi } = require("../../../../models");
const { getToken } = require("../../api-feeder/data-feeder/get-token");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar prodi dari Feeder
async function getProdiFromFeeder() {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetProdi",
      token: token,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar prodi dari database lokal
async function getProdiFromLocal() {
  try {
    return await Prodi.findAll();
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi utama untuk sinkronisasi prodi
async function syncProgramStudi() {
  try {
    const prodiFeeder = await getProdiFromFeeder();
    const prodiLocal = await getProdiFromLocal();

    const localMap = prodiLocal.reduce((map, prodi) => {
      map[prodi.id_feeder] = prodi;
      return map;
    }, {});

    // Sinkronisasi data dari Feeder ke Lokal
    for (let feederProdi of prodiFeeder) {
      if (!localMap[feederProdi.id_prodi]) {
        // Buat entri baru prodi
        await Prodi.create({
          id_prodi: feederProdi.id_prodi,
          kode_program_studi: feederProdi.kode_program_studi,
          nama_program_studi: feederProdi.nama_program_studi,
          status: feederProdi.status,
          id_jenjang_pendidikan: feederProdi.id_jenjang_pendidikan,
          last_sync: new Date(),
          id_feeder: feederProdi.id_prodi,
        });

        console.log(`Data prodi ${feederProdi.nama_program_studi} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localProdi = localMap[feederProdi.id_prodi];

        // mengecek jika terdapat perubahan terbaru dari feeder
        if (
          feederProdi.id_prodi !== localProdi.id_prodi ||
          feederProdi.kode_program_studi !== localProdi.kode_program_studi ||
          feederProdi.nama_program_studi !== localProdi.nama_program_studi ||
          feederProdi.status !== localProdi.status ||
          feederProdi.id_jenjang_pendidikan !== localProdi.id_jenjang_pendidikan
        ) {
          await Prodi.update(
            {
              id_prodi: feederProdi.id_prodi,
              kode_program_studi: feederProdi.kode_program_studi,
              nama_program_studi: feederProdi.nama_program_studi,
              status: feederProdi.status,
              id_jenjang_pendidikan: feederProdi.id_jenjang_pendidikan,
              last_sync: new Date(),
              id_feeder: feederProdi.id_prodi,
            },
            { where: { id_feeder: feederProdi.id_prodi } }
          );

          console.log(`Data prodi ${feederProdi.nama_program_studi} di-update di lokal.`);
        }
      }
    }

    console.log("Sinkronisasi prodi selesai.");
  } catch (error) {
    console.error("Error during syncProgramStudi:", error.message);
    throw error;
  }
}

const syncProdi = async (req, res, next) => {
  try {
    await syncProgramStudi();
    res.status(200).json({ message: "Sinkronisasi prodi berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncProdi,
};
