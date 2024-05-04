const axios = require("axios");
const { getToken } = require("./get-token");
const { DetailPerkuliahanMahasiswa } = require("../../../models");

const getDetailPerkuliahanMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetDetailPerkuliahanMahasiswa",
      token: `${token}`,
      filter: `angkatan = '2023'`,
      order: "id_registrasi_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataDetailPerkuliahanMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const detail_perkuliahan_mahasiswa of dataDetailPerkuliahanMahasiswa) {
      await DetailPerkuliahanMahasiswa.create({
        angkatan: detail_perkuliahan_mahasiswa.angkatan,
        ips: detail_perkuliahan_mahasiswa.ips,
        ipk: detail_perkuliahan_mahasiswa.ipk,
        sks_semester: detail_perkuliahan_mahasiswa.sks_semester,
        sks_total: detail_perkuliahan_mahasiswa.sks_total,
        id_registrasi_mahasiswa: detail_perkuliahan_mahasiswa.id_registrasi_mahasiswa,
        id_semester: detail_perkuliahan_mahasiswa.id_semester,
        id_status_mahasiswa: detail_perkuliahan_mahasiswa.id_status_mahasiswa,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Detail Perkuliahan Mahasiswa Success",
      totalData: dataDetailPerkuliahanMahasiswa.length,
      dataDetailPerkuliahanMahasiswa: dataDetailPerkuliahanMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDetailPerkuliahanMahasiswa,
};
