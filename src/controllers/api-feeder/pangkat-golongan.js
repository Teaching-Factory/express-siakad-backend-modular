const axios = require("axios");
const { getToken } = require("./get-token");
const { PangkatGolongan } = require("../../../models");

const getPangkatGolongan = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetPangkatGolongan",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataPangkatGolongan = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const pangkat_golongan of dataPangkatGolongan) {
      // Periksa apakah data sudah ada di tabel
      const existingPangkatGolongan = await PangkatGolongan.findOne({
        where: {
          id_pangkat_golongan: pangkat_golongan.id_pangkat_golongan,
        },
      });

      if (!existingPangkatGolongan) {
        // Data belum ada, buat entri baru di database
        await PangkatGolongan.create({
          id_pangkat_golongan: pangkat_golongan.id_pangkat_golongan,
          kode_golongan: pangkat_golongan.kode_golongan,
          nama_pangkat: pangkat_golongan.nama_pangkat,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Pangkat Golongan Success",
      totalData: dataPangkatGolongan.length,
      dataPangkatGolongan: dataPangkatGolongan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPangkatGolongan,
};
