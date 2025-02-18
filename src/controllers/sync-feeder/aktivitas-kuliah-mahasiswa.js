const { AktivitasKuliahMahasiswa } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar aktivitas kuliah mahasiswa dari Feeder
async function getAktivitasKuliahMahasiswaFromFeeder() {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetAktivitasKuliahMahasiswa",
      token: token,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar aktivitas kuliah mahasiswa dari database lokal
async function getAktivitasKuliahMahasiswaFromLocal() {
  try {
    return await AktivitasKuliahMahasiswa.findAll();
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi utama untuk sinkronisasi aktivitas kuliah mahasiswa (get dan update ke lokal)
async function syncDataAktivitasKuliahMahasiswa() {
  try {
    const aktivitasKuliahMahasiswaFeeder = await getAktivitasKuliahMahasiswaFromFeeder();
    const aktivitasKuliahMahasiswaLocal = await getAktivitasKuliahMahasiswaFromLocal();

    const localMap = aktivitasKuliahMahasiswaLocal.reduce((map, aktivitas_kuliah_mahasiswa) => {
      let uniqueKey = `${aktivitas_kuliah_mahasiswa.id_registrasi_mahasiswa}-${aktivitas_kuliah_mahasiswa.id_semester}`;
      map[uniqueKey] = aktivitas_kuliah_mahasiswa;
      return map;
    }, {});

    // Sinkronisasi data dari Feeder ke Lokal (get dan update ke lokal)
    for (let feederAktivitasKuliahMahasiswa of aktivitasKuliahMahasiswaFeeder) {
      let uniqueKey = `${feederAktivitasKuliahMahasiswa.id_registrasi_mahasiswa}-${feederAktivitasKuliahMahasiswa.id_semester}`;

      if (!localMap[uniqueKey]) {
        // Buat entri baru aktivitas kuliah mahasiswa
        await AktivitasKuliahMahasiswa.create({
          angkatan: feederAktivitasKuliahMahasiswa.angkatan,
          ips: feederAktivitasKuliahMahasiswa.ips,
          ipk: feederAktivitasKuliahMahasiswa.ipk,
          sks_semester: feederAktivitasKuliahMahasiswa.sks_semester,
          sks_total: feederAktivitasKuliahMahasiswa.sks_total,
          biaya_kuliah_smt: feederAktivitasKuliahMahasiswa.biaya_kuliah_smt,
          id_registrasi_mahasiswa: feederAktivitasKuliahMahasiswa.id_registrasi_mahasiswa,
          id_semester: feederAktivitasKuliahMahasiswa.id_semester,
          id_prodi: feederAktivitasKuliahMahasiswa.id_prodi,
          id_status_mahasiswa: feederAktivitasKuliahMahasiswa.id_status_mahasiswa,
        });

        console.log(`Data aktivitas kuliah mahasiswa ${feederAktivitasKuliahMahasiswa.id_registrasi_mahasiswa}-${feederAktivitasKuliahMahasiswa.id_semester} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localAktivitasKuliahMahasiswa = localMap[uniqueKey];

        // mengecek jika terdapat perubahan terbaru dari feeder
        if (
          feederAktivitasKuliahMahasiswa.angkatan !== localAktivitasKuliahMahasiswa.angkatan ||
          feederAktivitasKuliahMahasiswa.ips !== localAktivitasKuliahMahasiswa.ips ||
          feederAktivitasKuliahMahasiswa.ipk !== localAktivitasKuliahMahasiswa.ipk ||
          feederAktivitasKuliahMahasiswa.sks_semester !== localAktivitasKuliahMahasiswa.sks_semester ||
          feederAktivitasKuliahMahasiswa.sks_total !== localAktivitasKuliahMahasiswa.sks_total ||
          feederAktivitasKuliahMahasiswa.biaya_kuliah_smt !== localAktivitasKuliahMahasiswa.biaya_kuliah_smt ||
          feederAktivitasKuliahMahasiswa.id_registrasi_mahasiswa !== localAktivitasKuliahMahasiswa.id_registrasi_mahasiswa ||
          feederAktivitasKuliahMahasiswa.id_semester !== localAktivitasKuliahMahasiswa.id_semester ||
          feederAktivitasKuliahMahasiswa.id_prodi !== localAktivitasKuliahMahasiswa.id_prodi ||
          feederAktivitasKuliahMahasiswa.id_status_mahasiswa !== localAktivitasKuliahMahasiswa.id_status_mahasiswa
        ) {
          await AktivitasKuliahMahasiswa.update(
            {
              angkatan: feederAktivitasKuliahMahasiswa.angkatan,
              ips: feederAktivitasKuliahMahasiswa.ips,
              ipk: feederAktivitasKuliahMahasiswa.ipk,
              sks_semester: feederAktivitasKuliahMahasiswa.sks_semester,
              sks_total: feederAktivitasKuliahMahasiswa.sks_total,
              biaya_kuliah_smt: feederAktivitasKuliahMahasiswa.biaya_kuliah_smt,
              id_registrasi_mahasiswa: feederAktivitasKuliahMahasiswa.id_registrasi_mahasiswa,
              id_semester: feederAktivitasKuliahMahasiswa.id_semester,
              id_prodi: feederAktivitasKuliahMahasiswa.id_prodi,
              id_status_mahasiswa: feederAktivitasKuliahMahasiswa.id_status_mahasiswa,
            },
            {
              where: {
                id_registrasi_mahasiswa: feederAktivitasKuliahMahasiswa.id_registrasi_mahasiswa,
                id_semester: feederAktivitasKuliahMahasiswa.id_semester,
              },
            }
          );

          console.log(`Data aktivitas kuliah mahasiswa ${feederAktivitasKuliahMahasiswa.id_registrasi_mahasiswa}-${feederAktivitasKuliahMahasiswa.id_semester} di-update di lokal.`);
        }
      }
    }

    console.log("Sinkronisasi aktivitas kuliah mahasiswa selesai.");
  } catch (error) {
    console.error("Error during syncAktivitasKuliahMahasiswa:", error.message);
    throw error;
  }
}

const syncAktivitasKuliahMahasiswa = async (req, res, next) => {
  try {
    await syncDataAktivitasKuliahMahasiswa();
    res.status(200).json({ message: "Sinkronisasi aktivitas kuliah mahasiswa berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncAktivitasKuliahMahasiswa,
};
