const { KelasKuliah } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar kelas kuliah dari Feeder
async function getKelasKuliahFromFeeder(semesterId, req, res, next) {
  try {
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetListKelasKuliah",
      token: token,
      filter: `id_semester='${semesterId}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar kelas kuliah dari database lokal
async function getKelasKuliahFromLocal(semesterId, req, res, next) {
  try {
    return await KelasKuliah.findAll({
      where: {
        id_semester: semesterId,
      },
    });
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi untuk menambah data kelas kuliah ke Feeder
async function createKelasKuliahToFeeder(kelas) {
  try {
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "InsertKelasKuliah",
      token: token,
      data: {
        id_kelas_kuliah: kelas.id_kelas_kuliah,
        nama_kelas_kuliah: kelas.nama_kelas_kuliah,
        sks: kelas.sks,
        jumlah_mahasiswa: kelas.jumlah_mahasiswa,
        apa_untuk_pditt: kelas.apa_untuk_pditt,
        id_prodi: kelas.id_prodi,
        id_semester: kelas.id_semester,
        id_matkul: kelas.id_matkul,
        id_dosen: kelas.id_dosen,
      },
    };

    await axios.post(url_feeder, requestBody);
    console.log(`Data kelas kuliah ${kelas.nama_kelas_kuliah} ditambahkan ke Feeder.`);
  } catch (error) {
    console.error("Error inserting data to Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk menghapus kelas kuliah dari Feeder
async function deleteKelasKuliahFromFeeder(id_kelas_kuliah) {
  try {
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "DeleteKelasKuliah",
      token: token,
      key: `id_kelas_kuliah='${id_kelas_kuliah}'`,
    };

    await axios.post(url_feeder, requestBody);
    console.log(`Kelas kuliah dengan ID ${id_kelas_kuliah} dihapus dari Feeder.`);
  } catch (error) {
    console.error("Error deleting data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi utama untuk sinkronisasi kelas kuliah (belum selesai)
async function syncDataKelasKuliah(req, res, next) {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    const kelasFeeder = await getKelasKuliahFromFeeder(semesterId);
    const kelasLocal = await getKelasKuliahFromLocal(semesterId);

    const localMap = kelasLocal.reduce((map, kelas) => {
      map[kelas.id_kelas_kuliah] = kelas;
      return map;
    }, {});

    const feederMap = kelasFeeder.reduce((map, kelas) => {
      map[kelas.id_kelas_kuliah] = kelas;
      return map;
    }, {});

    // Sinkronisasi dari Feeder ke Lokal (Create/Update)
    for (let feederKelas of kelasFeeder) {
      if (!localMap[feederKelas.id_kelas_kuliah]) {
        // Buat entri baru di lokal
        await KelasKuliah.create({
          id_kelas_kuliah: feederKelas.id_kelas_kuliah,
          nama_kelas_kuliah: feederKelas.nama_kelas_kuliah,
          sks: feederKelas.sks,
          jumlah_mahasiswa: feederKelas.jumlah_mahasiswa,
          apa_untuk_pditt: feederKelas.apa_untuk_pditt,
          lingkup: feederKelas.lingkup,
          mode: feederKelas.mode,
          id_prodi: feederKelas.id_prodi,
          id_semester: feederKelas.id_semester,
          id_matkul: feederKelas.id_matkul,
          id_dosen: feederKelas.id_dosen,
        });

        console.log(`Data kelas kuliah ${feederKelas.nama_kelas_kuliah} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localKelas = localMap[feederKelas.id_kelas_kuliah];

        if (
          feederKelas.nama_kelas_kuliah !== localKelas.nama_kelas_kuliah
          // tambahkan properti lain yang ingin di-update
        ) {
          await KelasKuliah.update(
            {
              id_kelas_kuliah: feederKelas.id_kelas_kuliah,
              nama_kelas_kuliah: feederKelas.nama_kelas_kuliah,
              sks: feederKelas.sks,
              jumlah_mahasiswa: feederKelas.jumlah_mahasiswa,
              apa_untuk_pditt: feederKelas.apa_untuk_pditt,
              lingkup: feederKelas.lingkup,
              mode: feederKelas.mode,
              id_prodi: feederKelas.id_prodi,
              id_semester: feederKelas.id_semester,
              id_matkul: feederKelas.id_matkul,
              id_dosen: feederKelas.id_dosen,
            },
            { where: { id_kelas_kuliah: feederKelas.id_kelas_kuliah } }
          );

          console.log(`Data kelas kuliah ${feederKelas.nama_kelas_kuliah} di-update di lokal.`);
        }
      }
    }

    // Sinkronisasi dari Lokal ke Feeder (Create/Update/Delete)
    for (let localKelas of kelasLocal) {
      if (!feederMap[localKelas.id_kelas_kuliah]) {
        // Tambahkan ke Feeder jika tidak ada di Feeder
        await createKelasKuliahToFeeder(localKelas);
        console.log("Kelas berhasil ditambahkan dari local ke feeder");
      } else {
        // Jika ada di Feeder, pastikan data lokal up-to-date
        const feederKelas = feederMap[localKelas.id_kelas_kuliah];

        if (
          localKelas.nama_kelas_kuliah !== feederKelas.nama_kelas_kuliah
          // tambahkan properti lain yang ingin di-update di Feeder
        ) {
          const { token, url_feeder } = await getToken();

          // Update ke Feeder
          const requestBody = {
            act: "UpdateKelasKuliah",
            token: token,
            key: `id_kelas_kuliah='${localKelas.id_kelas_kuliah}'`,
            record: {
              nama_kelas_kuliah: localKelas.nama_kelas_kuliah,
              sks: localKelas.sks,
              jumlah_mahasiswa: localKelas.jumlah_mahasiswa,
              apa_untuk_pditt: localKelas.apa_untuk_pditt,
              lingkup: localKelas.lingkup,
              mode: localKelas.mode,
              id_prodi: localKelas.id_prodi,
              id_semester: localKelas.id_semester,
              id_matkul: localKelas.id_matkul,
              id_dosen: localKelas.id_dosen,
            },
          };

          await axios.post(url_feeder, requestBody);
          console.log(`Data kelas kuliah ${localKelas.nama_kelas_kuliah} di-update di Feeder.`);
        }
      }
    }

    // // Hapus data lokal yang tidak ada di Feeder
    // for (let localKelas of kelasLocal) {
    //   if (!feederMap[localKelas.id_kelas_kuliah]) {
    //     await deleteKelasKuliahFromFeeder(localKelas.id_kelas_kuliah);
    //     await localKelas.destroy();
    //     console.log(`Data kelas kuliah ${localKelas.nama_kelas_kuliah} dihapus dari lokal karena tidak ada di Feeder.`);
    //   }
    // }

    console.log("Sinkronisasi kelas kuliah selesai.");
  } catch (error) {
    console.error("Error during syncKelasKuliah:", error.message);
    throw error;
  }
}

const syncKelasKuliah = async (req, res, next) => {
  try {
    await syncDataKelasKuliah(req, res, next);
    res.status(200).json({ message: "Sinkronisasi kelas kuliah berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncKelasKuliah,
};
