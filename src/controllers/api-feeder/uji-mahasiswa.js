const axios = require("axios");
const { getToken } = require("./get-token");
const { UjiMahasiswa } = require("../../../models");

const getUjiMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetListUjiMahasiswa",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataUjiMahasiswa = response.data.data;

    // Truncate data
    await UjiMahasiswa.destroy({
      where: {}, // Hapus semua data
    });

    // Loop untuk menambahkan data ke dalam database
    for (const uji_mahasiswa of dataUjiMahasiswa) {
      // Periksa apakah data sudah ada di tabel
      const existingUjiMahasiswa = await UjiMahasiswa.findOne({
        where: {
          id_uji: uji_mahasiswa.id_uji,
        },
      });

      if (!existingUjiMahasiswa) {
        // Data belum ada, buat entri baru di database
        await UjiMahasiswa.create({
          id_uji: uji_mahasiswa.id_uji,
          penguji_ke: uji_mahasiswa.penguji_ke,
          last_sync: new Date(),
          id_feeder: uji_mahasiswa.id_uji,
          id_aktivitas: uji_mahasiswa.id_aktivitas,
          id_kategori_kegiatan: uji_mahasiswa.id_kategori_kegiatan,
          id_dosen: uji_mahasiswa.id_dosen,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Uji Mahasiswa Success",
      totalData: dataUjiMahasiswa.length,
      dataUjiMahasiswa: dataUjiMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUjiMahasiswa,
};
