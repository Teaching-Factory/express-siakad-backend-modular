const axios = require("axios");
const { getToken } = require("./get-token");
const { Wilayah } = require("../../../../models");

const getWilayah = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetWilayah",
      token: `${token}`,
      filter: `id_negara='ID'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataWilayah = response.data.data;

    // Truncate data
    await Wilayah.destroy({
      where: {}, // Hapus semua data
    });

    // Loop untuk menambahkan data ke dalam database
    for (const data_wilayah of dataWilayah) {
      // Periksa apakah data sudah ada di tabel
      const existingWilayah = await Wilayah.findOne({
        where: {
          id_wilayah: data_wilayah.id_wilayah,
        },
      });

      if (!existingWilayah) {
        // Data belum ada, buat entri baru di database
        await Wilayah.create({
          id_wilayah: data_wilayah.id_wilayah,
          nama_wilayah: data_wilayah.nama_wilayah,
          id_negara: data_wilayah.id_negara,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Wilayah Success",
      totalData: dataWilayah.length,
      dataWilayah: dataWilayah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWilayah,
};
