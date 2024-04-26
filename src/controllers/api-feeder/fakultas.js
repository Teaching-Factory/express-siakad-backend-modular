const axios = require("axios");
const { getToken } = require("./get-token");
const { Fakultas } = require("../../../models");

const getFakultas = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetFakultas",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataFakultas = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const data_fakultas of dataFakultas) {
      // Periksa apakah data sudah ada di tabel
      const existingFakultas = await Fakultas.findOne({
        where: {
          id_fakultas: data_fakultas.id_fakultas,
        },
      });

      if (!existingFakultas) {
        // Data belum ada, buat entri baru di database
        await Fakultas.create({
          id_fakultas: data_fakultas.id_fakultas,
          nama_fakultas: data_fakultas.nama_fakultas,
          status: data_fakultas.status,
          id_jenjang_pendidikan: data_fakultas.id_jenjang_pendidikan,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Fakultas Success",
      totalData: dataFakultas.length,
      dataFakultas: dataFakultas,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFakultas,
};
