const { Negara } = require("../../models");

const getAllNegaras = async (req, res) => {
  try {
    // Ambil semua data negaras dari database
    const negaras = await Negara.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Negara Success",
      jumlahData: negaras.length,
      data: negaras,
    });
  } catch (error) {
    next(error);
  }
};

const getNegaraById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const negaraId = req.params.id;

    // Cari data negara berdasarkan ID di database
    const negara = await Negara.findByPk(negaraId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!negara) {
      return res.status(404).json({
        message: `<===== Negara With ID ${negaraId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Negara By ID ${negaraId} Success:`,
      data: negara,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllNegaras,
  getNegaraById,
};
