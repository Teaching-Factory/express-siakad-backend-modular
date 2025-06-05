const { PeriodePerkuliahan, Prodi, Semester } = require("../../../models");

const getAllPeriodePerkuliahan = async (req, res, next) => {
  try {
    // Ambil semua data periode_perkuliahan dari database
    const periode_perkuliahan = await PeriodePerkuliahan.findAll({ include: [{ model: Prodi }, { model: Semester }] });

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode_perkuliahan || periode_perkuliahan.length === 0) {
      return res.status(404).json({
        message: `<===== Periode Perkuliahan Not Found`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Periode Perkuliahan Success",
      jumlahData: periode_perkuliahan.length,
      data: periode_perkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

const getPeriodePerkuliahanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const PeriodePerkuliahanId = req.params.id;

    // Periksa apakah ID disediakan
    if (!PeriodePerkuliahanId) {
      return res.status(400).json({
        message: "Periode Perkuliahan ID is required",
      });
    }

    // Cari data periode_perkuliahan berdasarkan ID di database
    const periode_perkuliahan = await PeriodePerkuliahan.findByPk(PeriodePerkuliahanId, {
      include: [{ model: Prodi }, { model: Semester }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode_perkuliahan) {
      return res.status(404).json({
        message: `<===== Periode Perkuliahan With ID ${PeriodePerkuliahanId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Periode Perkuliahan By ID ${PeriodePerkuliahanId} Success:`,
      data: periode_perkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPeriodePerkuliahan,
  getPeriodePerkuliahanById,
};
