const axios = require("axios");
const { getToken } = require("./get-token");
const { JenisEvaluasi, sequelize } = require("../../../models");

const getJenisEvaluasi = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetJenisEvaluasi",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const jenisEvaluasi = response.data.data;

    // Truncate data
    await JenisEvaluasi.destroy({
      where: {}, // Hapus semua data
    });

    await sequelize.query("ALTER TABLE jenis_evaluasis AUTO_INCREMENT = 1");

    // Loop untuk menambahkan data ke dalam database
    for (const jenis_evaluasi of jenisEvaluasi) {
      // Periksa apakah data sudah ada di tabel
      const existingJenisEvaluasi = await JenisEvaluasi.findOne({
        where: {
          id_jenis_evaluasi: jenis_evaluasi.id_jenis_evaluasi,
        },
      });

      if (!existingJenisEvaluasi) {
        // Data belum ada, buat entri baru di database
        await JenisEvaluasi.create({
          id_jenis_evaluasi: jenis_evaluasi.id_jenis_evaluasi,
          nama_jenis_evaluasi: jenis_evaluasi.nama_jenis_evaluasi,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Jenis Evaluasi Success",
      totalData: jenisEvaluasi.length,
      jenisEvaluasi: jenisEvaluasi,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJenisEvaluasi,
};
