const { Angkatan } = require("../../../models");

const getAllAngkatanByGuest = async (req, res, next) => {
  try {
    // Ambil semua data angkatans dari database
    const angkatans = await Angkatan.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Angkatan by Guest Success",
      jumlahData: angkatans.length,
      data: angkatans,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAngkatanByGuest,
};
