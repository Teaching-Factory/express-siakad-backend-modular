const axios = require("axios");
const { getToken } = require("../../api-feeder/data-feeder/get-token");

const getWilayah = async (req, res, next) => {
  try {
    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetWilayah",
      token: `${token}`,
      order: "id_wilayah",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataWilayah = response.data.data;

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Get Wilayah Success",
      totalData: dataWilayah.length,
      dataWilayah: dataWilayah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWilayah,
};
