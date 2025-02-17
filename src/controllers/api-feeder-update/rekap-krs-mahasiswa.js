const axios = require("axios");
const { getToken } = require("../api-feeder/get-token");
const { RekapKRSMahasiswa } = require("../../../models");

const getRekapKRSMahasiswa = async (req, res, next) => {
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

    // Buat filter menggunakan LIKE pada id_semester
    const semesterFilter = Array.isArray(angkatan) ? angkatan.map((year) => `id_semester LIKE '%${year}%'`).join(" OR ") : `id_semester LIKE '%${angkatan}%'`;

    const requestBody = {
      act: "GetRekapKRSMahasiswa",
      token: `${token}`,
      filter: semesterFilter,
      order: "id_semester",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataRekapKRSMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const rekap_krs_mahasiswa of dataRekapKRSMahasiswa) {
      // Periksa apakah data sudah ada
      const existingData = await RekapKRSMahasiswa.findOne({
        where: {
          id_registrasi_mahasiswa: rekap_krs_mahasiswa.id_registrasi_mahasiswa,
          angkatan: rekap_krs_mahasiswa.angkatan,
          id_matkul: rekap_krs_mahasiswa.id_matkul,
          id_semester: rekap_krs_mahasiswa.id_semester,
        },
      });

      if (!existingData) {
        // Jika belum ada, tambahkan data baru
        await RekapKRSMahasiswa.create({
          angkatan: rekap_krs_mahasiswa.angkatan,
          id_prodi: rekap_krs_mahasiswa.id_prodi,
          id_registrasi_mahasiswa: rekap_krs_mahasiswa.id_registrasi_mahasiswa,
          id_matkul: rekap_krs_mahasiswa.id_matkul,
          id_semester: rekap_krs_mahasiswa.id_semester,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Update Rekap KRS Mahasiswa Success",
      totalData: dataRekapKRSMahasiswa.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRekapKRSMahasiswa,
};
