const axios = require("axios");
const { getToken } = require("../api-feeder/get-token");
const { PesertaKelasKuliah } = require("../../../models");

const getPesertaKelasKuliah = async (req, res, next) => {
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
      act: "GetPesertaKelasKuliah",
      token: `${token}`,
      filter: angkatanFilter,
      order: "id_registrasi_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataPesertaKelasKuliah = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const peserta_kelas_kuliah of dataPesertaKelasKuliah) {
      // Periksa apakah data sudah ada
      const existingData = await PesertaKelasKuliah.findOne({
        where: {
          id_kelas_kuliah: peserta_kelas_kuliah.id_kelas_kuliah,
          id_registrasi_mahasiswa: peserta_kelas_kuliah.id_registrasi_mahasiswa,
          angkatan: peserta_kelas_kuliah.angkatan,
        },
      });

      if (!existingData) {
        // Jika belum ada, tambahkan data baru
        await PesertaKelasKuliah.create({
          angkatan: peserta_kelas_kuliah.angkatan,
          id_kelas_kuliah: peserta_kelas_kuliah.id_kelas_kuliah,
          id_registrasi_mahasiswa: peserta_kelas_kuliah.id_registrasi_mahasiswa,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Update Peserta Kelas Kuliah Success",
      totalData: dataPesertaKelasKuliah.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPesertaKelasKuliah,
};
