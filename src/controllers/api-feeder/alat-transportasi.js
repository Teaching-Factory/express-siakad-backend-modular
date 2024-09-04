const axios = require("axios");
const { getToken } = require("./get-token");
const { AlatTransportasi } = require("../../../models");

const getAlatTransportasi = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetAlatTransportasi",
      token: `${token}`
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataAlatTransportasi = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const alat_transportasi of dataAlatTransportasi) {
      // Periksa apakah data sudah ada di tabel
      const existingAlatTransportasi = await AlatTransportasi.findOne({
        where: {
          id_alat_transportasi: alat_transportasi.id_alat_transportasi
        }
      });

      if (!existingAlatTransportasi) {
        // Data belum ada, buat entri baru di database
        await AlatTransportasi.create({
          id_alat_transportasi: alat_transportasi.id_alat_transportasi,
          nama_alat_transportasi: alat_transportasi.nama_alat_transportasi
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Alat Transportasi Success",
      totalData: dataAlatTransportasi.length,
      dataAlatTransportasi: dataAlatTransportasi
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlatTransportasi
};
