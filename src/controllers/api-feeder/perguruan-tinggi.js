const axios = require("axios");
const { getToken } = require("./get-token");
const { PerguruanTinggi } = require("../../../models");

const getAllPerguruanTinggi = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetAllPT",
      token: `${token}`,
      filter: `nama_singkat='UBI'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataPerguruanTinggi = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const perguruan_tinggi of dataPerguruanTinggi) {
      // Periksa apakah data sudah ada di tabel
      const existingPerguruanTinggi = await PerguruanTinggi.findOne({
        where: {
          id_perguruan_tinggi: perguruan_tinggi.id_perguruan_tinggi,
        },
      });

      if (!existingPerguruanTinggi) {
        // Data belum ada, buat entri baru di database
        await PerguruanTinggi.create({
          id_perguruan_tinggi: perguruan_tinggi.id_perguruan_tinggi,
          kode_perguruan_tinggi: perguruan_tinggi.kode_perguruan_tinggi,
          nama_perguruan_tinggi: perguruan_tinggi.nama_perguruan_tinggi,
          nama_singkat: perguruan_tinggi.nama_singkat,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Perguruan Tinggi Success",
      totalData: dataPerguruanTinggi.length,
      dataPerguruanTinggi: dataPerguruanTinggi,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPerguruanTinggi,
};
