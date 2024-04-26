const axios = require("axios");
const { getToken } = require("./get-token");
const { Periode } = require("../../../models");

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
      // Periksa apakah data sudah ada di tabel
      const existingPeriode = await Periode.findOne({
        where: {
          id_periode: data_periode.id_periode,
        },
      });

      if (!existingPeriode) {
        // Data belum ada, buat entri baru di database
        await Periode.create({
          id_periode: data_periode.id_periode, // belum fix
          periode_pelaporan: data_periode.periode_pelaporan,
          tipe_periode: data_periode.tipe_periode,
          id_prodi: data_periode.id_prodi,
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
