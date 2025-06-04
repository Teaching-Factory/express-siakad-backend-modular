const { Periode, Prodi } = require("../../../models");

const getAllPeriode = async (req, res, next) => {
  try {
    // Ambil semua data periode dari database
    const periode = await Periode.findAll({ include: [{ model: Prodi }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Periode Success",
      jumlahData: periode.length,
      data: periode,
    });
  } catch (error) {
    next(error);
  }
};

const getPeriodeById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const PeriodeId = req.params.id;

    // Periksa apakah ID disediakan
    if (!PeriodeId) {
      return res.status(400).json({
        message: "Periode ID is required",
      });
    }

    // Cari data periode berdasarkan ID di database
    const periode = await Periode.findByPk(PeriodeId, {
      include: [{ model: Prodi }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode) {
      return res.status(404).json({
        message: `<===== Periode With ID ${PeriodeId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Periode By ID ${PeriodeId} Success:`,
      data: periode,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPeriode,
  getPeriodeById,
};
