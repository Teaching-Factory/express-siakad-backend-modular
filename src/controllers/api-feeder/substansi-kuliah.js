const axios = require("axios");
const { getToken } = require("./get-token");
const { SubstansiKuliah } = require("../../../models");

const getSubstansiKuliah = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetListSubstansiKuliah",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataSubstansiKuliah = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const substansi_kuliah of dataSubstansiKuliah) {
      // Buat entri baru di database
      await SubstansiKuliah.create({
        id_substansi: substansi_kuliah.id_substansi,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Substansi Kuliah Success",
      totalData: dataSubstansiKuliah.length,
      dataSubstansiKuliah: dataSubstansiKuliah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubstansiKuliah,
};
