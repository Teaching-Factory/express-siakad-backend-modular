const axios = require("axios");
const { getToken } = require("./get-token");
const { Pembiayaan, sequelize } = require("../../../../models");
const PembiayaanSeeder = require("../../../../seeders/20240702091020-seed-table-pembiayaan");

const getPembiayaan = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetPembiayaan",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataPembiayaan = response.data.data;

    // Truncate data
    await Pembiayaan.destroy({
      where: {}, // Hapus semua data
    });

    await sequelize.query("ALTER TABLE pembiayaans AUTO_INCREMENT = 1");

    // Loop untuk menambahkan data ke dalam database
    for (const data_pembiayaan of dataPembiayaan) {
      // Periksa apakah data sudah ada di tabel
      const existingPembiayaan = await Pembiayaan.findOne({
        where: {
          id_pembiayaan: data_pembiayaan.id_pembiayaan,
        },
      });

      if (!existingPembiayaan) {
        // Data belum ada, buat entri baru di database
        await Pembiayaan.create({
          id_pembiayaan: data_pembiayaan.id_pembiayaan,
          nama_pembiayaan: data_pembiayaan.nama_pembiayaan,
        });
      }
    }

    // menjalankan seeder
    await PembiayaanSeeder.up(sequelize.getQueryInterface(), sequelize);

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Pembiayaan Success",
      totalData: dataPembiayaan.length,
      dataPembiayaan: dataPembiayaan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPembiayaan,
};
