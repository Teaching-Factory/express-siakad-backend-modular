const { MahasiswaLulusDO, PeriodePerkuliahan, SettingGlobalSemester } = require("../../../../models");
const { getToken } = require("../../api-feeder/data-feeder/get-token");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar mahasiswa lulus do dari Feeder
async function getMahasiswaLulusDOFromFeeder() {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    // get setting global semester aktif
    const setting_global_semester_aktif = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    const requestBody = {
      act: "GetListMahasiswaLulusDO",
      token: token,
      filter: `id_periode_keluar='${setting_global_semester_aktif.id_semester_aktif}'`,
      order: "id_registrasi_mahasiswa",
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar mahasiswa lulus do dari database lokal
async function getMahasiswaLulusDOFromLocal() {
  try {
    return await MahasiswaLulusDO.findAll();
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi utama untuk sinkronisasi mahasiswa lulus do
async function syncDataMahasiswaLulusDO() {
  try {
    const mahasiswaLulusDOFeeder = await getMahasiswaLulusDOFromFeeder();
    const mahasiswaLulusDOLocal = await getMahasiswaLulusDOFromLocal();

    const localMap = mahasiswaLulusDOLocal.reduce((map, feederMahasiswaLulusDO) => {
      map[feederMahasiswaLulusDO.id_registrasi_mahasiswa] = feederMahasiswaLulusDO;
      return map;
    }, {});

    let periodePerkuliahan = null;

    // Sinkronisasi data dari Feeder ke Lokal
    for (let feederMahasiswaLulusDO of mahasiswaLulusDOFeeder) {
      let tanggal_keluar; // Deklarasikan variabel di luar blok if
      periodePerkuliahan = null;

      // melakukan pengecekan data tanggal
      if (feederMahasiswaLulusDO.tanggal_keluar != null) {
        const date_out = feederMahasiswaLulusDO.tanggal_keluar.split("-");
        tanggal_keluar = `${date_out[2]}-${date_out[1]}-${date_out[0]}`;
      }

      // mengambil data periode perkuliahan yang sesuai dengan prodi mahasiswa
      if (feederMahasiswaLulusDO.id_periode_keluar !== null) {
        periodePerkuliahan = await PeriodePerkuliahan.findOne({
          where: {
            id_prodi: feederMahasiswaLulusDO.id_prodi,
            id_semester: feederMahasiswaLulusDO.id_periode_keluar,
          },
        });
      }

      if (!localMap[feederMahasiswaLulusDO.id_registrasi_mahasiswa]) {
        // Buat entri baru mahasiswa lulus do
        await MahasiswaLulusDO.create({
          tanggal_keluar: tanggal_keluar,
          keterangan: feederMahasiswaLulusDO.keterangan,
          nomor_sk_yudisium: feederMahasiswaLulusDO.sk_yudisium,
          tanggal_sk_yudisium: feederMahasiswaLulusDO.tgl_sk_yudisium,
          ipk: feederMahasiswaLulusDO.ipk,
          nomor_ijazah: feederMahasiswaLulusDO.no_seri_ijazah,
          jalur_skripsi: feederMahasiswaLulusDO.jalur_skripsi,
          judul_skripsi: feederMahasiswaLulusDO.judul_skripsi,
          bulan_awal_bimbingan: feederMahasiswaLulusDO.bln_awal_bimbingan,
          bulan_akhir_bimbingan: feederMahasiswaLulusDO.bln_akhir_bimbingan,
          id_registrasi_mahasiswa: feederMahasiswaLulusDO.id_registrasi_mahasiswa,
          id_jenis_keluar: feederMahasiswaLulusDO.id_jenis_keluar,
          id_periode_keluar: periodePerkuliahan ? periodePerkuliahan.id_periode_perkuliahan : null,
        });

        console.log(`Data mahasiswa lulus do ${feederMahasiswaLulusDO.id_registrasi_mahasiswa} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localMahasiswaLulusDO = localMap[feederMahasiswaLulusDO.id_registrasi_mahasiswa];

        // mengecek jika terdapat perubahan terbaru dari feeder
        if (
          feederMahasiswaLulusDO.tanggal_keluar !== tanggal_keluar ||
          feederMahasiswaLulusDO.keterangan !== localMahasiswaLulusDO.keterangan ||
          feederMahasiswaLulusDO.sk_yudisium !== localMahasiswaLulusDO.nomor_sk_yudisium ||
          feederMahasiswaLulusDO.tgl_sk_yudisium !== localMahasiswaLulusDO.tanggal_sk_yudisium ||
          feederMahasiswaLulusDO.ipk !== localMahasiswaLulusDO.ipk ||
          feederMahasiswaLulusDO.no_seri_ijazah !== localMahasiswaLulusDO.nomor_ijazah ||
          feederMahasiswaLulusDO.jalur_skripsi !== localMahasiswaLulusDO.jalur_skripsi ||
          feederMahasiswaLulusDO.judul_skripsi !== localMahasiswaLulusDO.judul_skripsi ||
          feederMahasiswaLulusDO.bln_awal_bimbingan !== localMahasiswaLulusDO.bulan_awal_bimbingan ||
          feederMahasiswaLulusDO.bln_akhir_bimbingan !== localMahasiswaLulusDO.bulan_akhir_bimbingan ||
          feederMahasiswaLulusDO.id_registrasi_mahasiswa !== localMahasiswaLulusDO.id_registrasi_mahasiswa ||
          feederMahasiswaLulusDO.id_jenis_keluar !== localMahasiswaLulusDO.id_jenis_keluar ||
          feederMahasiswaLulusDO.id_periode_keluar !== periodePerkuliahan.id_semester
            ? periodePerkuliahan.id_semester
            : null
        ) {
          await MahasiswaLulusDO.update(
            {
              tanggal_keluar: tanggal_keluar,
              keterangan: feederMahasiswaLulusDO.keterangan,
              nomor_sk_yudisium: feederMahasiswaLulusDO.sk_yudisium,
              tanggal_sk_yudisium: feederMahasiswaLulusDO.tgl_sk_yudisium,
              ipk: feederMahasiswaLulusDO.ipk,
              nomor_ijazah: feederMahasiswaLulusDO.no_seri_ijazah,
              jalur_skripsi: feederMahasiswaLulusDO.jalur_skripsi,
              judul_skripsi: feederMahasiswaLulusDO.judul_skripsi,
              bulan_awal_bimbingan: feederMahasiswaLulusDO.bln_awal_bimbingan,
              bulan_akhir_bimbingan: feederMahasiswaLulusDO.bln_akhir_bimbingan,
              id_registrasi_mahasiswa: feederMahasiswaLulusDO.id_registrasi_mahasiswa,
              id_jenis_keluar: feederMahasiswaLulusDO.id_jenis_keluar,
              id_periode_keluar: periodePerkuliahan ? periodePerkuliahan.id_periode_perkuliahan : null,
            },
            { where: { id_registrasi_mahasiswa: feederMahasiswaLulusDO.id_registrasi_mahasiswa } }
          );

          console.log(`Data mahasiswa lulus do ${feederMahasiswaLulusDO.id_registrasi_mahasiswa} di-update di lokal.`);
        }
      }
    }

    console.log("Sinkronisasi mahasiswa lulus do selesai.");
  } catch (error) {
    console.error("Error during syncMahasiswaLulusDO:", error.message);
    throw error;
  }
}

const syncMahasiswaLulusDO = async (req, res, next) => {
  try {
    await syncDataMahasiswaLulusDO();
    res.status(200).json({ message: "Sinkronisasi mahasiswa lulus do berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncMahasiswaLulusDO,
};
