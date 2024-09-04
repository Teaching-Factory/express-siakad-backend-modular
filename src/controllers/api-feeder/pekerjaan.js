const axios = require("axios");
const { getToken } = require("./get-token");
const { Pekerjaan } = require("../../../models");

const getPekerjaan = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetPekerjaan",
      token: `${token}`
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataPekerjaan = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const data_pekerjaan of dataPekerjaan) {
      // Periksa apakah data sudah ada di tabel
      const existingPekerjaan = await Pekerjaan.findOne({
        where: {
          id_pekerjaan: data_pekerjaan.id_pekerjaan
        }
      });

      if (!existingPekerjaan) {
        // Data belum ada, buat entri baru di database
        await Pekerjaan.create({
          id_pekerjaan: data_pekerjaan.id_pekerjaan,
          nama_pekerjaan: data_pekerjaan.nama_pekerjaan
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Pekerjaan Success",
      totalData: dataPekerjaan.length,
      dataPekerjaan: dataPekerjaan
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPekerjaan
};
