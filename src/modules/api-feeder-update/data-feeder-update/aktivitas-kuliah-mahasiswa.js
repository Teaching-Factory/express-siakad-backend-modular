const axios = require("axios");
const { getToken } = require("../../api-feeder/data-feeder/get-token");
const { AktivitasKuliahMahasiswa, Mahasiswa, Semester, Prodi, StatusMahasiswa } = require("../../../../models");

const getAktivitasKuliahMahasiswa = async (req, res, next) => {
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
      act: "GetAktivitasKuliahMahasiswa",
      token: `${token}`,
      filter: angkatanFilter,
      order: "id_registrasi_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataAktivitasKuliahMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const aktivitas_kuliah_mahasiswa of dataAktivitasKuliahMahasiswa) {
      // Periksa apakah id_registrasi_mahasiswa, id_semester, id_prodi dan id_status_mahasiswa ada di database
      const mahasiswaExists = await Mahasiswa.findOne({
        where: { id_registrasi_mahasiswa: aktivitas_kuliah_mahasiswa.id_registrasi_mahasiswa },
      });

      const semesterExist = await Semester.findOne({
        where: { id_semester: aktivitas_kuliah_mahasiswa.id_semester },
      });

      const prodiExist = await Prodi.findOne({
        where: { id_prodi: aktivitas_kuliah_mahasiswa.id_prodi },
      });

      const statusMahasiswaExist = await StatusMahasiswa.findOne({
        where: { id_status_mahasiswa: aktivitas_kuliah_mahasiswa.id_status_mahasiswa },
      });

      // Jika salah satu tidak ditemukan, lanjut ke iterasi berikutnya
      if (!mahasiswaExists || !semesterExist || !prodiExist || !statusMahasiswaExist) {
        continue;
      }

      // Periksa apakah data sudah ada
      const existingData = await AktivitasKuliahMahasiswa.findOne({
        where: {
          id_semester: aktivitas_kuliah_mahasiswa.id_semester,
          id_registrasi_mahasiswa: aktivitas_kuliah_mahasiswa.id_registrasi_mahasiswa,
          angkatan: aktivitas_kuliah_mahasiswa.angkatan,
        },
      });

      if (!existingData) {
        // Jika belum ada, tambahkan data baru
        await AktivitasKuliahMahasiswa.create({
          angkatan: aktivitas_kuliah_mahasiswa.angkatan,
          ips: aktivitas_kuliah_mahasiswa.ips,
          ipk: aktivitas_kuliah_mahasiswa.ipk,
          sks_semester: aktivitas_kuliah_mahasiswa.sks_semester,
          sks_total: aktivitas_kuliah_mahasiswa.sks_total,
          biaya_kuliah_smt: aktivitas_kuliah_mahasiswa.biaya_kuliah_smt,
          id_registrasi_mahasiswa: aktivitas_kuliah_mahasiswa.id_registrasi_mahasiswa,
          id_semester: aktivitas_kuliah_mahasiswa.id_semester,
          id_prodi: aktivitas_kuliah_mahasiswa.id_prodi,
          id_status_mahasiswa: aktivitas_kuliah_mahasiswa.id_status_mahasiswa,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Update Aktivitas Kuliah Mahasiswa Success",
      totalData: dataAktivitasKuliahMahasiswa.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAktivitasKuliahMahasiswa,
};
