const axios = require("axios");
const { getToken } = require("./get-token");
const { DetailKelasKuliah } = require("../../../models");

const getDetailKelasKuliah = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetDetailKelasKuliah",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataDetailKelasKuliah = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const detail_kelas_kuliah of dataDetailKelasKuliah) {
      let tanggal_mulai, tanggal_akhir; // Deklarasikan variabel di luar blok if

      //   melakukan pengecekan data tanggal
      if (detail_kelas_kuliah.tanggal_mulai_efektif != null) {
        const date_start = detail_kelas_kuliah.tanggal_mulai_efektif.split("-");
        tanggal_mulai = `${date_start[2]}-${date_start[1]}-${date_start[0]}`;
      }

      if (detail_kelas_kuliah.tanggal_akhir_efektif != null) {
        const date_end = detail_kelas_kuliah.tanggal_akhir_efektif.split("-");
        tanggal_akhir = `${date_end[2]}-${date_end[1]}-${date_end[0]}`;
      }

      await DetailKelasKuliah.create({
        id_detail_kelas_kuliah: detail_kelas_kuliah.id_detail_kelas_kuliah,
        bahasan: detail_kelas_kuliah.bahasan,
        tanggal_mulai_efektif: tanggal_mulai,
        tanggal_akhir_efektif: tanggal_akhir,
        kapasitas: detail_kelas_kuliah.kapasitas,
        tanggal_tutup_daftar: detail_kelas_kuliah.tanggal_tutup_daftar,
        prodi_penyelenggara: detail_kelas_kuliah.prodi_penyelenggara,
        perguruan_tinggi_penyelenggara: detail_kelas_kuliah.perguruan_tinggi_penyelenggara,
        id_kelas_kuliah: detail_kelas_kuliah.id_kelas_kuliah,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Detail Kelas Kuliah Success",
      totalData: dataDetailKelasKuliah.length,
      dataDetailKelasKuliah: dataDetailKelasKuliah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDetailKelasKuliah,
};
