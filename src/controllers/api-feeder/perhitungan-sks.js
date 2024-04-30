const axios = require("axios");
const { getToken } = require("./get-token");
const { PerhitunganSKS } = require("../../../models");
const { PenugasanDosen } = require("../../../models");
const { KelasKuliah } = require("../../../models");

const getPerhitunganSKS = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetPerhitunganSKS",
      token: `${token}`,
      order: "id_kelas_kuliah",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataPerhitunganSKS = response.data.data;

    for (const perhitungan_sks of dataPerhitunganSKS) {
      // Inisialisasi variabel untuk menyimpan nilai yang akan disimpan
      let id_kelas_kuliah = null;
      let id_registrasi_dosen = null;

      // Periksa apakah id_registrasi_dosen ada di PenugasanDosen
      const penugasanDosen = await PenugasanDosen.findOne({
        where: {
          id_registrasi_dosen: perhitungan_sks.id_registrasi_dosen,
        },
      });

      // Jika ditemukan, simpan nilainya
      if (penugasanDosen) {
        id_registrasi_dosen = perhitungan_sks.id_registrasi_dosen;
      }

      // Periksa apakah id_kelas_kuliah ada di KelasKuliah
      const kelasKuliah = await KelasKuliah.findOne({
        where: {
          id_kelas_kuliah: perhitungan_sks.id_kelas_kuliah,
        },
      });

      // Jika ditemukan, simpan nilainya
      if (kelasKuliah) {
        id_kelas_kuliah = perhitungan_sks.id_kelas_kuliah;
      }

      // Buat data PerhitunganSKS dengan nilai-nilai yang telah disimpan
      await PerhitunganSKS.create({
        rencana_minggu_pertemuan: perhitungan_sks.rencana_minggu_pertemuan,
        perhitungan_sks: perhitungan_sks.perhitungan_sks,
        id_kelas_kuliah: id_kelas_kuliah, // Gunakan nilai yang telah disimpan, atau null jika tidak ditemukan
        id_registrasi_dosen: id_registrasi_dosen, // Gunakan nilai yang telah disimpan, atau null jika tidak ditemukan
        id_substansi: perhitungan_sks.id_substansi,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Perhitungan SKS Success",
      totalData: dataPerhitunganSKS.length,
      dataPerhitunganSKS: dataPerhitunganSKS,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPerhitunganSKS,
};
