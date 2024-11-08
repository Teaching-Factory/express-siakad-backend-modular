const axios = require("axios");
const { getToken } = require("./get-token");
const { Kurikulum } = require("../../../models");

const getKurikulum = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetKurikulum",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataKurikulum = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const data_kurikulum of dataKurikulum) {
      // Periksa apakah data sudah ada di tabel
      const existingKurikulum = await Kurikulum.findOne({
        where: {
          id_kurikulum: data_kurikulum.id_kurikulum,
        },
      });

      if (!existingKurikulum) {
        // Data belum ada, buat entri baru di database
        await Kurikulum.create({
          id_kurikulum: data_kurikulum.id_kurikulum,
          nama_kurikulum: data_kurikulum.nama_kurikulum,
          semester_mulai_berlaku: data_kurikulum.semester_mulai_berlaku,
          jumlah_sks_lulus: data_kurikulum.jumlah_sks_lulus,
          jumlah_sks_wajib: data_kurikulum.jumlah_sks_wajib,
          jumlah_sks_pilihan: data_kurikulum.jumlah_sks_pilihan,
          jumlah_sks_mata_kuliah_wajib: data_kurikulum.jumlah_sks_mata_kuliah_wajib,
          jumlah_sks_mata_kuliah_pilihan: data_kurikulum.jumlah_sks_mata_kuliah_pilihan,
          last_sync: new Date(),
          id_feeder: data_kurikulum.id_kurikulum,
          id_prodi: data_kurikulum.id_prodi,
          id_semester: data_kurikulum.id_semester,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Kurikulum Success",
      totalData: dataKurikulum.length,
      dataKurikulum: dataKurikulum,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKurikulum,
};
