const axios = require("axios");
const { getToken } = require("./get-token");
const { JenjangPendidikan } = require("../../../models");

const getJenjangPendidikan = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetJenjangPendidikan",
      token: `${token}`
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataJenjangPendidikan = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const jenjang_pendidikan of dataJenjangPendidikan) {
      // Periksa apakah data sudah ada di tabel
      const existingJenjangPendidikan = await JenjangPendidikan.findOne({
        where: {
          id_jenjang_didik: jenjang_pendidikan.id_jenjang_didik
        }
      });

      if (!existingJenjangPendidikan) {
        // Data belum ada, buat entri baru di database
        await JenjangPendidikan.create({
          id_jenjang_didik: jenjang_pendidikan.id_jenjang_didik,
          nama_jenjang_didik: jenjang_pendidikan.nama_jenjang_didik
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Jenjang Pendidikan Success",
      totalData: dataJenjangPendidikan.length,
      dataJenjangPendidikan: dataJenjangPendidikan
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJenjangPendidikan
};
