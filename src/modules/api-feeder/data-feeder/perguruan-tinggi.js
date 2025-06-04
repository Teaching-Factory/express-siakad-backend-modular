const axios = require("axios");
const { getToken } = require("./get-token");
const { PerguruanTinggi } = require("../../../../models");

const getAllPerguruanTinggi = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetAllPT",
      token: `${token}`,
      // filter: `nama_singkat='UBI'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataPerguruanTinggi = response.data.data;

    // Truncate data
    await PerguruanTinggi.destroy({
      where: {}, // Hapus semua data
    });

    // Loop untuk menambahkan data ke dalam database
    for (const perguruan_tinggi of dataPerguruanTinggi) {
      // Periksa apakah data sudah ada di tabel
      const existingPerguruanTinggi = await PerguruanTinggi.findOne({
        where: {
          id_perguruan_tinggi: perguruan_tinggi.id_perguruan_tinggi,
        },
      });

      if (!existingPerguruanTinggi) {
        // Data belum ada, buat entri baru di database
        await PerguruanTinggi.create({
          id_perguruan_tinggi: perguruan_tinggi.id_perguruan_tinggi,
          kode_perguruan_tinggi: perguruan_tinggi.kode_perguruan_tinggi,
          nama_perguruan_tinggi: perguruan_tinggi.nama_perguruan_tinggi,
          nama_singkat: perguruan_tinggi.nama_singkat,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Perguruan Tinggi Success",
      totalData: dataPerguruanTinggi.length,
      dataPerguruanTinggi: dataPerguruanTinggi,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPerguruanTinggi,
};
