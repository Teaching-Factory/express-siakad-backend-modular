const axios = require("axios");
const { getToken } = require("./get-token");
const { TranskripMahasiswa } = require("../../../models");
const { KelasKuliah } = require("../../../models");

const getTranskripMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetTranskripMahasiswa",
      token: `${token}`,
      order: "id_registrasi_mahasiswa"
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataTranskripMahasiswa = response.data.data;

    // Loop untuk menambahkan transkrip_mahasiswa ke dalam database
    for (const transkrip_mahasiswa of dataTranskripMahasiswa) {
      let id_kelas_kuliah = null;

      // Periksa apakah id_kelas_kuliah ada di tabel Kelas Kuliah
      const kelas_kuliah = await KelasKuliah.findOne({
        where: {
          id_kelas_kuliah: transkrip_mahasiswa.id_kelas_kuliah
        }
      });

      // Jika ditemukan, simpan nilainya
      if (kelas_kuliah) {
        id_kelas_kuliah = kelas_kuliah.id_kelas_kuliah || transkrip_mahasiswa.id_kelas_kuliah;
      }

      await TranskripMahasiswa.create({
        smt_diambil: transkrip_mahasiswa.smt_diambil,
        id_nilai_transfer: transkrip_mahasiswa.id_nilai_transfer,
        id_registrasi_mahasiswa: transkrip_mahasiswa.id_registrasi_mahasiswa,
        id_matkul: transkrip_mahasiswa.id_matkul,
        id_kelas_kuliah: id_kelas_kuliah,
        id_konversi_aktivitas: transkrip_mahasiswa.id_konversi_aktivitas
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Transkrip Mahasiswa Success",
      totalData: dataTranskripMahasiswa.length,
      dataTranskripMahasiswa: dataTranskripMahasiswa
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTranskripMahasiswa
};
