const axios = require("axios");
const { getToken } = require("../../api-feeder/data-feeder/get-token");
const { DetailNilaiPerkuliahanKelas, KelasKuliah, Mahasiswa } = require("../../../../models");

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

    // Validasi parameter angkatan
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

    // Mengambil data dari API Feeder
    const response = await axios.post(url_feeder, requestBody);

    // Data dari API Feeder
    const dataDetailNilaiPerkuliahanKelas = response.data.data;

    // Proses data satu per satu
    for (const detail of dataDetailNilaiPerkuliahanKelas) {
      // Periksa apakah id_kelas_kuliah dan id_registrasi_mahasiswa ada di database
      const kelasExists = await KelasKuliah.findOne({
        where: { id_kelas_kuliah: detail.id_kelas_kuliah },
      });

      const mahasiswaExists = await Mahasiswa.findOne({
        where: { id_registrasi_mahasiswa: detail.id_registrasi_mahasiswa },
      });

      // Jika salah satu tidak ditemukan, lanjut ke iterasi berikutnya
      if (!kelasExists || !mahasiswaExists) {
        continue;
      }

      // Periksa apakah data sudah ada berdasarkan ID registrasi mahasiswa dan ID kelas kuliah
      const existingData = await DetailNilaiPerkuliahanKelas.findOne({
        where: {
          id_kelas_kuliah: detail.id_kelas_kuliah,
          id_registrasi_mahasiswa: detail.id_registrasi_mahasiswa,
          angkatan: detail.angkatan,
        },
      });

      if (!existingData) {
        // Jika belum ada, tambahkan data baru
        await DetailNilaiPerkuliahanKelas.create({
          jurusan: detail.jurusan,
          angkatan: detail.angkatan,
          nilai_angka: detail.nilai_angka,
          nilai_indeks: detail.nilai_indeks,
          nilai_huruf: detail.nilai_huruf,
          id_kelas_kuliah: detail.id_kelas_kuliah,
          id_registrasi_mahasiswa: detail.id_registrasi_mahasiswa,
        });
      }
    }

    // Kirim respons dengan jumlah data yang diproses
    res.status(200).json({
      message: "Update Detail Nilai Perkuliahan Kelas Success",
      totalData: dataDetailNilaiPerkuliahanKelas.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDetailNilaiPerkuliahanKelas,
};
