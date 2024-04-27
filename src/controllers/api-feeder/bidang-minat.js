const axios = require("axios");
const { getToken } = require("./get-token");
const { BidangMinat } = require("../../../models");

const getBidangMinat = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetListBidangMinat",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataBidangMinat = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const bidang_minat of dataBidangMinat) {
      // Periksa apakah data sudah ada di tabel
      const existingBidangMinat = await BidangMinat.findOne({
        where: {
          id_bidang_minat: bidang_minat.id_bidang_minat,
        },
      });

      if (!existingBidangMinat) {
        // Data belum ada, buat entri baru di database
        await BidangMinat.create({
          id_bidang_minat: bidang_minat.id_bidang_minat,
          nm_bidang_minat: bidang_minat.nm_bidang_minat,
          smt_dimulai: bidang_minat.smt_dimulai,
          sk_bidang_minat: bidang_minat.sk_bidang_minat,
          tamat_sk_bidang_minat: bidang_minat.tamat_sk_bidang_minat,
          id_prodi: bidang_minat.id_prodi,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Bidang Minat Success",
      totalData: dataBidangMinat.length,
      dataBidangMinat: dataBidangMinat,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBidangMinat,
};
