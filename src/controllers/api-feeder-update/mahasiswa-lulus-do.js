const axios = require("axios");
const { getToken } = require("../api-feeder/get-token");
const { MahasiswaLulusDO, PeriodePerkuliahan } = require("../../../models");

const getMahasiswaLulusDO = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;

    // Periksa apakah ID disediakan
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }

    const requestBody = {
      act: "GetListMahasiswaLulusDO",
      token: `${token}`,
      filter: `id_prodi='${prodiId}'`,
      order: "id_registrasi_mahasiswa",
    };

    // Mengambil data dari API Feeder
    const response = await axios.post(url_feeder, requestBody);

    // Data dari API Feeder
    const dataMahasiswaLulusDO = response.data.data;

    let periodePerkuliahan = null;

    // Proses data satu per satu
    for (const mhs_lulus_do of dataMahasiswaLulusDO) {
      // Periksa apakah data sudah ada berdasarkan ID registrasi mahasiswa
      const existingData = await MahasiswaLulusDO.findOne({
        where: {
          id_registrasi_mahasiswa: mhs_lulus_do.id_registrasi_mahasiswa,
        },
      });

      let tanggal_keluar; // Deklarasikan variabel di luar blok if
      periodePerkuliahan = null;

      // melakukan pengecekan data tanggal
      if (mhs_lulus_do.tanggal_keluar != null) {
        const date_out = mhs_lulus_do.tanggal_keluar.split("-");
        tanggal_keluar = `${date_out[2]}-${date_out[1]}-${date_out[0]}`;
      }

      // mengambil data periode perkuliahan yang sesuai dengan prodi mahasiswa
      if (mhs_lulus_do.id_periode_keluar !== null) {
        periodePerkuliahan = await PeriodePerkuliahan.findOne({
          where: {
            id_prodi: mhs_lulus_do.id_prodi,
            id_semester: mhs_lulus_do.id_periode_keluar,
          },
        });
      }

      if (!existingData) {
        // Jika belum ada, tambahkan data baru
        await MahasiswaLulusDO.create({
          tanggal_keluar: tanggal_keluar,
          keterangan: mhs_lulus_do.keterangan,
          nomor_sk_yudisium: mhs_lulus_do.sk_yudisium,
          tanggal_sk_yudisium: mhs_lulus_do.tgl_sk_yudisium,
          ipk: mhs_lulus_do.ipk,
          nomor_ijazah: mhs_lulus_do.no_seri_ijazah,
          jalur_skripsi: mhs_lulus_do.jalur_skripsi,
          judul_skripsi: mhs_lulus_do.judul_skripsi,
          bulan_awal_bimbingan: mhs_lulus_do.bln_awal_bimbingan,
          bulan_akhir_bimbingan: mhs_lulus_do.bln_akhir_bimbingan,
          id_registrasi_mahasiswa: mhs_lulus_do.id_registrasi_mahasiswa,
          id_jenis_keluar: mhs_lulus_do.id_jenis_keluar,
          id_periode_keluar: periodePerkuliahan ? periodePerkuliahan.id_periode_perkuliahan : null,
        });
      }
    }

    // Kirim respons dengan jumlah data yang diproses
    res.status(200).json({
      message: `Update Mahasiswa Lulus DO By Prodi ID ${prodiId} Success`,
      totalData: dataMahasiswaLulusDO.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMahasiswaLulusDO,
};
