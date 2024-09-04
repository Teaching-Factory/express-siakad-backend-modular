const axios = require("axios");
const { getToken } = require("./get-token");
const { DosenPengajarKelasKuliah, PenugasanDosen, Dosen, KelasKuliah } = require("../../../models");

const getDosenPengajarKelasKuliah = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetDosenPengajarKelasKuliah",
      token: `${token}`,
      order: "id_aktivitas_mengajar"
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dosenPengajarKelasKuliah = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const dosen_pengajar_kelas_kuliah of dosenPengajarKelasKuliah) {
      // Periksa apakah data sudah ada di tabel
      const existingDosenPengajarKelasKuliah = await DosenPengajarKelasKuliah.findOne({
        where: {
          id_aktivitas_mengajar: dosen_pengajar_kelas_kuliah.id_aktivitas_mengajar
        }
      });

      let id_registrasi_dosen = null;
      let id_dosen = null;
      let id_kelas_kuliah = null;

      // Periksa apakah id_registrasi_dosen ada di tabel penugasan dosen
      const penugasan_dosen = await PenugasanDosen.findOne({
        where: {
          id_registrasi_dosen: dosen_pengajar_kelas_kuliah.id_registrasi_dosen
        }
      });

      // Periksa apakah id_dosen ada di tabel dosen
      const dosen = await Dosen.findOne({
        where: {
          id_dosen: dosen_pengajar_kelas_kuliah.id_dosen
        }
      });

      // Periksa apakah id_kelas_kuliah ada di tabel kelas kuliah
      const kelas_kuliah = await KelasKuliah.findOne({
        where: {
          id_kelas_kuliah: dosen_pengajar_kelas_kuliah.id_kelas_kuliah
        }
      });

      // Jika ditemukan, simpan nilainya
      if (penugasan_dosen) {
        id_registrasi_dosen = penugasan_dosen.id_registrasi_dosen;
      }

      // Jika ditemukan, simpan nilainya
      if (dosen) {
        id_dosen = dosen.id_dosen;
      }

      // Jika ditemukan, simpan nilainya
      if (kelas_kuliah) {
        id_kelas_kuliah = kelas_kuliah.id_kelas_kuliah;
      }

      if (!existingDosenPengajarKelasKuliah) {
        // Data belum ada, buat entri baru di database
        await DosenPengajarKelasKuliah.create({
          id_aktivitas_mengajar: dosen_pengajar_kelas_kuliah.id_aktivitas_mengajar,
          sks_substansi_total: dosen_pengajar_kelas_kuliah.sks_substansi_total,
          rencana_minggu_pertemuan: dosen_pengajar_kelas_kuliah.rencana_minggu_pertemuan,
          realisasi_minggu_pertemuan: dosen_pengajar_kelas_kuliah.realisasi_minggu_pertemuan,
          id_registrasi_dosen: id_registrasi_dosen,
          id_dosen: id_dosen,
          id_kelas_kuliah: id_kelas_kuliah,
          id_substansi: dosen_pengajar_kelas_kuliah.id_substansi,
          id_jenis_evaluasi: dosen_pengajar_kelas_kuliah.id_jenis_evaluasi,
          id_prodi: dosen_pengajar_kelas_kuliah.id_prodi,
          id_semester: dosen_pengajar_kelas_kuliah.id_semester
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Dosen Pengajar Kelas Kuliah Success",
      totalData: dosenPengajarKelasKuliah.length,
      dosenPengajarKelasKuliah: dosenPengajarKelasKuliah
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDosenPengajarKelasKuliah
};
