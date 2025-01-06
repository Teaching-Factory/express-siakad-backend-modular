const axios = require("axios");
const { getToken } = require("./get-token");
const { DetailNilaiPerkuliahanKelas, sequelize } = require("../../../models");

const getDetailNilaiPerkuliahanKelas = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    // Ambil parameter angkatan dari query string
    const angkatan = req.query.angkatan;

    // Cek apakah angkatan dikirim dalam bentuk array
    if (!angkatan || angkatan.length === 0) {
      return res.status(400).json({ message: "Parameter angkatan is required" });
    }

    // Buat filter dinamis berdasarkan parameter angkatan
    const angkatanFilter = Array.isArray(angkatan) ? angkatan.map((year) => `angkatan = '${year}'`).join(" OR ") : `angkatan = '${angkatan}'`;

    const requestBody = {
      act: "GetDetailNilaiPerkuliahanKelas",
      token: `${token}`,
      filter: angkatanFilter,
      order: "id_registrasi_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataDetailNilaiPerkuliahanKelas = response.data.data;

    // Truncate data
    await DetailNilaiPerkuliahanKelas.destroy({
      where: {}, // Hapus semua data
    });

    await sequelize.query("ALTER TABLE detail_nilai_perkuliahan_kelas AUTO_INCREMENT = 1");

    // Loop untuk menambahkan data ke dalam database
    for (const detail_nilai_perkuliahan_kelas of dataDetailNilaiPerkuliahanKelas) {
      await DetailNilaiPerkuliahanKelas.create({
        jurusan: detail_nilai_perkuliahan_kelas.jurusan,
        angkatan: detail_nilai_perkuliahan_kelas.angkatan,
        nilai_angka: detail_nilai_perkuliahan_kelas.nilai_angka,
        nilai_indeks: detail_nilai_perkuliahan_kelas.nilai_indeks,
        nilai_huruf: detail_nilai_perkuliahan_kelas.nilai_huruf,
        id_kelas_kuliah: detail_nilai_perkuliahan_kelas.id_kelas_kuliah,
        id_registrasi_mahasiswa: detail_nilai_perkuliahan_kelas.id_registrasi_mahasiswa,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Detail Nilai Perkuliahan Kelas Success",
      totalData: dataDetailNilaiPerkuliahanKelas.length,
      // dataDetailNilaiPerkuliahanKelas: dataDetailNilaiPerkuliahanKelas,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDetailNilaiPerkuliahanKelas,
};
