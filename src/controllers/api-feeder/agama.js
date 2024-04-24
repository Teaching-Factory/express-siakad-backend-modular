const axios = require("axios");
const { getToken } = require("./get-token");
const { Agama } = require("../../../models");

const getAgama = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetAgama",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataAgama = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const agama of dataAgama) {
      // Periksa apakah data sudah ada di tabel
      const existingAgama = await Agama.findOne({
        where: {
          id_agama: agama.id_agama,
        },
      });

      if (!existingAgama) {
        // Data belum ada, buat entri baru di database
        await Agama.create({
          id_agama: agama.id_agama,
          nama_agama: agama.nama_agama,
        });
      }
    }

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
