const axios = require("axios");
const { getToken } = require("./get-token");
const { Pekerjaan } = require("../../../models");

const getPekerjaan = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetPekerjaan",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataPekerjaan = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const pekerjaan of dataPekerjaan) {
      // Periksa apakah data sudah ada di tabel
      const existingPekerjaan = await Pekerjaan.findOne({
        where: {
          id_pekerjaan: pekerjaan.id_pekerjaan,
        },
      });

      if (!existingPekerjaan) {
        // Data belum ada, buat entri baru di database
        await Pekerjaan.create({
          id_pekerjaan: pekerjaan.id_pekerjaan,
          nama_pekerjaan: pekerjaan.nama_pekerjaan,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Pekerjaan Success",
      totalData: dataPekerjaan.length,
      dataPekerjaan: dataPekerjaan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPekerjaan,
};
