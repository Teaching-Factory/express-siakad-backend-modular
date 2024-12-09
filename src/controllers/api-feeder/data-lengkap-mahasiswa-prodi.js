const axios = require("axios");
const { getToken } = require("./get-token");
const { DataLengkapMahasiswaProdi, Prodi, Wilayah, sequelize } = require("../../../models");

const getDataLengkapMahasiswaProdi = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetDataLengkapMahasiswaProdi",
      token: `${token}`,
      order: "id_periode_masuk",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataDataLengkapMahasiswaProdi = response.data.data;

    // Truncate data
    await DataLengkapMahasiswaProdi.destroy({
      where: {}, // Hapus semua data
    });

    await sequelize.query("ALTER TABLE data_lengkap_mahasiswa_prodis AUTO_INCREMENT = 1");

    // Loop untuk menambahkan data ke dalam database
    for (const data_lengkap_mahasiswa_prodi of dataDataLengkapMahasiswaProdi) {
      let id_prodi_asal = null;
      let id_wilayah = null;

      // Periksa apakah id_prodi_asal ada di tabel Prodi
      const prodi = await Prodi.findOne({
        where: {
          id_prodi: data_lengkap_mahasiswa_prodi.id_prodi_asal,
        },
      });

      // Periksa apakah id_wilayah ada di tabel Wilayah
      const wilayah = await Wilayah.findOne({
        where: {
          id_wilayah: data_lengkap_mahasiswa_prodi.id_wilayah,
        },
      });

      // Jika ditemukan, simpan nilainya
      if (prodi) {
        id_prodi_asal = prodi.id_prodi;
      }

      if (wilayah) {
        id_wilayah = wilayah.id_wilayah;
      }

      await DataLengkapMahasiswaProdi.create({
        nama_status_mahasiswa: data_lengkap_mahasiswa_prodi.nama_status_mahasiswa,
        jalur_masuk: data_lengkap_mahasiswa_prodi.jalur_masuk,
        nama_jalur_masuk: data_lengkap_mahasiswa_prodi.nama_jalur_masuk,
        sks_diakui: data_lengkap_mahasiswa_prodi.sks_diakui,
        id_prodi: data_lengkap_mahasiswa_prodi.id_prodi,
        id_periode_masuk: data_lengkap_mahasiswa_prodi.id_periode_masuk,
        id_registrasi_mahasiswa: data_lengkap_mahasiswa_prodi.id_registrasi_mahasiswa,
        id_agama: data_lengkap_mahasiswa_prodi.id_agama,
        id_wilayah: id_wilayah,
        id_jenis_tinggal: data_lengkap_mahasiswa_prodi.id_jenis_tinggal,
        id_alat_transportasi: data_lengkap_mahasiswa_prodi.id_alat_transportasi,
        id_pendidikan_ayah: data_lengkap_mahasiswa_prodi.id_pendidikan_ayah,
        id_pendidikan_ibu: data_lengkap_mahasiswa_prodi.id_pendidikan_ibu,
        id_pendidikan_wali: data_lengkap_mahasiswa_prodi.id_pendidikan_wali,
        id_pekerjaan_ayah: data_lengkap_mahasiswa_prodi.id_pekerjaan_ayah,
        id_pekerjaan_ibu: data_lengkap_mahasiswa_prodi.id_pekerjaan_ibu,
        id_pekerjaan_wali: data_lengkap_mahasiswa_prodi.id_pekerjaan_wali,
        id_penghasilan_ayah: data_lengkap_mahasiswa_prodi.id_penghasilan_ayah,
        id_penghasilan_ibu: data_lengkap_mahasiswa_prodi.id_penghasilan_ibu,
        id_penghasilan_wali: data_lengkap_mahasiswa_prodi.id_penghasilan_wali,
        id_kebutuhan_khusus_mahasiswa: data_lengkap_mahasiswa_prodi.id_kebutuhan_khusus_mahasiswa,
        id_kebutuhan_khusus_ayah: data_lengkap_mahasiswa_prodi.id_kebutuhan_khusus_ayah,
        id_kebutuhan_khusus_ibu: data_lengkap_mahasiswa_prodi.id_kebutuhan_khusus_ibu,
        id_perguruan_tinggi_asal: data_lengkap_mahasiswa_prodi.id_perguruan_tinggi_asal,
        id_prodi_asal: id_prodi_asal,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Data Lengkap Mahasiswa Prodi Success",
      totalData: dataDataLengkapMahasiswaProdi.length,
      dataDataLengkapMahasiswaProdi: dataDataLengkapMahasiswaProdi,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDataLengkapMahasiswaProdi,
};
