const axios = require("axios");
const { getToken } = require("./get-token");
const { JenisSubstansi } = require("../../../models");

const getJenisSubstansi = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetJenisSubstansi",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataJenisSubstansi = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const jenis_substansi of dataJenisSubstansi) {
      // Periksa apakah data sudah ada di tabel
      const existingJenisSubstansi = await JenisSubstansi.findOne({
        where: {
          id_jenis_substansi: jenis_substansi.id_jenis_substansi,
        },
      });

      if (!existingJenisSubstansi) {
        // Data belum ada, buat entri baru di database
        await JenisSubstansi.create({
          id_jenis_substansi: jenis_substansi.id_jenis_substansi,
          nama_jenis_substansi: jenis_substansi.nama_jenis_substansi,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Jenis Substansi Success",
      totalData: dataJenisSubstansi.length,
      dataJenisSubstansi: dataJenisSubstansi,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJenisSubstansi,
};
