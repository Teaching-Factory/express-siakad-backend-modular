const axios = require("axios");
const { getToken } = require("./get-token");
const { RekapKRSMahasiswa, sequelize } = require("../../../models");

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
      token: token,
      filter: semesterFilter,
      order: "id_semester",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Pastikan data berbentuk array agar tidak terjadi error
    const dataRekapKRSMahasiswa = Array.isArray(response.data.data) ? response.data.data : [];

    // Truncate data
    await RekapKRSMahasiswa.destroy({
      where: {}, // Hapus semua data
    });

    await sequelize.query("ALTER TABLE rekap_krs_mahasiswas AUTO_INCREMENT = 1");

    // Loop untuk menambahkan data ke dalam database
    for (const rekap_krs_mahasiswa of dataRekapKRSMahasiswa) {
      await RekapKRSMahasiswa.create({
        angkatan: rekap_krs_mahasiswa.angkatan,
        id_prodi: rekap_krs_mahasiswa.id_prodi,
        id_registrasi_mahasiswa: rekap_krs_mahasiswa.id_registrasi_mahasiswa,
        id_matkul: rekap_krs_mahasiswa.id_matkul,
        id_semester: rekap_krs_mahasiswa.id_semester,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Rekap KRS Mahasiswa Success",
      totalData: dataRekapKRSMahasiswa.length,
      // dataRekapKRSMahasiswa: dataRekapKRSMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRekapKRSMahasiswa,
};
