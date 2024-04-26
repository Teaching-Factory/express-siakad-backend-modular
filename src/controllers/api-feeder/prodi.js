const axios = require("axios");
const { getToken } = require("./get-token");
const { Prodi } = require("../../../models");

const getProdi = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetProdi",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataProdi = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const data_prodi of dataProdi) {
      // Periksa apakah data sudah ada di tabel
      const existingProdi = await Prodi.findOne({
        where: {
          id_prodi: data_prodi.id_prodi,
        },
      });

      if (!existingProdi) {
        // Data belum ada, buat entri baru di database
        await Prodi.create({
          id_prodi: data_prodi.id_prodi,
          kode_program_studi: data_prodi.kode_program_studi,
          nama_program_studi: data_prodi.nama_program_studi,
          status: data_prodi.status,
          id_jenjang_pendidikan: data_prodi.id_jenjang_pendidikan,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Prodi Success",
      totalData: dataProdi.length,
      dataProdi: dataProdi,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProdi,
};
