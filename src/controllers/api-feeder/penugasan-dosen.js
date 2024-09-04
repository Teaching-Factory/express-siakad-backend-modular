const axios = require("axios");
const { getToken } = require("./get-token");
const { PenugasanDosen } = require("../../../models");

const getPenugasanDosen = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetListPenugasanDosen",
      token: `${token}`
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataPenugasanDosen = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const penugasan_dosen of dataPenugasanDosen) {
      // Periksa apakah data sudah ada di tabel
      const existingPenugasanDosen = await PenugasanDosen.findOne({
        where: {
          id_registrasi_dosen: penugasan_dosen.id_registrasi_dosen
        }
      });

      let tanggal_surat_tugas, mulai_surat_tugas;

      //   melakukan pengecekan data tanggal
      if (penugasan_dosen.tanggal_surat_tugas != null) {
        const date_start = penugasan_dosen.tanggal_surat_tugas.split("-");
        tanggal_surat_tugas = `${date_start[2]}-${date_start[1]}-${date_start[0]}`;
      }

      if (penugasan_dosen.mulai_surat_tugas != null) {
        const date_end = penugasan_dosen.mulai_surat_tugas.split("-");
        mulai_surat_tugas = `${date_end[2]}-${date_end[1]}-${date_end[0]}`;
      }

      if (!existingPenugasanDosen) {
        // Data belum ada, buat entri baru di database
        await PenugasanDosen.create({
          id_registrasi_dosen: penugasan_dosen.id_registrasi_dosen,
          jk: penugasan_dosen.jk,
          nomor_surat_tugas: penugasan_dosen.nomor_surat_tugas,
          tanggal_surat_tugas: tanggal_surat_tugas,
          mulai_surat_tugas: mulai_surat_tugas,
          tanggal_create: penugasan_dosen.tgl_create,
          tanggal_ptk_keluar: penugasan_dosen.tgl_ptk_keluar,
          id_dosen: penugasan_dosen.id_dosen,
          id_tahun_ajaran: penugasan_dosen.id_tahun_ajaran,
          id_perguruan_tinggi: penugasan_dosen.id_perguruan_tinggi,
          id_prodi: penugasan_dosen.id_prodi
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Penugasan Dosen Success",
      totalData: dataPenugasanDosen.length,
      dataPenugasanDosen: dataPenugasanDosen
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPenugasanDosen
};
