const axios = require("axios");
const { getToken } = require("./get-token");
const { LembagaPengangkatan } = require("../../../models");

const getLembagaPengangkatan = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetLembagaPengangkat",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataLembagaPengangkatan = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const lembaga_pengangkatan of dataLembagaPengangkatan) {
      // Periksa apakah data sudah ada di tabel
      const existingLembagaPengangkatan = await LembagaPengangkatan.findOne({
        where: {
          id_lembaga_angkat: lembaga_pengangkatan.id_lembaga_angkat,
        },
      });

      if (!existingLembagaPengangkatan) {
        // Data belum ada, buat entri baru di database
        await LembagaPengangkatan.create({
          id_lembaga_angkat: lembaga_pengangkatan.id_lembaga_angkat,
          nama_lembaga_angkat: lembaga_pengangkatan.nama_lembaga_angkat,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Lembaga Pengangkatan Success",
      totalData: dataLembagaPengangkatan.length,
      dataLembagaPengangkatan: dataLembagaPengangkatan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLembagaPengangkatan,
};
