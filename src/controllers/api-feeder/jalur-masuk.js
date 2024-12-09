const axios = require("axios");
const { getToken } = require("./get-token");
const { JalurMasuk } = require("../../../models");

const getJalurMasuk = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetJalurMasuk",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataJalurMasuk = response.data.data;

    // Truncate data
    await JalurMasuk.destroy({
      where: {}, // Hapus semua data
    });

    // Loop untuk menambahkan data ke dalam database
    for (const jalur_masuk of dataJalurMasuk) {
      // Periksa apakah data sudah ada di tabel
      const existingJalurMasuk = await JalurMasuk.findOne({
        where: {
          id_jalur_masuk: jalur_masuk.id_jalur_masuk,
        },
      });

      if (!existingJalurMasuk) {
        // Data belum ada, buat entri baru di database
        await JalurMasuk.create({
          id_jalur_masuk: jalur_masuk.id_jalur_masuk,
          nama_jalur_masuk: jalur_masuk.nama_jalur_masuk,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Jalur Masuk Success",
      totalData: dataJalurMasuk.length,
      dataJalurMasuk: dataJalurMasuk,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJalurMasuk,
};
