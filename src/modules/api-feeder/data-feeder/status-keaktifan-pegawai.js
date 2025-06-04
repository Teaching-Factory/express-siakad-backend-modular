const axios = require("axios");
const { getToken } = require("./get-token");
const { StatusKeaktifanPegawai, sequelize } = require("../../../../models");
const StatusKeaktifanPegawaiSeeder = require("../../../../seeders/20240430125937-seed-status-keaktifan-pegawai");

const getStatusKeaktifanPegawai = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetStatusKeaktifanPegawai",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataStatusKeaktifanPegawai = response.data.data;

    // Truncate data
    await StatusKeaktifanPegawai.destroy({
      where: {}, // Hapus semua data
    });

    await sequelize.query("ALTER TABLE status_keaktifan_pegawais AUTO_INCREMENT = 1");

    // Loop untuk menambahkan data ke dalam database
    for (const status_keaktifan_pegawai of dataStatusKeaktifanPegawai) {
      // Periksa apakah data sudah ada di tabel
      const existingStatusKeaktifanPegawai = await StatusKeaktifanPegawai.findOne({
        where: {
          id_status_aktif: status_keaktifan_pegawai.id_status_aktif,
        },
      });

      if (!existingStatusKeaktifanPegawai) {
        // Data belum ada, buat entri baru di database
        await StatusKeaktifanPegawai.create({
          id_status_aktif: status_keaktifan_pegawai.id_status_aktif,
          nama_status_aktif: status_keaktifan_pegawai.nama_status_aktif,
        });
      }
    }

    // menjalankan seeder
    await StatusKeaktifanPegawaiSeeder.up(sequelize.getQueryInterface(), sequelize);

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Status Keaktifan Pegawai Success",
      totalData: dataStatusKeaktifanPegawai.length,
      dataStatusKeaktifanPegawai: dataStatusKeaktifanPegawai,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStatusKeaktifanPegawai,
};
