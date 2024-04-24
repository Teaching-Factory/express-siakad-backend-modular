const axios = require("axios");
const { getToken } = require("./get-token");
const { Negara } = require("../../../models");

const getNegara = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetNegara",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataNegara = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const negara of dataNegara) {
      // Periksa apakah data sudah ada di tabel
      const existingNegara = await Negara.findOne({
        where: {
          id_negara: negara.id_negara,
        },
      });

      if (!existingNegara) {
        // Data belum ada, buat entri baru di database
        await Negara.create({
          id_negara: negara.id_negara,
          nama_negara: negara.nama_negara,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Negara Success",
      totalData: dataNegara.length,
      dataNegara: dataNegara,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNegara,
};
