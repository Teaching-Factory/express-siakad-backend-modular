const axios = require("axios");
const { getToken } = require("./get-token");
const { MahasiswaBimbinganDosen } = require("../../../models");

const getMahasiswaBimbinganDosen = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetMahasiswaBimbinganDosen",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataMahasiswaBimbinganDosen = response.data.data;

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
