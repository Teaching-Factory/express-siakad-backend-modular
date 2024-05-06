const axios = require("axios");
const { getToken } = require("./get-token");
const { RekapKRSMahasiswa } = require("../../../models");
const { Periode } = require("../../../models");

const getRekapKRSMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetRekapKRSMahasiswa",
      token: `${token}`,
      filter: "angkatan = '2023'",
      order: "id_periode",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataRekapKRSMahasiswa = response.data.data;

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
