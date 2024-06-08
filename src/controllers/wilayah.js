const { Wilayah, Negara } = require("../../models");

const getAllWilayahs = async (req, res, next) => {
  try {
    // Ambil semua data wilayahs dari database
    const wilayahs = await Wilayah.findAll({ include: [{ model: Negara }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Wilayah Success",
      jumlahData: wilayahs.length,
      data: wilayahs,
    });
  } catch (error) {
    next(error);
  }
};

const getWilayahById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const wilayahId = req.params.id;

    // Cari data wilayah berdasarkan ID di database
    const wilayah = await Wilayah.findByPk(wilayahId, {
      include: [{ model: Negara }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!wilayah) {
      return res.status(404).json({
        message: `<===== Wilayah With ID ${wilayahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Wilayah By ID ${wilayahId} Success:`,
      data: wilayah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllWilayahs,
  getWilayahById,
};
