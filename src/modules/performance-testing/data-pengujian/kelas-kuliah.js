const axios = require("axios");
const { getToken } = require("../../api-feeder/data-feeder/get-token");

const getListKelasKuliah = async (req, res, next) => {
  try {
    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetListKelasKuliah",
      token: `${token}`,
      order: "id_kelas_kuliah",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataKelasKuliah = response.data.data;

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Get List Kelas Kuliah Success",
      totalData: dataKelasKuliah.length,
      dataKelasKuliah: dataKelasKuliah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListKelasKuliah,
};
