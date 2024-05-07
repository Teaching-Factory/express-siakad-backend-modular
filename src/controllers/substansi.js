const { Substansi } = require("../../models");

const getAllSubstansi = async (req, res) => {
  try {
    // Ambil semua data substansi dari database
    const substansi = await Substansi.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Substansi Success",
      jumlahData: substansi.length,
      data: substansi,
    });
  } catch (error) {
    next(error);
  }
};

const getSubstansiById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const SubstansiId = req.params.id;

    // Cari data substansi berdasarkan ID di database
    const substansi = await Substansi.findByPk(SubstansiId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!substansi) {
      return res.status(404).json({
        message: `<===== Substansi With ID ${SubstansiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Substansi By ID ${SubstansiId} Success:`,
      data: substansi,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSubstansi,
  getSubstansiById,
};
