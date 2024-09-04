const axios = require("axios");
const { getToken } = require("./get-token");
const { DetailNilaiPerkuliahanKelas } = require("../../../models");

const getDetailNilaiPerkuliahanKelas = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetDetailNilaiPerkuliahanKelas",
      token: `${token}`,
      filter: `angkatan = '2023'`,
      order: "id_registrasi_mahasiswa"
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataDetailNilaiPerkuliahanKelas = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const detail_nilai_perkuliahan_kelas of dataDetailNilaiPerkuliahanKelas) {
      await DetailNilaiPerkuliahanKelas.create({
        jurusan: detail_nilai_perkuliahan_kelas.jurusan,
        angkatan: detail_nilai_perkuliahan_kelas.angkatan,
        nilai_angka: detail_nilai_perkuliahan_kelas.nilai_angka,
        nilai_indeks: detail_nilai_perkuliahan_kelas.nilai_indeks,
        nilai_huruf: detail_nilai_perkuliahan_kelas.nilai_huruf,
        id_kelas_kuliah: detail_nilai_perkuliahan_kelas.id_kelas_kuliah,
        id_registrasi_mahasiswa: detail_nilai_perkuliahan_kelas.id_registrasi_mahasiswa
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Detail Nilai Perkuliahan Kelas Success",
      totalData: dataDetailNilaiPerkuliahanKelas.length,
      dataDetailNilaiPerkuliahanKelas: dataDetailNilaiPerkuliahanKelas
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDetailNilaiPerkuliahanKelas
};
