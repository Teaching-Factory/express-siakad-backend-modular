const axios = require("axios");
const { getToken } = require("./get-token");
const { JenisSMS } = require("../../../../models");

const getJenisSms = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetJenisSMS",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataJenisSms = response.data.data;

    // Truncate data
    await JenisSMS.destroy({
      where: {}, // Hapus semua data
    });

    // Loop untuk menambahkan data ke dalam database
    for (const jenis_sms of dataJenisSms) {
      // Periksa apakah data sudah ada di tabel
      const existingJenisSms = await JenisSMS.findOne({
        where: {
          id_jenis_sms: jenis_sms.id_jenis_sms,
        },
      });

      if (!existingJenisSms) {
        // Data belum ada, buat entri baru di database
        await JenisSMS.create({
          id_jenis_sms: jenis_sms.id_jenis_sms,
          nama_jenis_sms: jenis_sms.nama_jenis_sms,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Jenis SMS Success",
      totalData: dataJenisSms.length,
      dataJenisSms: dataJenisSms,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJenisSms,
};
