const axios = require("axios");
const { getToken } = require("./get-token");
const { JenisPendaftaran } = require("../../../models");

const getJenisPendaftaran = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetJenisPendaftaran",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataJenisPendaftaran = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const jenis_pendaftaran of dataJenisPendaftaran) {
      // Periksa apakah data sudah ada di tabel
      const existingJenisPendaftaran = await JenisPendaftaran.findOne({
        where: {
          id_jenis_daftar: jenis_pendaftaran.id_jenis_daftar,
        },
      });

      if (!existingJenisPendaftaran) {
        // Data belum ada, buat entri baru di database
        await JenisPendaftaran.create({
          id_jenis_daftar: jenis_pendaftaran.id_jenis_daftar,
          nama_jenis_daftar: jenis_pendaftaran.nama_jenis_daftar,
          untuk_daftar_sekolah: jenis_pendaftaran.untuk_daftar_sekolah,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Jenis Pendaftaran Success",
      totalData: dataJenisPendaftaran.length,
      dataJenisPendaftaran: dataJenisPendaftaran,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJenisPendaftaran,
};
