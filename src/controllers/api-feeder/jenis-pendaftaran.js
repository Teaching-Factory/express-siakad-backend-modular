const axios = require("axios");
const { getToken } = require("./get-token");
const { JenisPendaftaran, sequelize } = require("../../../models");
const JenisPendaftaranSeeder = require("../../../seeders/20240502144649-seed-jenis-pendaftaran");

const getJenisPendaftaran = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetJenisPendaftaran",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataJenisPendaftaran = response.data.data;

    // Truncate data
    await JenisPendaftaran.destroy({
      where: {}, // Hapus semua data
    });

    // Loop untuk menambahkan data ke dalam database
    for (const jenis_pendaftaran of dataJenisPendaftaran) {
      // Periksa apakah data sudah ada di tabel
      const existingJenisPendaftaran = await JenisPendaftaran.findOne({
        where: {
          id_jenis_daftar: jenis_pendaftaran.id_jenis_daftar,
        },
      });

      if (!existingJenisPendaftaran) {
        // Data belum ada, buat entri baru di database
        await JenisPendaftaran.create({
          id_jenis_daftar: jenis_pendaftaran.id_jenis_daftar,
          nama_jenis_daftar: jenis_pendaftaran.nama_jenis_daftar,
          untuk_daftar_sekolah: jenis_pendaftaran.untuk_daftar_sekolah,
        });
      }
    }

    // menjalankan seeder
    await JenisPendaftaranSeeder.up(sequelize.getQueryInterface(), sequelize);

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Jenis Pendaftaran Success",
      totalData: dataJenisPendaftaran.length,
      dataJenisPendaftaran: dataJenisPendaftaran,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJenisPendaftaran,
};
