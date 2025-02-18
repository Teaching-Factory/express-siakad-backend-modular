const { PenugasanDosen } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar penugasan dosen dari Feeder
async function getPenugasanDosenFromFeeder() {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetListPenugasanDosen",
      token: token,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar penugasan dosen dari database lokal
async function getPenugasanDosenFromLocal() {
  try {
    return await PenugasanDosen.findAll();
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi utama untuk sinkronisasi penugasan dosen (get dan update ke lokal)
async function syncDataPenugasanDosen() {
  try {
    const PenugasanDosenFeeder = await getPenugasanDosenFromFeeder();
    const PenugasanDosenLocal = await getPenugasanDosenFromLocal();

    const localMap = PenugasanDosenLocal.reduce((map, penugasan_dosen) => {
      map[penugasan_dosen.id_feeder] = penugasan_dosen;
      return map;
    }, {});

    // Sinkronisasi data dari Feeder ke Lokal (get dan update ke lokal)
    for (let feederPenugasanDosen of PenugasanDosenFeeder) {
      let tanggal_surat_tugas, mulai_surat_tugas;

      //   melakukan pengecekan data tanggal
      if (feederPenugasanDosen.tanggal_surat_tugas != null) {
        const date_start = feederPenugasanDosen.tanggal_surat_tugas.split("-");
        tanggal_surat_tugas = `${date_start[2]}-${date_start[1]}-${date_start[0]}`;
      }

      if (feederPenugasanDosen.mulai_surat_tugas != null) {
        const date_end = feederPenugasanDosen.mulai_surat_tugas.split("-");
        mulai_surat_tugas = `${date_end[2]}-${date_end[1]}-${date_end[0]}`;
      }

      if (!localMap[feederPenugasanDosen.id_registrasi_dosen]) {
        // Buat entri baru penugasan dosen
        await PenugasanDosen.create({
          id_registrasi_dosen: feederPenugasanDosen.id_registrasi_dosen,
          jk: feederPenugasanDosen.jk,
          nomor_surat_tugas: feederPenugasanDosen.nomor_surat_tugas,
          tanggal_surat_tugas: tanggal_surat_tugas,
          mulai_surat_tugas: mulai_surat_tugas,
          tanggal_create: feederPenugasanDosen.tgl_create,
          tanggal_ptk_keluar: feederPenugasanDosen.tgl_ptk_keluar,
          last_sync: new Date(),
          id_feeder: feederPenugasanDosen.id_registrasi_dosen,
          id_dosen: feederPenugasanDosen.id_dosen,
          id_tahun_ajaran: feederPenugasanDosen.id_tahun_ajaran,
          id_perguruan_tinggi: feederPenugasanDosen.id_perguruan_tinggi,
          id_prodi: feederPenugasanDosen.id_prodi,
        });

        console.log(`Data penugasan dosen ${feederPenugasanDosen.id_registrasi_dosen} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localPenugasanDosen = localMap[feederPenugasanDosen.id_registrasi_dosen];

        // mengecek jika terdapat perubahan terbaru dari feeder
        if (
          feederPenugasanDosen.id_registrasi_dosen !== localPenugasanDosen.id_registrasi_dosen ||
          feederPenugasanDosen.jk !== localPenugasanDosen.jk ||
          feederPenugasanDosen.nomor_surat_tugas !== localPenugasanDosen.nomor_surat_tugas ||
          feederPenugasanDosen.tanggal_surat_tugas !== tanggal_surat_tugas ||
          feederPenugasanDosen.mulai_surat_tugas !== mulai_surat_tugas ||
          feederPenugasanDosen.tgl_create !== localPenugasanDosen.tanggal_create ||
          feederPenugasanDosen.tgl_ptk_keluar !== localPenugasanDosen.tanggal_ptk_keluar ||
          feederPenugasanDosen.id_dosen !== localPenugasanDosen.id_dosen ||
          feederPenugasanDosen.id_tahun_ajaran !== localPenugasanDosen.id_tahun_ajaran ||
          feederPenugasanDosen.id_perguruan_tinggi !== localPenugasanDosen.id_perguruan_tinggi ||
          feederPenugasanDosen.id_prodi !== localPenugasanDosen.id_prodi
        ) {
          await PenugasanDosen.update(
            {
              id_registrasi_dosen: feederPenugasanDosen.id_registrasi_dosen,
              jk: feederPenugasanDosen.jk,
              nomor_surat_tugas: feederPenugasanDosen.nomor_surat_tugas,
              tanggal_surat_tugas: tanggal_surat_tugas,
              mulai_surat_tugas: mulai_surat_tugas,
              tanggal_create: feederPenugasanDosen.tgl_create,
              tanggal_ptk_keluar: feederPenugasanDosen.tgl_ptk_keluar,
              last_sync: new Date(),
              id_feeder: feederPenugasanDosen.id_registrasi_dosen,
              id_dosen: feederPenugasanDosen.id_dosen,
              id_tahun_ajaran: feederPenugasanDosen.id_tahun_ajaran,
              id_perguruan_tinggi: feederPenugasanDosen.id_perguruan_tinggi,
              id_prodi: feederPenugasanDosen.id_prodi,
            },
            { where: { id_feeder: feederPenugasanDosen.id_registrasi_dosen } }
          );

          console.log(`Data penugasan dosen ${feederPenugasanDosen.id_registrasi_dosen} di-update di lokal.`);
        }
      }
    }

    console.log("Sinkronisasi penugasan dosen selesai.");
  } catch (error) {
    console.error("Error during syncPenugasanDosen:", error.message);
    throw error;
  }
}

const syncPenugasanDosen = async (req, res, next) => {
  try {
    await syncDataPenugasanDosen();
    res.status(200).json({ message: "Sinkronisasi penugasan dosen berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncPenugasanDosen,
};
