const axios = require("axios");
const { getToken } = require("./get-token");
const { MahasiswaLulusDO, PeriodePerkuliahan, sequelize } = require("../../../models");

const getMahasiswaLulusDO = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetListMahasiswaLulusDO",
      token: `${token}`,
      order: "id_registrasi_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataMahasiswaLulusDO = response.data.data;

    // Truncate data
    await MahasiswaLulusDO.destroy({
      where: {}, // Hapus semua data
    });

    await sequelize.query("ALTER TABLE mahasiswa_lulus_dos AUTO_INCREMENT = 1");

    let periodePerkuliahan = null;

    // Loop untuk menambahkan data ke dalam database
    for (const mahasiswa_lulus_do of dataMahasiswaLulusDO) {
      let tanggal_keluar; // Deklarasikan variabel di luar blok if
      periodePerkuliahan = null;

      // melakukan pengecekan data tanggal
      if (mahasiswa_lulus_do.tanggal_keluar != null) {
        const date_out = mahasiswa_lulus_do.tanggal_keluar.split("-");
        tanggal_keluar = `${date_out[2]}-${date_out[1]}-${date_out[0]}`;
      }

      // mengambil data periode perkuliahan yang sesuai dengan prodi mahasiswa
      if (mahasiswa_lulus_do.id_periode_keluar !== null) {
        periodePerkuliahan = await PeriodePerkuliahan.findOne({
          where: {
            id_prodi: mahasiswa_lulus_do.id_prodi,
            id_semester: mahasiswa_lulus_do.id_periode_keluar,
          },
        });
      }

      // Data belum ada, buat entri baru di database
      await MahasiswaLulusDO.create({
        tanggal_keluar: tanggal_keluar,
        keterangan: mahasiswa_lulus_do.keterangan,
        nomor_sk_yudisium: mahasiswa_lulus_do.sk_yudisium,
        tanggal_sk_yudisium: mahasiswa_lulus_do.tgl_sk_yudisium,
        ipk: mahasiswa_lulus_do.ipk,
        nomor_ijazah: mahasiswa_lulus_do.no_seri_ijazah,
        jalur_skripsi: mahasiswa_lulus_do.jalur_skripsi,
        judul_skripsi: mahasiswa_lulus_do.judul_skripsi,
        bulan_awal_bimbingan: mahasiswa_lulus_do.bln_awal_bimbingan,
        bulan_akhir_bimbingan: mahasiswa_lulus_do.bln_akhir_bimbingan,
        id_registrasi_mahasiswa: mahasiswa_lulus_do.id_registrasi_mahasiswa,
        id_jenis_keluar: mahasiswa_lulus_do.id_jenis_keluar,
        id_periode_keluar: periodePerkuliahan ? periodePerkuliahan.id_periode_perkuliahan : null,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Mahasiswa Lulus DO Success",
      totalData: dataMahasiswaLulusDO.length,
      //   dataMahasiswaLulusDO: dataMahasiswaLulusDO,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMahasiswaLulusDO,
};
