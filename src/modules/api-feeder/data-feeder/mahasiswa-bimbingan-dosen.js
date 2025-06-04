const axios = require("axios");
const { getToken } = require("./get-token");
const { MahasiswaBimbinganDosen } = require("../../../../models");

const getMahasiswaBimbinganDosen = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetMahasiswaBimbinganDosen",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataMahasiswaBimbinganDosen = response.data.data;

    // Truncate data
    await MahasiswaBimbinganDosen.destroy({
      where: {}, // Hapus semua data
    });

    // Loop untuk menambahkan data ke dalam database
    for (const mahasiswa_bimbingan_dosen of dataMahasiswaBimbinganDosen) {
      // Periksa apakah data sudah ada di tabel
      const existingMahasiswaBimbinganDosen = await MahasiswaBimbinganDosen.findOne({
        where: {
          id_bimbing_mahasiswa: mahasiswa_bimbingan_dosen.id_bimbing_mahasiswa,
        },
      });

      if (!existingMahasiswaBimbinganDosen) {
        // Data belum ada, buat entri baru di database
        await MahasiswaBimbinganDosen.create({
          id_bimbing_mahasiswa: mahasiswa_bimbingan_dosen.id_bimbing_mahasiswa,
          pembimbing_ke: mahasiswa_bimbingan_dosen.pembimbing_ke,
          last_sync: new Date(),
          id_feeder: mahasiswa_bimbingan_dosen.id_bimbing_mahasiswa,
          id_aktivitas: mahasiswa_bimbingan_dosen.id_aktivitas,
          id_kategori_kegiatan: mahasiswa_bimbingan_dosen.id_kategori_kegiatan,
          id_dosen: mahasiswa_bimbingan_dosen.id_dosen,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Mahasiswa Bimbingan Dosen Success",
      totalData: dataMahasiswaBimbinganDosen.length,
      dataMahasiswaBimbinganDosen: dataMahasiswaBimbinganDosen,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMahasiswaBimbinganDosen,
};
