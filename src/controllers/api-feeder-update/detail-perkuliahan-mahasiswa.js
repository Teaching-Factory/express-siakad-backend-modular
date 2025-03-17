const axios = require("axios");
const { getToken } = require("../api-feeder/get-token");
const { DetailPerkuliahanMahasiswa, Mahasiswa, Semester, StatusMahasiswa } = require("../../../models");

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

    // Loop untuk menambahkan data ke dalam database
    for (const detail_perkuliahan_mahasiswa of dataDetailPerkuliahanMahasiswa) {
      // Periksa apakah id_registrasi_mahasiswa, id_semester, dan id_status_mahasiswa ada di database
      const mahasiswaExists = await Mahasiswa.findOne({
        where: { id_registrasi_mahasiswa: detail_perkuliahan_mahasiswa.id_registrasi_mahasiswa },
      });

      const semesterExist = await Semester.findOne({
        where: { id_semester: detail_perkuliahan_mahasiswa.id_semester },
      });

      const statusMahasiswaExist = await StatusMahasiswa.findOne({
        where: { id_status_mahasiswa: detail_perkuliahan_mahasiswa.id_status_mahasiswa },
      });

      // Jika salah satu tidak ditemukan, lanjut ke iterasi berikutnya
      if (!mahasiswaExists || !semesterExist || !statusMahasiswaExist) {
        continue;
      }

      // Periksa apakah data sudah ada
      const existingData = await DetailPerkuliahanMahasiswa.findOne({
        where: {
          id_semester: detail_perkuliahan_mahasiswa.id_semester,
          id_registrasi_mahasiswa: detail_perkuliahan_mahasiswa.id_registrasi_mahasiswa,
          angkatan: detail_perkuliahan_mahasiswa.angkatan,
        },
      });

      if (!existingData) {
        // Jika belum ada, tambahkan data baru
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
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Update Detail Perkuliahan Mahasiswa Success",
      totalData: dataDetailPerkuliahanMahasiswa.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDetailPerkuliahanMahasiswa,
};
