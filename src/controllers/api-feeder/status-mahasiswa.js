const axios = require("axios");
const { getToken } = require("./get-token");
const { StatusMahasiswa } = require("../../../models");

const getStatusMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetStatusMahasiswa",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataStatusMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const status_mahasiswa of dataStatusMahasiswa) {
      // Periksa apakah data sudah ada di tabel
      const existingStatusMahasiswa = await StatusMahasiswa.findOne({
        where: {
          id_status_mahasiswa: status_mahasiswa.id_status_mahasiswa,
        },
      });

      if (!existingStatusMahasiswa) {
        // Data belum ada, buat entri baru di database
        await StatusMahasiswa.create({
          id_status_mahasiswa: status_mahasiswa.id_status_mahasiswa,
          nama_status_mahasiswa: status_mahasiswa.nama_status_mahasiswa,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Status Mahasiswa Success",
      totalData: dataStatusMahasiswa.length,
      dataStatusMahasiswa: dataStatusMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStatusMahasiswa,
};
