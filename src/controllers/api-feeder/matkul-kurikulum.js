const axios = require("axios");
const { getToken } = require("./get-token");
const { MatkulKurikulum, sequelize } = require("../../../models");

const getMatkulKurikulum = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetMatkulKurikulum",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataMatkulKurikulum = response.data.data;

    // Truncate data
    await MatkulKurikulum.destroy({
      where: {}, // Hapus semua data
    });

    await sequelize.query("ALTER TABLE matkul_kurikulums AUTO_INCREMENT = 1");

    // Loop untuk menambahkan data ke dalam database
    for (const matkul_kurikulum of dataMatkulKurikulum) {
      await MatkulKurikulum.create({
        id_matkul_kurikulum: matkul_kurikulum.id_matkul_kurikulum,
        semester: matkul_kurikulum.semester,
        apakah_wajib: matkul_kurikulum.apakah_wajib,
        tgl_create: matkul_kurikulum.tgl_create,
        id_kurikulum: matkul_kurikulum.id_kurikulum,
        id_matkul: matkul_kurikulum.id_matkul,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Matkul Kurikulum Success",
      totalData: dataMatkulKurikulum.length,
      dataMatkulKurikulum: dataMatkulKurikulum,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMatkulKurikulum,
};
