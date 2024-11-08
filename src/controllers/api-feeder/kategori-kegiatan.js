const axios = require("axios");
const { getToken } = require("./get-token");
const { KategoriKegiatan } = require("../../../models");

const getKategoriKegiatan = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetKategoriKegiatan",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataKategoriKegiatan = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const kategori_kegiatan of dataKategoriKegiatan) {
      // Periksa apakah data sudah ada di tabel
      const existingKategoriKegiatan = await KategoriKegiatan.findOne({
        where: {
          id_kategori_kegiatan: kategori_kegiatan.id_kategori_kegiatan,
        },
      });

      if (!existingKategoriKegiatan) {
        // Data belum ada, buat entri baru di database
        await KategoriKegiatan.create({
          id_kategori_kegiatan: kategori_kegiatan.id_kategori_kegiatan,
          nama_kategori_kegiatan: kategori_kegiatan.nama_kategori_kegiatan,
          last_sync: new Date(),
          id_feeder: kategori_kegiatan.id_kategori_kegiatan,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Kategori Kegiatan Success",
      totalData: dataKategoriKegiatan.length,
      dataKategoriKegiatan: dataKategoriKegiatan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKategoriKegiatan,
};
