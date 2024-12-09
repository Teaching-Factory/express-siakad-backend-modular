const axios = require("axios");
const { getToken } = require("./get-token");
const { RekapKRSMahasiswa, Periode, sequelize } = require("../../../models");

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

    // Buat filter dinamis berdasarkan parameter angkatan
    const angkatanFilter = Array.isArray(angkatan) ? angkatan.map((year) => `angkatan = '${year}'`).join(" OR ") : `angkatan = '${angkatan}'`;

    const requestBody = {
      act: "GetRekapKRSMahasiswa",
      token: `${token}`,
      filter: angkatanFilter,
      order: "id_periode",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataRekapKRSMahasiswa = response.data.data;

    // Truncate data
    await RekapKRSMahasiswa.destroy({
      where: {}, // Hapus semua data
    });

    await sequelize.query("ALTER TABLE rekap_krs_mahasiswas AUTO_INCREMENT = 1");

    // Loop untuk menambahkan data ke dalam database
    for (const rekap_khs_mahasiswa of dataRekapKRSMahasiswa) {
      let id_periode = null;

      // Periksa apakah id_periode atau periode_pelaporan ada di Periode
      const periode = await Periode.findOne({
        where: {
          periode_pelaporan: rekap_khs_mahasiswa.id_periode,
        },
      });

      // Jika ditemukan, simpan nilainya
      if (periode) {
        id_periode = periode.id_periode;
      }

      await RekapKRSMahasiswa.create({
        nama_periode: rekap_khs_mahasiswa.nama_periode,
        angkatan: rekap_khs_mahasiswa.angkatan,
        id_prodi: rekap_khs_mahasiswa.id_prodi,
        id_periode: id_periode,
        id_registrasi_mahasiswa: rekap_khs_mahasiswa.id_registrasi_mahasiswa,
        id_matkul: rekap_khs_mahasiswa.id_matkul,
        id_semester: rekap_khs_mahasiswa.id_semester,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Rekap KRS Mahasiswa Success",
      totalData: dataRekapKRSMahasiswa.length,
      dataRekapKRSMahasiswa: dataRekapKRSMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRekapKRSMahasiswa,
};
