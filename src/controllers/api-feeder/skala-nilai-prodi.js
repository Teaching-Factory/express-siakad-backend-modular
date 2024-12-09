const axios = require("axios");
const { getToken } = require("./get-token");
const { SkalaNilaiProdi } = require("../../../models");

const getSkalaNilaiProdi = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetListSkalaNilaiProdi",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataSkalaNilaiProdi = response.data.data;

    // Truncate data
    await SkalaNilaiProdi.destroy({
      where: {}, // Hapus semua data
    });

    // Loop untuk menambahkan data ke dalam database
    for (const skala_nilai_prodi of dataSkalaNilaiProdi) {
      // Periksa apakah data sudah ada di tabel
      const existingSkalaNilaiProdi = await SkalaNilaiProdi.findOne({
        where: {
          id_bobot_nilai: skala_nilai_prodi.id_bobot_nilai,
        },
      });

      let tanggal_mulai, tanggal_akhir; // Deklarasikan variabel di luar blok if

      //   melakukan pengecekan data tanggal
      if (skala_nilai_prodi.tanggal_mulai_efektif != null) {
        const date_start = skala_nilai_prodi.tanggal_mulai_efektif.split("-");
        tanggal_mulai = `${date_start[2]}-${date_start[1]}-${date_start[0]}`;
      }

      if (skala_nilai_prodi.tanggal_akhir_efektif != null) {
        const date_end = skala_nilai_prodi.tanggal_akhir_efektif.split("-");
        tanggal_akhir = `${date_end[2]}-${date_end[1]}-${date_end[0]}`;
      }

      if (!existingSkalaNilaiProdi) {
        // Data belum ada, buat entri baru di database
        await SkalaNilaiProdi.create({
          id_bobot_nilai: skala_nilai_prodi.id_bobot_nilai,
          tgl_create: skala_nilai_prodi.tgl_create,
          nilai_huruf: skala_nilai_prodi.nilai_huruf,
          nilai_indeks: skala_nilai_prodi.nilai_indeks,
          bobot_minimum: skala_nilai_prodi.bobot_minimum,
          bobot_maksimum: skala_nilai_prodi.bobot_maksimum,
          tanggal_mulai_efektif: tanggal_mulai,
          tanggal_akhir_efektif: tanggal_akhir,
          last_sync: new Date(),
          id_feeder: skala_nilai_prodi.id_bobot_nilai,
          id_prodi: skala_nilai_prodi.id_prodi,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Skala Nilai Prodi Success",
      totalData: dataSkalaNilaiProdi.length,
      dataSkalaNilaiProdi: dataSkalaNilaiProdi,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkalaNilaiProdi,
};
