const axios = require("axios");
const { Sekolah } = require("../../../models");

const syncDataSekolah = async (req, res, next) => {
  try {
    let page = 1;
    let totalData = [];
    const perPage = 500;
    let totalPages;

    do {
      // Ambil data dari API untuk halaman saat ini
      const response = await axios.get(`https://api-sekolah-indonesia.vercel.app/sekolah/SMK?page=${page}&perPage=${perPage}`);

      // Cek jika status API berhasil
      if (response.data.status === "success") {
        const dataSekolahSMK = response.data.dataSekolah;

        // Tambahkan data dari halaman ini ke dalam totalData
        totalData = totalData.concat(dataSekolahSMK);

        // Ambil NPSN yang sudah ada di database untuk menghindari penyimpanan data duplikat
        const existingNpsns = await Sekolah.findAll({
          attributes: ["npsn"],
          where: {
            npsn: dataSekolahSMK.map((item) => item.npsn),
          },
        });

        const existingNpsnsSet = new Set(existingNpsns.map((item) => item.npsn));

        // Filter data untuk hanya menyimpan yang belum ada di database
        const newData = dataSekolahSMK.filter((data_smk) => !existingNpsnsSet.has(data_smk.npsn));

        // Bulk insert data baru
        if (newData.length > 0) {
          await Sekolah.bulkCreate(
            newData.map((data_smk) => ({
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
              propinsi: data_smk.propinsi || null,
              last_sync: new Date(),
              id_feeder: data_smk.id,
            }))
          );
        }

        // Tentukan jumlah total halaman berdasarkan respons dari API
        totalPages = Math.ceil(response.data.total_data / perPage);
        page++; // Pindah ke halaman berikutnya
      } else {
        // Jika API gagal, kirim respons error
        return res.status(404).json({
          status: "Error",
          message: "Data sekolah tidak ditemukan",
        });
      }
    } while (page <= totalPages);

    // Kirim respons setelah semua data diambil dan diproses
    console.log("Sinkronisasi Sekolah selesai.");
  } catch (error) {
    console.error("Error during syncDataSekolah:", error.message);
  }
};

const syncSekolah = async (req, res, next) => {
  try {
    await syncDataSekolah();
    res.status(200).json({ message: "Sinkronisasi Sekolah berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncSekolah,
};
