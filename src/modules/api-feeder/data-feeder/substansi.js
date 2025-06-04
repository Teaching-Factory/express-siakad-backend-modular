const axios = require("axios");
const { getToken } = require("./get-token");
const { Substansi } = require("../../../../models");

const getSubstansi = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetSubstansi",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataSubstansi = response.data.data;

    // Truncate data
    await Substansi.destroy({
      where: {}, // Hapus semua data
    });

    // Loop untuk menambahkan data ke dalam database
    for (const data_substansi of dataSubstansi) {
      // Periksa apakah data sudah ada di tabel
      const existingSubstansi = await Substansi.findOne({
        where: {
          id_substansi: data_substansi.id_substansi,
        },
      });

      if (!existingSubstansi) {
        // Data belum ada, buat entri baru di database
        await Substansi.create({
          id_substansi: data_substansi.id_substansi,
          nama_substansi: data_substansi.nama_substansi,
          sks_mata_kuliah: data_substansi.sks_mata_kuliah,
          sks_tatap_muka: data_substansi.sks_tatap_muka,
          sks_praktek: data_substansi.sks_praktek,
          sks_praktek_lapangan: data_substansi.sks_praktek_lapangan,
          sks_simulasi: data_substansi.sks_simulasi,
          last_sync: new Date(),
          id_feeder: data_substansi.id_substansi,
          id_prodi: data_substansi.id_prodi,
          id_jenis_substansi: data_substansi.id_jenis_substansi,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Substansi Success",
      totalData: dataSubstansi.length,
      dataSubstansi: dataSubstansi,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubstansi,
};
