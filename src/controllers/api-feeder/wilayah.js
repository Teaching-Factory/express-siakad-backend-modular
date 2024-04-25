const axios = require("axios");
const { getToken } = require("./get-token");
const { Wilayah } = require("../../../models");

const getWilayah = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetWilayah",
      token: `${token}`,
      filter: `id_negara='ID'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataWilayah = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const wilayah of dataWilayah) {
      // Periksa apakah data sudah ada di tabel
      const existingWilayah = await Wilayah.findOne({
        where: {
          id_wilayah: wilayah.id_wilayah,
        },
      });

      if (!existingWilayah) {
        // Data belum ada, buat entri baru di database
        await Wilayah.create({
          id_wilayah: wilayah.id_wilayah,
          nama_wilayah: wilayah.nama_wilayah,
          id_negara: wilayah.id_negara,
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
