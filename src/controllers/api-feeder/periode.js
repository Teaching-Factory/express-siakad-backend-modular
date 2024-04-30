const axios = require("axios");
const { getToken } = require("./get-token");
const { Periode } = require("../../../models");
const { Prodi } = require("../../../models");

const getPeriode = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetPeriode",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataPeriode = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const data_periode of dataPeriode) {
      // Cari data prodi berdasarkan id_prodi
      const prodi = await Prodi.findOne({
        where: {
          id_prodi: data_periode.id_prodi,
        },
      });

      // Jika prodi ditemukan, lanjutkan proses penambahan data periode
      if (prodi) {
        await Periode.create({
          id_periode: data_periode.id_periode, // belum fix
          periode_pelaporan: data_periode.periode_pelaporan,
          tipe_periode: data_periode.tipe_periode,
          id_prodi: data_periode.id_prodi,
        });
      } else {
        // Jika prodi tidak ditemukan, kosongkan nilai id_prodi
        await Periode.create({
          id_periode: data_periode.id_periode, // belum fix
          periode_pelaporan: data_periode.periode_pelaporan,
          tipe_periode: data_periode.tipe_periode,
          id_prodi: null,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Periode Success",
      totalData: dataPeriode.length,
      dataPeriode: dataPeriode,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPeriode,
};
