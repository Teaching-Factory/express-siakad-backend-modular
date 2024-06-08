const { Agama } = require("../../models");

const getAllAgamas = async (req, res, next) => {
  try {
    // Ambil semua data agamas dari database
    const agamas = await Agama.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Agama Success",
      jumlahData: agamas.length,
      data: agamas,
    });
  } catch (error) {
    next(error);
  }
};

const getAgamaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const agamaId = req.params.id;

    // Cari data agama berdasarkan ID di database
    const agama = await Agama.findByPk(agamaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!agama) {
      return res.status(404).json({
        message: `<===== Agama With ID ${agamaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Agama By ID ${agamaId} Success:`,
      data: agama,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAgamas,
  getAgamaById,
};
