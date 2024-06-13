const { DetailPeriodePerkuliahan, Prodi, Semester } = require("../../models");

const getAllDetailPeriodePerkuliahan = async (req, res, next) => {
  try {
    // Ambil semua data detail_periode_perkuliahan dari database
    const detail_periode_perkuliahan = await DetailPeriodePerkuliahan.findAll({ include: [{ model: Prodi }, { model: Semester }] });

    // Jika data tidak ditemukan, kirim respons 404
    if (!detail_periode_perkuliahan || detail_periode_perkuliahan.length === 0) {
      return res.status(404).json({
        message: `<===== Detail Periode Perkuliahan Not Found`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Periode Perkuliahan Success",
      jumlahData: detail_periode_perkuliahan.length,
      data: detail_periode_perkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

const getDetailPeriodePerkuliahanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const DetailPeriodePerkuliahanId = req.params.id;

    // Periksa apakah ID disediakan
    if (!DetailPeriodePerkuliahanId) {
      return res.status(400).json({
        message: "Detail Periode Perkuliahan ID is required",
      });
    }

    // Cari data detail_periode_perkuliahan berdasarkan ID di database
    const detail_periode_perkuliahan = await DetailPeriodePerkuliahan.findByPk(DetailPeriodePerkuliahanId, {
      include: [{ model: Prodi }, { model: Semester }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!detail_periode_perkuliahan) {
      return res.status(404).json({
        message: `<===== Detail Periode Perkuliahan With ID ${DetailPeriodePerkuliahanId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Detail Periode Perkuliahan By ID ${DetailPeriodePerkuliahanId} Success:`,
      data: detail_periode_perkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDetailPeriodePerkuliahan,
  getDetailPeriodePerkuliahanById,
};
