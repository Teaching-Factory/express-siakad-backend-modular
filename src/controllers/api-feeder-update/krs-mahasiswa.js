const axios = require("axios");
const { getToken } = require("../api-feeder/get-token");
const { KRSMahasiswa, Mahasiswa, Semester, Prodi, MataKuliah, KelasKuliah } = require("../../../models");

const getKRSMahasiswa = async (req, res, next) => {
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
      act: "GetKRSMahasiswa",
      token: `${token}`,
      filter: angkatanFilter,
      order: "id_registrasi_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataKRSMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const krs_mahasiswa of dataKRSMahasiswa) {
      // Periksa apakah id_registrasi_mahasiswa, id_periode, id_prodi, id_matkul dan id_kelas ada di database
      const mahasiswaExists = await Mahasiswa.findOne({
        where: { id_registrasi_mahasiswa: krs_mahasiswa.id_registrasi_mahasiswa },
      });

      const semesterExist = await Semester.findOne({
        where: { id_semester: krs_mahasiswa.id_periode },
      });

      const prodiExist = await Prodi.findOne({
        where: { id_prodi: krs_mahasiswa.id_prodi },
      });

      const mataKuliahExist = await MataKuliah.findOne({
        where: { id_matkul: krs_mahasiswa.id_matkul },
      });

      const kelasExists = await KelasKuliah.findOne({
        where: { id_kelas_kuliah: krs_mahasiswa.id_kelas },
      });

      // Jika salah satu tidak ditemukan, lanjut ke iterasi berikutnya
      if (!mahasiswaExists || !semesterExist || !prodiExist || !mataKuliahExist || !kelasExists) {
        continue;
      }

      // Periksa apakah data sudah ada
      const existingData = await KRSMahasiswa.findOne({
        where: {
          id_semester: krs_mahasiswa.id_periode,
          id_registrasi_mahasiswa: krs_mahasiswa.id_registrasi_mahasiswa,
          id_kelas: krs_mahasiswa.id_kelas,
          angkatan: krs_mahasiswa.angkatan,
        },
      });

      if (!existingData) {
        // Jika belum ada, tambahkan data baru
        await KRSMahasiswa.create({
          angkatan: krs_mahasiswa.angkatan,
          id_registrasi_mahasiswa: krs_mahasiswa.id_registrasi_mahasiswa,
          id_semester: krs_mahasiswa.id_periode,
          id_prodi: krs_mahasiswa.id_prodi,
          id_matkul: krs_mahasiswa.id_matkul,
          id_kelas: krs_mahasiswa.id_kelas,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Update KRS Mahasiswa Success",
      totalData: dataKRSMahasiswa.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKRSMahasiswa,
};
