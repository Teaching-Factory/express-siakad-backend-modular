const axios = require("axios");
const { getToken } = require("./get-token");
const { MataKuliah } = require("../../../models");

const getMataKuliah = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetListMataKuliah",
      token: `${token}`
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataMataKuliah = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const mata_kuliah of dataMataKuliah) {
      // Periksa apakah data sudah ada di tabel
      const existingMataKuliah = await MataKuliah.findOne({
        where: {
          id_matkul: mata_kuliah.id_matkul
        }
      });

      if (!existingMataKuliah) {
        // Data belum ada, buat entri baru di database
        await MataKuliah.create({
          id_matkul: mata_kuliah.id_matkul,
          tgl_create: mata_kuliah.tgl_create,
          jenis_mk: mata_kuliah.jns_mk,
          kel_mk: mata_kuliah.kel_mk,
          kode_mata_kuliah: mata_kuliah.kode_mata_kuliah,
          nama_mata_kuliah: mata_kuliah.nama_mata_kuliah,
          sks_mata_kuliah: mata_kuliah.sks_mata_kuliah,
          id_jenis_mata_kuliah: mata_kuliah.id_jenis_mata_kuliah,
          id_kelompok_mata_kuliah: mata_kuliah.id_kelompok_mata_kuliah,
          sks_tatap_muka: mata_kuliah.sks_tatap_muka,
          sks_praktek_lapangan: mata_kuliah.sks_praktek_lapangan,
          sks_simulasi: mata_kuliah.sks_simulasi,
          metode_kuliah: mata_kuliah.metode_kuliah,
          ada_sap: mata_kuliah.ada_sap,
          ada_silabus: mata_kuliah.ada_silabus,
          ada_bahan_ajar: mata_kuliah.ada_bahan_ajar,
          ada_acara_praktek: mata_kuliah.ada_acara_praktek,
          ada_diktat: mata_kuliah.ada_diktat,
          tanggal_mulai_efektif: mata_kuliah.tanggal_mulai_efektif,
          tanggal_selesai_efektif: mata_kuliah.tanggal_selesai_efektif,
          id_prodi: mata_kuliah.id_prodi
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Mata Kuliah Success",
      totalData: dataMataKuliah.length,
      dataMataKuliah: dataMataKuliah
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMataKuliah
};
