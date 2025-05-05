const { PeriodePerkuliahan } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar periode perkuliahan dari Feeder
async function getPeriodePerkuliahanFromFeeder() {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetListPeriodePerkuliahan",
      token: token,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar periode perkuliahan dari database lokal
async function getPeriodePerkuliahanFromLocal() {
  try {
    return await PeriodePerkuliahan.findAll();
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi utama untuk sinkronisasi periode perkuliahan (get dan update ke lokal)
async function syncDataPeriodePerkuliahan() {
  try {
    const periodePerkuliahanFeeder = await getPeriodePerkuliahanFromFeeder();
    const periodePerkuliahanLocal = await getPeriodePerkuliahanFromLocal();

    const localMap = periodePerkuliahanLocal.reduce((map, periode_perkuliahan) => {
      let uniqueKey = `${periode_perkuliahan.id_prodi}-${periode_perkuliahan.id_semester}`;
      map[uniqueKey] = periode_perkuliahan;
      return map;
    }, {});

    let tanggal_mulai, tanggal_akhir, tanggal_dibuat, tanggal_update;

    // Sinkronisasi data dari Feeder ke Lokal (get dan update ke lokal)
    for (let feederPeriodePerkuliahan of periodePerkuliahanFeeder) {
      let uniqueKey = `${feederPeriodePerkuliahan.id_prodi}-${feederPeriodePerkuliahan.id_semester}`;

      tanggal_mulai = null;
      tanggal_akhir = null;
      tanggal_dibuat = null;
      tanggal_update = null;

      //   melakukan pengecekan data tanggal
      if (feederPeriodePerkuliahan.tanggal_awal_perkuliahan != null) {
        const date_start = feederPeriodePerkuliahan.tanggal_awal_perkuliahan.split("-");
        tanggal_mulai = `${date_start[2]}-${date_start[1]}-${date_start[0]}`;
      }

      if (feederPeriodePerkuliahan.tanggal_akhir_perkuliahan != null) {
        const date_end = feederPeriodePerkuliahan.tanggal_akhir_perkuliahan.split("-");
        tanggal_akhir = `${date_end[2]}-${date_end[1]}-${date_end[0]}`;
      }

      if (feederPeriodePerkuliahan.tgl_create != null) {
        const date_create = feederPeriodePerkuliahan.tgl_create.split("-");
        tanggal_dibuat = `${date_create[2]}-${date_create[1]}-${date_create[0]}`;
      }

      if (feederPeriodePerkuliahan.tanggal_update != null) {
        const date_update = feederPeriodePerkuliahan.tanggal_update.split("-");
        tanggal_update = `${date_update[2]}-${date_update[1]}-${date_update[0]}`;
      }

      if (!localMap[uniqueKey]) {
        // Buat entri baru periode perkuliahan
        await PeriodePerkuliahan.create({
          jumlah_target_mahasiswa_baru: feederPeriodePerkuliahan.jumlah_target_mahasiswa_baru,
          tanggal_awal_perkuliahan: tanggal_mulai,
          tanggal_akhir_perkuliahan: tanggal_akhir,
          calon_ikut_seleksi: feederPeriodePerkuliahan.calon_ikut_seleksi,
          calon_lulus_seleksi: feederPeriodePerkuliahan.calon_lulus_seleksi,
          daftar_sbg_mhs: feederPeriodePerkuliahan.daftar_sbg_mhs,
          pst_undur_diri: feederPeriodePerkuliahan.pst_undur_diri,
          jml_mgu_kul: feederPeriodePerkuliahan.jml_mgu_kul,
          metode_kul: feederPeriodePerkuliahan.metode_kul,
          metode_kul_eks: feederPeriodePerkuliahan.metode_kul_eks,
          tgl_create: tanggal_dibuat,
          last_update: tanggal_update,
          id_prodi: feederPeriodePerkuliahan.id_prodi,
          id_semester: feederPeriodePerkuliahan.id_semester,
        });

        console.log(`Data periode perkuliahan ${feederPeriodePerkuliahan.id_prodi}-${feederPeriodePerkuliahan.id_semester} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localPeriodePerkuliahan = localMap[uniqueKey];

        // mengecek jika terdapat perubahan terbaru dari feeder
        if (
          feederPeriodePerkuliahan.jumlah_target_mahasiswa_baru !== localPeriodePerkuliahan.jumlah_target_mahasiswa_baru ||
          feederPeriodePerkuliahan.tanggal_awal_perkuliahan !== tanggal_mulai ||
          feederPeriodePerkuliahan.tanggal_akhir_perkuliahan !== tanggal_akhir ||
          feederPeriodePerkuliahan.calon_ikut_seleksi !== localPeriodePerkuliahan.calon_ikut_seleksi ||
          feederPeriodePerkuliahan.calon_lulus_seleksi !== localPeriodePerkuliahan.calon_lulus_seleksi ||
          feederPeriodePerkuliahan.daftar_sbg_mhs !== localPeriodePerkuliahan.daftar_sbg_mhs ||
          feederPeriodePerkuliahan.pst_undur_diri !== localPeriodePerkuliahan.pst_undur_diri ||
          feederPeriodePerkuliahan.jml_mgu_kul !== localPeriodePerkuliahan.jml_mgu_kul ||
          feederPeriodePerkuliahan.metode_kul !== localPeriodePerkuliahan.metode_kul ||
          feederPeriodePerkuliahan.metode_kul_eks !== localPeriodePerkuliahan.metode_kul_eks ||
          feederPeriodePerkuliahan.tgl_create !== tanggal_dibuat ||
          feederPeriodePerkuliahan.last_update !== tanggal_update ||
          feederPeriodePerkuliahan.id_prodi !== localPeriodePerkuliahan.id_prodi ||
          feederPeriodePerkuliahan.id_semester !== localPeriodePerkuliahan.id_semester
        ) {
          await PeriodePerkuliahan.update(
            {
              jumlah_target_mahasiswa_baru: feederPeriodePerkuliahan.jumlah_target_mahasiswa_baru,
              tanggal_awal_perkuliahan: tanggal_mulai,
              tanggal_akhir_perkuliahan: tanggal_akhir,
              calon_ikut_seleksi: feederPeriodePerkuliahan.calon_ikut_seleksi,
              calon_lulus_seleksi: feederPeriodePerkuliahan.calon_lulus_seleksi,
              daftar_sbg_mhs: feederPeriodePerkuliahan.daftar_sbg_mhs,
              pst_undur_diri: feederPeriodePerkuliahan.pst_undur_diri,
              jml_mgu_kul: feederPeriodePerkuliahan.jml_mgu_kul,
              metode_kul: feederPeriodePerkuliahan.metode_kul,
              metode_kul_eks: feederPeriodePerkuliahan.metode_kul_eks,
              tgl_create: tanggal_dibuat,
              last_update: tanggal_update,
              id_prodi: feederPeriodePerkuliahan.id_prodi,
              id_semester: feederPeriodePerkuliahan.id_semester,
            },
            {
              where: {
                id_prodi: feederPeriodePerkuliahan.id_prodi,
                id_semester: feederPeriodePerkuliahan.id_semester,
              },
            }
          );

          console.log(`Data periode perkuliahan ${feederPeriodePerkuliahan.id_prodi}-${feederPeriodePerkuliahan.id_semester} di-update di lokal.`);
        }
      }
    }

    console.log("Sinkronisasi periode perkuliahan selesai.");
  } catch (error) {
    console.error("Error during syncListPeriodePerkuliahan:", error.message);
    throw error;
  }
}

const syncListPeriodePerkuliahan = async (req, res, next) => {
  try {
    await syncDataPeriodePerkuliahan();
    res.status(200).json({ message: "Sinkronisasi periode perkuliahan berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncListPeriodePerkuliahan,
};
