const axios = require("axios");
const { getToken } = require("./get-token");
const { KomponenEvaluasiKelas, KelasKuliah } = require("../../../models");

const getKomponenEvaluasiKelas = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetListKomponenEvaluasiKelas",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataKomponenEvaluasiKelas = response.data.data;

    // Truncate data
    await KomponenEvaluasiKelas.destroy({
      where: {}, // Hapus semua data
    });

    // Loop untuk menambahkan data ke dalam database
    for (const komponen_evaluasi_kelas of dataKomponenEvaluasiKelas) {
      let existingKelasKuliah = await KelasKuliah.findOne({
        where: {
          id_kelas_kuliah: komponen_evaluasi_kelas.id_kelas_kuliah,
        },
      });

      if (existingKelasKuliah) {
        // Periksa apakah data sudah ada di tabel
        const existingKomponenEvaluasiKelas = await KomponenEvaluasiKelas.findOne({
          where: {
            id_komponen_evaluasi: komponen_evaluasi_kelas.id_komponen_evaluasi,
          },
        });

        if (!existingKomponenEvaluasiKelas) {
          // Data belum ada, buat entri baru di database
          await KomponenEvaluasiKelas.create({
            id_komponen_evaluasi: komponen_evaluasi_kelas.id_komponen_evaluasi,
            nama: komponen_evaluasi_kelas.nama,
            nama_inggris: komponen_evaluasi_kelas.nama_inggris,
            nomor_urut: komponen_evaluasi_kelas.nomor_urut,
            bobot_evaluasi: komponen_evaluasi_kelas.bobot_evaluasi,
            last_sync: new Date(),
            id_feeder: komponen_evaluasi_kelas.id_komponen_evaluasi,
            id_kelas_kuliah: komponen_evaluasi_kelas.id_kelas_kuliah,
            id_jenis_evaluasi: komponen_evaluasi_kelas.id_jenis_evaluasi,
          });
        }
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Komponen Evaluasi Kelas Success",
      totalData: dataKomponenEvaluasiKelas.length,
      dataKomponenEvaluasiKelas: dataKomponenEvaluasiKelas,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKomponenEvaluasiKelas,
};
