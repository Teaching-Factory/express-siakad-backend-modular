const axios = require("axios");
const { getToken } = require("./get-token");
const { KRSMahasiswa } = require("../../../models");
const { Periode } = require("../../../models");

const getKRSMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetKRSMahasiswa",
      token: `${token}`,
      filter: `angkatan = '2023'`,
      order: "id_registrasi_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataKRSMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const krs_mahasiswa of dataKRSMahasiswa) {
      let id_periode = null;

      // Periksa apakah id_periode atau periode_pelaporan ada di Periode
      const periode = await Periode.findOne({
        where: {
          periode_pelaporan: krs_mahasiswa.id_periode,
        },
      });

      // Jika ditemukan, simpan nilainya
      if (periode) {
        id_periode = periode.id_periode;
      }

      await KRSMahasiswa.create({
        angkatan: krs_mahasiswa.angkatan,
        id_registrasi_mahasiswa: krs_mahasiswa.id_registrasi_mahasiswa,
        id_periode: id_periode,
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
