const axios = require("axios");
const { getToken } = require("./get-token");
const { Penghasilan } = require("../../../models");

const getPenghasilan = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetPenghasilan",
      token: `${token}`
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataPenghasilan = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const data_penghasilan of dataPenghasilan) {
      // Periksa apakah data sudah ada di tabel
      const existingPenghasilan = await Penghasilan.findOne({
        where: {
          id_penghasilan: data_penghasilan.id_penghasilan
        }
      });

      if (!existingPenghasilan) {
        // Data belum ada, buat entri baru di database
        await Penghasilan.create({
          id_penghasilan: data_penghasilan.id_penghasilan,
          nama_penghasilan: data_penghasilan.nama_penghasilan
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Penghasilan Success",
      totalData: dataPenghasilan.length,
      dataPenghasilan: dataPenghasilan
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPenghasilan
};
