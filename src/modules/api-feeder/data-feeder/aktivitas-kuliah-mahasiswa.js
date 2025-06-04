const axios = require("axios");
const { getToken } = require("./get-token");
const { AktivitasKuliahMahasiswa, sequelize } = require("../../../../models");

const getAktivitasKuliahMahasiswa = async (req, res, next) => {
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
      act: "GetAktivitasKuliahMahasiswa",
      token: `${token}`,
      filter: angkatanFilter,
      order: "id_registrasi_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataAktivitasKuliahMahasiswa = response.data.data;

    // Truncate data
    await AktivitasKuliahMahasiswa.destroy({
      where: {}, // Hapus semua data
    });

    await sequelize.query("ALTER TABLE aktivitas_kuliah_mahasiswas AUTO_INCREMENT = 1");

    // Loop untuk menambahkan data ke dalam database
    for (const aktivitas_kuliah_mahasiswa of dataAktivitasKuliahMahasiswa) {
      await AktivitasKuliahMahasiswa.create({
        angkatan: aktivitas_kuliah_mahasiswa.angkatan,
        ips: aktivitas_kuliah_mahasiswa.ips,
        ipk: aktivitas_kuliah_mahasiswa.ipk,
        sks_semester: aktivitas_kuliah_mahasiswa.sks_semester,
        sks_total: aktivitas_kuliah_mahasiswa.sks_total,
        biaya_kuliah_smt: aktivitas_kuliah_mahasiswa.biaya_kuliah_smt,
        id_registrasi_mahasiswa: aktivitas_kuliah_mahasiswa.id_registrasi_mahasiswa,
        id_semester: aktivitas_kuliah_mahasiswa.id_semester,
        id_prodi: aktivitas_kuliah_mahasiswa.id_prodi,
        id_status_mahasiswa: aktivitas_kuliah_mahasiswa.id_status_mahasiswa,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Aktivitas Kuliah Mahasiswa Success",
      totalData: dataAktivitasKuliahMahasiswa.length,
      // dataAktivitasKuliahMahasiswa: dataAktivitasKuliahMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAktivitasKuliahMahasiswa,
};
