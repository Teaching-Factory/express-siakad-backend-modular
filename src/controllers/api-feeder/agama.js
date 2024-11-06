const axios = require("axios");
const { getToken } = require("./get-token");
const { Agama, sequelize } = require("../../../models");
const AgamaSeeder = require("../../../seeders/20240430124934-seed-agama");

const getAgama = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetAgama",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataAgama = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const data_agama of dataAgama) {
      // Periksa apakah data sudah ada di tabel
      const existingAgama = await Agama.findOne({
        where: {
          id_agama: data_agama.id_agama,
        },
      });

      if (!existingAgama) {
        // Data belum ada, buat entri baru di database
        await Agama.create({
          id_agama: data_agama.id_agama,
          nama_agama: data_agama.nama_agama,
        });
      }
    }

    // menjalankan seeder
    await AgamaSeeder.up(sequelize.getQueryInterface(), sequelize);

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Agama Success",
      totalData: dataAgama.length,
      dataAgama: dataAgama,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAgama,
};
