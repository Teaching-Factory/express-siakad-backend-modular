const axios = require("axios");
const { getToken } = require("../api-feeder/get-token");
const { RekapKHSMahasiswa, Mahasiswa, Semester, Prodi, MataKuliah } = require("../../../models");

const getRekapKHSMahasiswa = async (req, res, next) => {
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

    // Buat filter menggunakan LIKE pada id_periode pada feeder
    const semesterFilter = Array.isArray(angkatan) ? angkatan.map((year) => `id_periode LIKE '%${year}%'`).join(" OR ") : `id_periode LIKE '%${angkatan}%'`;

    const requestBody = {
      act: "GetRekapKHSMahasiswa",
      token: `${token}`,
      filter: semesterFilter,
      order: "id_registrasi_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataRekapKHSMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const rekap_khs_mahasiswa of dataRekapKHSMahasiswa) {
      // Periksa apakah id_registrasi_mahasiswa, id_periode, id_prodi, dan id_matkul ada di database
      const mahasiswaExists = await Mahasiswa.findOne({
        where: { id_registrasi_mahasiswa: rekap_khs_mahasiswa.id_registrasi_mahasiswa },
      });

      const semesterExist = await Semester.findOne({
        where: { id_semester: rekap_khs_mahasiswa.id_periode },
      });

      const prodiExist = await Prodi.findOne({
        where: { id_prodi: rekap_khs_mahasiswa.id_prodi },
      });

      const mataKuliahExist = await MataKuliah.findOne({
        where: { id_matkul: rekap_khs_mahasiswa.id_matkul },
      });

      // Jika salah satu tidak ditemukan, lanjut ke iterasi berikutnya
      if (!mahasiswaExists || !semesterExist || !prodiExist || !mataKuliahExist) {
        continue;
      }

      // Periksa apakah data sudah ada
      const existingData = await RekapKHSMahasiswa.findOne({
        where: {
          id_registrasi_mahasiswa: rekap_khs_mahasiswa.id_registrasi_mahasiswa,
          angkatan: rekap_khs_mahasiswa.angkatan,
          id_matkul: rekap_khs_mahasiswa.id_matkul,
          id_semester: rekap_khs_mahasiswa.id_periode,
        },
      });

      if (!existingData) {
        // Jika belum ada, tambahkan data baru
        await RekapKHSMahasiswa.create({
          angkatan: rekap_khs_mahasiswa.angkatan,
          nilai_angka: rekap_khs_mahasiswa.nilai_angka,
          nilai_huruf: rekap_khs_mahasiswa.nilai_huruf,
          nilai_indeks: rekap_khs_mahasiswa.nilai_indeks,
          sks_x_indeks: rekap_khs_mahasiswa.sks_x_indeks,
          id_registrasi_mahasiswa: rekap_khs_mahasiswa.id_registrasi_mahasiswa,
          id_prodi: rekap_khs_mahasiswa.id_prodi,
          id_semester: rekap_khs_mahasiswa.id_periode,
          id_matkul: rekap_khs_mahasiswa.id_matkul,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Update Rekap KHS Mahasiswa Success",
      totalData: dataRekapKHSMahasiswa.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRekapKHSMahasiswa,
};
