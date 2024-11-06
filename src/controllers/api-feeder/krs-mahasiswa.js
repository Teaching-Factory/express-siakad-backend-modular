const axios = require("axios");
const { getToken } = require("./get-token");
const { KRSMahasiswa } = require("../../../models");

const getKRSMahasiswa = async (req, res, next) => {
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
      act: "GetKRSMahasiswa",
      token: `${token}`,
      filter: angkatanFilter,
      order: "id_registrasi_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataKRSMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const krs_mahasiswa of dataKRSMahasiswa) {
      await KRSMahasiswa.create({
        angkatan: krs_mahasiswa.angkatan,
        id_registrasi_mahasiswa: krs_mahasiswa.id_registrasi_mahasiswa,
        id_semester: krs_mahasiswa.id_periode,
        id_prodi: krs_mahasiswa.id_prodi,
        id_matkul: krs_mahasiswa.id_matkul,
        id_kelas: krs_mahasiswa.id_kelas,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create KRS Mahasiswa Success",
      totalData: dataKRSMahasiswa.length,
      dataKRSMahasiswa: dataKRSMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKRSMahasiswa,
};
