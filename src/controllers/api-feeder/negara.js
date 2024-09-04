const axios = require("axios");
const { getToken } = require("./get-token");
const { Negara } = require("../../../models");

const getNegara = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetNegara",
      token: `${token}`,
      filter: `id_negara='ID'`
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataNegara = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const data_negara of dataNegara) {
      // Periksa apakah data sudah ada di tabel
      const existingNegara = await Negara.findOne({
        where: {
          id_negara: data_negara.id_negara
        }
      });

      if (!existingNegara) {
        // Data belum ada, buat entri baru di database
        await Negara.create({
          id_negara: data_negara.id_negara,
          nama_negara: data_negara.nama_negara
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Negara Success",
      totalData: dataNegara.length,
      dataNegara: dataNegara
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNegara
};
