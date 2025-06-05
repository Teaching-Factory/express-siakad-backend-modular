const axios = require("axios");
const { getToken } = require("../../api-feeder/data-feeder/get-token");

const getListMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetListMahasiswa",
      token: `${token}`,
      order: "id_registrasi_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataMahasiswa = response.data.data;

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Get List Mahasiswa Success",
      totalData: dataMahasiswa.length,
      dataMahasiswa: dataMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListMahasiswa,
};
