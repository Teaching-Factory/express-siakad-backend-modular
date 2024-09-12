const axios = require("axios");
const { Sekolah } = require("../../../models");

const getSekolahSMK = async (req, res, next) => {
  try {
    let page = 1;
    let totalData = [];
    let perPage = 1000;
    let totalPages;

    do {
      // Ambil data dari API untuk halaman saat ini
      const response = await axios.get(`https://api-sekolah-indonesia.vercel.app/sekolah/SMK?page=${page}&perPage=${perPage}`);

      // Cek jika status API berhasil
      if (response.data.status === "success") {
        const dataSekolahSMK = response.data.dataSekolah;

        // Tambahkan data dari halaman ini ke dalam totalData
        totalData = totalData.concat(dataSekolahSMK);

        // Loop untuk menyimpan data ke dalam database
        for (const data_smk of dataSekolahSMK) {
          const existingSekolahSMK = await Sekolah.findOne({
            where: { id: data_smk.id }
          });

          if (!existingSekolahSMK) {
            await Sekolah.create({
              id: data_smk.id || null,
              npsn: data_smk.npsn || null,
              sekolah: data_smk.sekolah || null,
              bentuk: data_smk.bentuk || null,
              status: data_smk.status || null,
              alamat_jalan: data_smk.alamat_jalan || null,
              lintang: data_smk.lintang || null,
              bujur: data_smk.bujur || null,
              kode_kec: data_smk.kode_kec || null,
              kecamatan: data_smk.kecamatan || null,
              kode_kab_kota: data_smk.kode_kab_kota || null,
              kabupaten_kota: data_smk.kabupaten_kota || null,
              kode_prop: data_smk.kode_prop || null,
              propinsi: data_smk.propinsi || null
            });
          }
        }

        // Tentukan jumlah total halaman berdasarkan respons dari API
        totalPages = Math.ceil(response.data.total_data / perPage);
        page++; // Pindah ke halaman berikutnya
      } else {
        // Jika API gagal, kirim respons error
        return res.status(404).json({
          status: "Error",
          message: "Data sekolah tidak ditemukan"
        });
      }
    } while (page <= totalPages);

    // Kirim respons setelah semua data diambil dan diproses
    res.status(200).json({
      message: "Data Sekolah SMK berhasil diambil dan disimpan",
      totalData: totalData.length,
      dataSekolahSMK: totalData
    });
  } catch (error) {
    next(error);
  }
};

const getSekolahSMA = async (req, res, next) => {
  try {
    let page = 1;
    let totalData = [];
    let perPage = 1000;
    let totalPages;

    do {
      // Ambil data dari API untuk halaman saat ini
      const response = await axios.get(`https://api-sekolah-indonesia.vercel.app/sekolah/SMA?page=${page}&perPage=${perPage}`);

      // Cek jika status API berhasil
      if (response.data.status === "success") {
        const dataSekolahSMA = response.data.dataSekolah;

        // Tambahkan data dari halaman ini ke dalam totalData
        totalData = totalData.concat(dataSekolahSMA);

        // Loop untuk menyimpan data ke dalam database
        for (const data_sma of dataSekolahSMA) {
          const existingSekolahSMA = await Sekolah.findOne({
            where: { id: data_sma.id }
          });

          if (!existingSekolahSMA) {
            await Sekolah.create({
              id: data_sma.id || null,
              npsn: data_sma.npsn || null,
              sekolah: data_sma.sekolah || null,
              bentuk: data_sma.bentuk || null,
              status: data_sma.status || null,
              alamat_jalan: data_sma.alamat_jalan || null,
              lintang: data_sma.lintang || null,
              bujur: data_sma.bujur || null,
              kode_kec: data_sma.kode_kec || null,
              kecamatan: data_sma.kecamatan || null,
              kode_kab_kota: data_sma.kode_kab_kota || null,
              kabupaten_kota: data_sma.kabupaten_kota || null,
              kode_prop: data_sma.kode_prop || null,
              propinsi: data_sma.propinsi || null
            });
          }
        }

        // Tentukan jumlah total halaman berdasarkan respons dari API
        totalPages = Math.ceil(response.data.total_data / perPage);
        page++; // Pindah ke halaman berikutnya
      } else {
        // Jika API gagal, kirim respons error
        return res.status(404).json({
          status: "Error",
          message: "Data sekolah tidak ditemukan"
        });
      }
    } while (page <= totalPages);

    // Kirim respons setelah semua data diambil dan diproses
    res.status(200).json({
      message: "Data Sekolah SMA berhasil diambil dan disimpan",
      totalData: totalData.length,
      dataSekolahSMA: totalData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSekolahSMK,
  getSekolahSMA
};
