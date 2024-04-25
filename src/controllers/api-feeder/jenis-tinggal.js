const axios = require("axios");
const { getToken } = require("./get-token");
const { JenisTinggal } = require("../../../models");

const getJenisTinggal = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetJenisTinggal",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataJenisTinggal = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const jenis_tinggal of dataJenisTinggal) {
      // Periksa apakah data sudah ada di tabel
      const existingJenisTinggal = await JenisTinggal.findOne({
        where: {
          id_jenis_tinggal: jenis_tinggal.id_jenis_tinggal,
        },
      });

      if (!existingJenisTinggal) {
        // Data belum ada, buat entri baru di database
        await JenisTinggal.create({
          id_jenis_tinggal: jenis_tinggal.id_jenis_tinggal,
          nama_jenis_tinggal: jenis_tinggal.nama_jenis_tinggal,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Jenis Tinggal Success",
      totalData: dataJenisTinggal.length,
      dataJenisTinggal: dataJenisTinggal,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJenisTinggal,
};
