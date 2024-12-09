const axios = require("axios");
const { getToken } = require("./get-token");
const { DetailPeriodePerkuliahan, sequelize } = require("../../../models");

const getDetailPeriodePerkuliahan = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetDetailPeriodePerkuliahan",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataDetailPeriodePerkuliahan = response.data.data;

    // Truncate data
    await DetailPeriodePerkuliahan.destroy({
      where: {}, // Hapus semua data
    });

    await sequelize.query("ALTER TABLE detail_periode_perkuliahans AUTO_INCREMENT = 1");

    // Loop untuk menambahkan data ke dalam database
    for (const detail_periode_perkuliahan of dataDetailPeriodePerkuliahan) {
      let tanggal_mulai, tanggal_akhir; // Deklarasikan variabel di luar blok if

      //   melakukan pengecekan data tanggal
      if (detail_periode_perkuliahan.tanggal_awal_perkuliahan != null) {
        const date_start = detail_periode_perkuliahan.tanggal_awal_perkuliahan.split("-");
        tanggal_mulai = `${date_start[2]}-${date_start[1]}-${date_start[0]}`;
      }

      if (detail_periode_perkuliahan.tanggal_akhir_perkuliahan != null) {
        const date_end = detail_periode_perkuliahan.tanggal_akhir_perkuliahan.split("-");
        tanggal_akhir = `${date_end[2]}-${date_end[1]}-${date_end[0]}`;
      }

      await DetailPeriodePerkuliahan.create({
        id_detail_periode_perkuliahan: detail_periode_perkuliahan.id_detail_periode_perkuliahan,
        jumlah_target_mahasiswa_baru: detail_periode_perkuliahan.jumlah_target_mahasiswa_baru,
        jumlah_pendaftar_ikut_selesai: detail_periode_perkuliahan.jumlah_pendaftar_ikut_selesai,
        jumlah_pendaftar_lulus_selesai: detail_periode_perkuliahan.jumlah_pendaftar_lulus_selesai,
        jumlah_daftar_ulang: detail_periode_perkuliahan.jumlah_daftar_ulang,
        jumlah_mengundurkan_diri: detail_periode_perkuliahan.jumlah_mengundurkan_diri,
        tanggal_awal_perkuliahan: tanggal_mulai,
        tanggal_akhir_perkuliahan: tanggal_akhir,
        jumlah_minggu_pertemuan: detail_periode_perkuliahan.jumlah_minggu_pertemuan,
        id_prodi: detail_periode_perkuliahan.id_prodi,
        id_semester: detail_periode_perkuliahan.id_semester,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Detail Periode Perkuliahan Success",
      totalData: dataDetailPeriodePerkuliahan.length,
      dataDetailPeriodePerkuliahan: dataDetailPeriodePerkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDetailPeriodePerkuliahan,
};
