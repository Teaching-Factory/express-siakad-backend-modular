const axios = require("axios");
const { getToken } = require("./get-token");
const { SubstansiKuliah } = require("../../../../models");

const getSubstansiKuliah = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetListSubstansiKuliah",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataSubstansiKuliah = response.data.data;

    // Truncate data
    await SubstansiKuliah.destroy({
      where: {}, // Hapus semua data
    });

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
