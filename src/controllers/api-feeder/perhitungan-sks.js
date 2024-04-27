const axios = require("axios");
const { getToken } = require("./get-token");
const { PerhitunganSKS } = require("../../../models");

const getPerhitunganSKS = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetPerhitunganSKS",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataPerhitunganSKS = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const perhitungan_sks of dataPerhitunganSKS) {
      // Periksa apakah data sudah ada di tabel
      const existingPerhitunganSKS = await PerhitunganSKS.findOne({
        where: {
          id_perhitungan_sks: perhitungan_sks.id_perhitungan_sks,
        },
      });

      if (!existingPerhitunganSKS) {
        // Data belum ada, buat entri baru di database
        await PerhitunganSKS.create({
          id_perhitungan_sks: perhitungan_sks.id_perhitungan_sks,
          rencana_minggu_pertemuan: perhitungan_sks.rencana_minggu_pertemuan,
          perhitungan_sks: perhitungan_sks.perhitungan_sks,
          id_kelas_kuliah: perhitungan_sks.id_kelas_kuliah,
          id_registrasi_dosen: perhitungan_sks.id_registrasi_dosen,
          id_substansi: perhitungan_sks.id_substansi,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Perhitungan SKS Success",
      totalData: dataPerhitunganSKS.length,
      dataPerhitunganSKS: dataPerhitunganSKS,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPerhitunganSKS,
};
