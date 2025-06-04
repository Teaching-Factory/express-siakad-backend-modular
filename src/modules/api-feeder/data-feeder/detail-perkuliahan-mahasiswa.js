const axios = require("axios");
const { getToken } = require("./get-token");
const { DetailPerkuliahanMahasiswa, sequelize } = require("../../../../models");

const getDetailPerkuliahanMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    // Ambil parameter angkatan dari query string
    const angkatan = req.query.angkatan;

    // Cek apakah angkatan dikirim dalam bentuk array
    if (!angkatan || angkatan.length === 0) {
      return res.status(400).json({ message: "Parameter angkatan is required" });
    }

    // Buat filter dinamis berdasarkan parameter angkatan
    const angkatanFilter = Array.isArray(angkatan) ? angkatan.map((year) => `angkatan = '${year}'`).join(" OR ") : `angkatan = '${angkatan}'`;

    const requestBody = {
      act: "GetDetailPerkuliahanMahasiswa",
      token: `${token}`,
      filter: angkatanFilter,
      order: "id_registrasi_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataDetailPerkuliahanMahasiswa = response.data.data;

    // Truncate data
    await DetailPerkuliahanMahasiswa.destroy({
      where: {}, // Hapus semua data
    });

    await sequelize.query("ALTER TABLE detail_perkuliahan_mahasiswas AUTO_INCREMENT = 1");

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
      // dataDetailPerkuliahanMahasiswa: dataDetailPerkuliahanMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDetailPerkuliahanMahasiswa,
};
