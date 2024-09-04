const axios = require("axios");
const { getToken } = require("./get-token");
const { KelasKuliah } = require("../../../models");

const getKelasKuliah = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetListKelasKuliah",
      token: `${token}`
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataKelasKuliah = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const kelas_kuliah of dataKelasKuliah) {
      // Periksa apakah data sudah ada di tabel
      const existingKelasKuliah = await KelasKuliah.findOne({
        where: {
          id_kelas_kuliah: kelas_kuliah.id_kelas_kuliah
        }
      });

      if (!existingKelasKuliah) {
        // Data belum ada, buat entri baru di database
        await KelasKuliah.create({
          id_kelas_kuliah: kelas_kuliah.id_kelas_kuliah,
          nama_kelas_kuliah: kelas_kuliah.nama_kelas_kuliah,
          sks: kelas_kuliah.sks,
          jumlah_mahasiswa: kelas_kuliah.jumlah_mahasiswa,
          apa_untuk_pditt: kelas_kuliah.apa_untuk_pditt,
          lingkup: kelas_kuliah.lingkup,
          mode: kelas_kuliah.mode,
          id_prodi: kelas_kuliah.id_prodi,
          id_semester: kelas_kuliah.id_semester,
          id_matkul: kelas_kuliah.id_matkul,
          id_dosen: kelas_kuliah.id_dosen
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Kelas Kuliah Success",
      totalData: dataKelasKuliah.length,
      dataKelasKuliah: dataKelasKuliah
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKelasKuliah
};
