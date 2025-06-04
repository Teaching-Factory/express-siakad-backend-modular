const axios = require("axios");
const { getToken } = require("./get-token");
const { RekapKHSMahasiswa, sequelize } = require("../../../../models");

const getRekapKHSMahasiswa = async (req, res, next) => {
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

    // Buat filter menggunakan LIKE pada id_periode pada feeder
    const semesterFilter = Array.isArray(angkatan) ? angkatan.map((year) => `id_periode LIKE '%${year}%'`).join(" OR ") : `id_periode LIKE '%${angkatan}%'`;

    const requestBody = {
      act: "GetRekapKHSMahasiswa",
      token: token,
      filter: semesterFilter,
      order: "id_registrasi_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Pastikan data berbentuk array agar tidak terjadi error
    const dataRekapKHSMahasiswa = Array.isArray(response.data.data) ? response.data.data : [];

    // Truncate data
    await RekapKHSMahasiswa.destroy({
      where: {}, // Hapus semua data
    });

    await sequelize.query("ALTER TABLE rekap_khs_mahasiswas AUTO_INCREMENT = 1");

    // Loop untuk menambahkan data ke dalam database
    for (const rekap_khs_mahasiswa of dataRekapKHSMahasiswa) {
      await RekapKHSMahasiswa.create({
        angkatan: rekap_khs_mahasiswa.angkatan,
        nilai_angka: rekap_khs_mahasiswa.nilai_angka,
        nilai_huruf: rekap_khs_mahasiswa.nilai_huruf,
        nilai_indeks: rekap_khs_mahasiswa.nilai_indeks,
        sks_x_indeks: rekap_khs_mahasiswa.sks_x_indeks,
        id_registrasi_mahasiswa: rekap_khs_mahasiswa.id_registrasi_mahasiswa,
        id_semester: rekap_khs_mahasiswa.id_periode,
        id_prodi: rekap_khs_mahasiswa.id_prodi,
        id_matkul: rekap_khs_mahasiswa.id_matkul,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Rekap KHS Mahasiswa Success",
      totalData: dataRekapKHSMahasiswa.length,
      // dataRekapKHSMahasiswa: dataRekapKHSMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRekapKHSMahasiswa,
};
