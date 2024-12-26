const axios = require("axios");
const { getToken } = require("../api-feeder/get-token");

const getDetailNilaiPerkuliahanKelas = async (req, res, next) => {
  try {
    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    const requestBody = {
      act: "GetDetailNilaiPerkuliahanKelas",
      token: `${token}`,
      filter: `id_kelas_kuliah = '${kelasKuliahId}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataDetailNilaiPerkuliahanKelas = response.data.data;

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Get Detail Nilai Perkuliahan Kelas Success",
      totalData: dataDetailNilaiPerkuliahanKelas.length,
      dataDetailNilaiPerkuliahanKelas: dataDetailNilaiPerkuliahanKelas,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDetailNilaiPerkuliahanKelas,
};
