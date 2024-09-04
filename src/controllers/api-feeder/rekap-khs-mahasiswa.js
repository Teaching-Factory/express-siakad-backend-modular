const axios = require("axios");
const { getToken } = require("./get-token");
const { RekapKHSMahasiswa } = require("../../../models");
const { Periode } = require("../../../models");

const getRekapKHSMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetRekapKHSMahasiswa",
      token: `${token}`,
      filter: "angkatan = '2023'",
      order: "id_registrasi_mahasiswa"
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataRekapKHSMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const rekap_khs_mahasiswa of dataRekapKHSMahasiswa) {
      let id_periode = null;

      // Periksa apakah id_periode atau periode_pelaporan ada di Periode
      const periode = await Periode.findOne({
        where: {
          periode_pelaporan: rekap_khs_mahasiswa.id_periode
        }
      });

      // Jika ditemukan, simpan nilainya
      if (periode) {
        id_periode = periode.id_periode;
      }

      await RekapKHSMahasiswa.create({
        angkatan: rekap_khs_mahasiswa.angkatan,
        nama_periode: rekap_khs_mahasiswa.nama_periode,
        nilai_angka: rekap_khs_mahasiswa.nilai_angka,
        nilai_huruf: rekap_khs_mahasiswa.nilai_huruf,
        nilai_indeks: rekap_khs_mahasiswa.nilai_indeks,
        sks_x_indeks: rekap_khs_mahasiswa.sks_x_indeks,
        id_registrasi_mahasiswa: rekap_khs_mahasiswa.id_registrasi_mahasiswa,
        id_prodi: rekap_khs_mahasiswa.id_prodi,
        id_periode: id_periode,
        id_matkul: rekap_khs_mahasiswa.id_matkul
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Rekap KHS Mahasiswa Success",
      totalData: dataRekapKHSMahasiswa.length,
      dataRekapKHSMahasiswa: dataRekapKHSMahasiswa
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRekapKHSMahasiswa
};
