const axios = require("axios");
const { getToken } = require("./get-token");
const { AktivitasKuliahMahasiswa } = require("../../../models");

const getAktivitasKuliahMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetAktivitasKuliahMahasiswa",
      token: `${token}`,
      filter: "angkatan = '2023'",
      order: "id_registrasi_mahasiswa"
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataAktivitasKuliahMahasiswa = response.data.data;

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
        id_status_mahasiswa: aktivitas_kuliah_mahasiswa.id_status_mahasiswa
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Aktivitas Kuliah Mahasiswa Success",
      totalData: dataAktivitasKuliahMahasiswa.length,
      dataAktivitasKuliahMahasiswa: dataAktivitasKuliahMahasiswa
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAktivitasKuliahMahasiswa
};
