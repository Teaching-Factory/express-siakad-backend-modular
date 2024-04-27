const axios = require("axios");
const { getToken } = require("./get-token");
const { Pembiayaan } = require("../../../models");

const getPembiayaan = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetPembiayaan",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataPembiayaan = response.data.data;

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
