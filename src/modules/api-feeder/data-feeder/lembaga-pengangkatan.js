const axios = require("axios");
const { getToken } = require("./get-token");
const { LembagaPengangkatan, sequelize } = require("../../../../models");
const LembagaPengangkatanSeeder = require("../../../../seeders/20240430133738-seed-lembaga-pengangkatan");

const getLembagaPengangkatan = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetLembagaPengangkat",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataLembagaPengangkatan = response.data.data;

    // Truncate data
    await LembagaPengangkatan.destroy({
      where: {}, // Hapus semua data
    });

    // Loop untuk menambahkan data ke dalam database
    for (const lembaga_pengangkatan of dataLembagaPengangkatan) {
      // Periksa apakah data sudah ada di tabel
      const existingLembagaPengangkatan = await LembagaPengangkatan.findOne({
        where: {
          id_lembaga_angkat: lembaga_pengangkatan.id_lembaga_angkat,
        },
      });

      if (!existingLembagaPengangkatan) {
        // Data belum ada, buat entri baru di database
        await LembagaPengangkatan.create({
          id_lembaga_angkat: lembaga_pengangkatan.id_lembaga_angkat,
          nama_lembaga_angkat: lembaga_pengangkatan.nama_lembaga_angkat,
        });
      }
    }

    // menjalankan seeder
    await LembagaPengangkatanSeeder.up(sequelize.getQueryInterface(), sequelize);

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Lembaga Pengangkatan Success",
      totalData: dataLembagaPengangkatan.length,
      dataLembagaPengangkatan: dataLembagaPengangkatan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLembagaPengangkatan,
};
