const axios = require("axios");
const { getToken } = require("./get-token");
const { DetailKurikulum } = require("../../../models");

const getDetailKurikulum = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetDetailKurikulum",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataDetailKurikulum = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const detail_kurikulum of dataDetailKurikulum) {
      await DetailKurikulum.create({
        id_detail_kurikulum: detail_kurikulum.id_detail_kurikulum,
        sks_wajib: detail_kurikulum.jumlah_sks_wajib,
        sks_pilihan: detail_kurikulum.jumlah_sks_pilihan,
        id_kurikulum: detail_kurikulum.id_kurikulum,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Detail Kurikulum Success",
      totalData: dataDetailKurikulum.length,
      dataDetailKurikulum: dataDetailKurikulum,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDetailKurikulum,
};
