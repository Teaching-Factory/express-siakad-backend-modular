const axios = require("axios");
const { getToken } = require("./get-token");
const { PeriodePerkuliahan, sequelize } = require("../../../models");

const getPeriodePerkuliahan = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetListPeriodePerkuliahan",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataPeriodePerkuliahan = response.data.data;

    // Truncate data
    await PeriodePerkuliahan.destroy({
      where: {}, // Hapus semua data
    });

    await sequelize.query("ALTER TABLE periode_perkuliahans AUTO_INCREMENT = 1");

    // Loop untuk menambahkan data ke dalam database
    for (const periode_perkuliahan of dataPeriodePerkuliahan) {
      let tanggal_mulai, tanggal_akhir, tanggal_dibuat, tanggal_update; // Deklarasikan variabel di luar blok if

      //   melakukan pengecekan data tanggal
      if (periode_perkuliahan.tanggal_awal_perkuliahan != null) {
        const date_start = periode_perkuliahan.tanggal_awal_perkuliahan.split("-");
        tanggal_mulai = `${date_start[2]}-${date_start[1]}-${date_start[0]}`;
      }

      if (periode_perkuliahan.tanggal_akhir_perkuliahan != null) {
        const date_end = periode_perkuliahan.tanggal_akhir_perkuliahan.split("-");
        tanggal_akhir = `${date_end[2]}-${date_end[1]}-${date_end[0]}`;
      }

      if (periode_perkuliahan.tgl_create != null) {
        const date_create = periode_perkuliahan.tgl_create.split("-");
        tanggal_dibuat = `${date_create[2]}-${date_create[1]}-${date_create[0]}`;
      }

      if (periode_perkuliahan.last_update != null) {
        const date_update = periode_perkuliahan.last_update.split("-");
        tanggal_update = `${date_update[2]}-${date_update[1]}-${date_update[0]}`;
      }

      await PeriodePerkuliahan.create({
        id_periode_perkuliahan: periode_perkuliahan.id_periode_perkuliahan,
        jumlah_target_mahasiswa_baru: periode_perkuliahan.jumlah_target_mahasiswa_baru,
        tanggal_awal_perkuliahan: tanggal_mulai,
        tanggal_akhir_perkuliahan: tanggal_akhir,
        calon_ikut_seleksi: periode_perkuliahan.calon_ikut_seleksi,
        calon_lulus_seleksi: periode_perkuliahan.calon_lulus_seleksi,
        daftar_sbg_mhs: periode_perkuliahan.daftar_sbg_mhs,
        pst_undur_diri: periode_perkuliahan.pst_undur_diri,
        jml_mgu_kul: periode_perkuliahan.jml_mgu_kul,
        metode_kul: periode_perkuliahan.metode_kul,
        metode_kul_eks: periode_perkuliahan.metode_kul_eks,
        tgl_create: tanggal_dibuat,
        last_update: tanggal_update,
        id_prodi: periode_perkuliahan.id_prodi,
        id_semester: periode_perkuliahan.id_semester,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Periode Perkuliahan Success",
      totalData: dataPeriodePerkuliahan.length,
      dataPeriodePerkuliahan: dataPeriodePerkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPeriodePerkuliahan,
};
