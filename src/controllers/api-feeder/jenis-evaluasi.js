const axios = require("axios");
const { getToken } = require("./get-token");
const { JenisEvaluasi } = require("../../../models");

const getJenisEvaluasi = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetJenisEvaluasi",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const jenisEvaluasi = response.data.data;

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
