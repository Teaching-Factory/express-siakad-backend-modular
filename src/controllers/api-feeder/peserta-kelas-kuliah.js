const axios = require("axios");
const { getToken } = require("./get-token");
const { PesertaKelasKuliah } = require("../../../models");

const getPesertaKelasKuliah = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetPesertaKelasKuliah",
      token: `${token}`,
      filter: `angkatan = '2023'`,
      order: "id_registrasi_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataPesertaKelasKuliah = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const peserta_kelas_kuliah of dataPesertaKelasKuliah) {
      await PesertaKelasKuliah.create({
        angkatan: peserta_kelas_kuliah.angkatan,
        id_kelas_kuliah: peserta_kelas_kuliah.id_kelas_kuliah,
        id_registrasi_mahasiswa: peserta_kelas_kuliah.id_registrasi_mahasiswa,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Peserta Kelas Kuliah Success",
      totalData: dataPesertaKelasKuliah.length,
      dataPesertaKelasKuliah: dataPesertaKelasKuliah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPesertaKelasKuliah,
};
