const axios = require("axios");
const { getToken } = require("./get-token");
const { KebutuhanKhusus } = require("../../../models");

const getKebutuhanKhusus = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetKebutuhanKhusus",
      token: `${token}`
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataKebutuhanKhusus = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const kebutuhan_khusus of dataKebutuhanKhusus) {
      // Periksa apakah data sudah ada di tabel
      const existingKebutuhanKhusus = await KebutuhanKhusus.findOne({
        where: {
          id_kebutuhan_khusus: kebutuhan_khusus.id_kebutuhan_khusus
        }
      });

      if (!existingKebutuhanKhusus) {
        // Data belum ada, buat entri baru di database
        await KebutuhanKhusus.create({
          id_kebutuhan_khusus: kebutuhan_khusus.id_kebutuhan_khusus,
          nama_kebutuhan_khusus: kebutuhan_khusus.nama_kebutuhan_khusus
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Kebutuhan Khusus Success",
      totalData: dataKebutuhanKhusus.length,
      dataKebutuhanKhusus: dataKebutuhanKhusus
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKebutuhanKhusus
};
