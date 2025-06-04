const { Substansi, Prodi, JenisSubstansi } = require("../../../models");

const getAllSubstansi = async (req, res, next) => {
  try {
    // Ambil semua data substansi dari database
    const substansi = await Substansi.findAll({ include: [{ model: Prodi }, { model: JenisSubstansi }] });

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

const getSubstansiById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const SubstansiId = req.params.id;

    // Periksa apakah ID disediakan
    if (!SubstansiId) {
      return res.status(400).json({
        message: "Substansi ID is required",
      });
    }

    // Cari data substansi berdasarkan ID di database
    const substansi = await Substansi.findByPk(SubstansiId, {
      include: [{ model: Prodi }, { model: JenisSubstansi }],
    });

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
