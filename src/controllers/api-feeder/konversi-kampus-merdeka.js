const axios = require("axios");
const { getToken } = require("./get-token");
const { KonversiKampusMerdeka } = require("../../../models");

const getKonversiKampusMerdeka = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetListKonversiKampusMerdeka",
      token: `${token}`,
      order: "id_konversi_aktivitas",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataKonversiKampusMerdeka = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const konversi_kampus_merdeka of dataKonversiKampusMerdeka) {
      // Periksa apakah data sudah ada di tabel
      const existingKonversiKampusMerdeka = await KonversiKampusMerdeka.findOne({
        where: {
          id_konversi_aktivitas: konversi_kampus_merdeka.id_konversi_aktivitas,
        },
      });

      if (!existingKonversiKampusMerdeka) {
        // Data belum ada, buat entri baru di database
        await KonversiKampusMerdeka.create({
          id_konversi_aktivitas: konversi_kampus_merdeka.id_konversi_aktivitas,
          nilai_angka: konversi_kampus_merdeka.nilai_angka,
          nilai_indeks: konversi_kampus_merdeka.nilai_indeks,
          nilai_huruf: konversi_kampus_merdeka.nilai_huruf,
          id_matkul: konversi_kampus_merdeka.id_matkul,
          id_anggota: konversi_kampus_merdeka.id_anggota,
        });
      }
    }
    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Konversi Kampus Merdeka Success",
      totalData: dataKonversiKampusMerdeka.length,
      dataKonversiKampusMerdeka: dataKonversiKampusMerdeka,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKonversiKampusMerdeka,
};
