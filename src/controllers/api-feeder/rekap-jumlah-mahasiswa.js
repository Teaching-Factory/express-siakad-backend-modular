const axios = require("axios");
const { getToken } = require("./get-token");
const { RekapJumlahMahasiswa, Periode, sequelize } = require("../../../models");

const getRekapJumlahMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetRekapJumlahMahasiswa",
      token: `${token}`,
      order: "id_periode",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataRekapJumlahMahasiswa = response.data.data;

    // Truncate data
    await RekapJumlahMahasiswa.destroy({
      where: {}, // Hapus semua data
    });

    await sequelize.query("ALTER TABLE rekap_jumlah_mahasiswas AUTO_INCREMENT = 1");

    // Loop untuk menambahkan data ke dalam database
    for (const rekap_jumlah_mahasiswa of dataRekapJumlahMahasiswa) {
      let id_periode = null;

      // Periksa apakah id_periode atau periode_pelaporan ada di Periode
      const periode = await Periode.findOne({
        where: {
          periode_pelaporan: rekap_jumlah_mahasiswa.id_periode,
        },
      });

      // Jika ditemukan, simpan nilainya
      if (periode) {
        id_periode = periode.id_periode;
      }

      await RekapJumlahMahasiswa.create({
        nama_periode: rekap_jumlah_mahasiswa.nama_periode,
        aktif: rekap_jumlah_mahasiswa.aktif,
        cuti: rekap_jumlah_mahasiswa.cuti,
        non_aktif: rekap_jumlah_mahasiswa.non_aktif,
        sedang_double: rekap_jumlah_mahasiswa.sedang_double,
        id_periode: id_periode,
        id_prodi: rekap_jumlah_mahasiswa.id_prodi,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Rekap Jumlah Mahasiswa Success",
      totalData: dataRekapJumlahMahasiswa.length,
      dataRekapJumlahMahasiswa: dataRekapJumlahMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRekapJumlahMahasiswa,
};
