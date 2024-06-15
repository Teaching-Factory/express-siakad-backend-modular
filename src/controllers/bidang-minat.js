const { BidangMinat, Prodi } = require("../../models");

const getAllBidangMinat = async (req, res, next) => {
  try {
    // Ambil semua data bidang_minat dari database
    const bidang_minat = await BidangMinat.findAll({ include: [{ model: Prodi }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Bidang Minat Success",
      jumlahData: bidang_minat.length,
      data: bidang_minat,
    });
  } catch (error) {
    next(error);
  }
};

const getBidangMinatById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const BidangMinatId = req.params.id;

    // Periksa apakah ID disediakan
    if (!BidangMinatId) {
      return res.status(400).json({
        message: "Bidang Minat ID is required",
      });
    }

    // Cari data bidang_minat berdasarkan ID di database
    const bidang_minat = await BidangMinat.findByPk(BidangMinatId, {
      include: [{ model: Prodi }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!bidang_minat) {
      return res.status(404).json({
        message: `<===== Bidang Minat With ID ${BidangMinatId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Bidang Minat By ID ${BidangMinatId} Success:`,
      data: bidang_minat,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBidangMinat,
  getBidangMinatById,
};
