const { SumberPeriodePendaftaran, Sumber, PeriodePendaftaran } = require("../../models");

const getAllSumberPeriodePendaftaran = async (req, res, next) => {
  try {
    // Ambil semua data sumber_periode_pendaftarans dari database
    const sumber_periode_pendaftarans = await SumberPeriodePendaftaran.findAll({
      include: [{ model: Sumber }, { model: PeriodePendaftaran }]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Sumber Periode Pendaftaran Success",
      jumlahData: sumber_periode_pendaftarans.length,
      data: sumber_periode_pendaftarans
    });
  } catch (error) {
    next(error);
  }
};

const getSumberPeriodePendaftaranById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const sumberPeriodePendaftaranId = req.params.id;

    if (!sumberPeriodePendaftaranId) {
      return res.status(400).json({
        message: "Sumber Periode Pendaftaran ID is required"
      });
    }

    // Cari data sumber_periode_pendaftaran berdasarkan ID di database
    const sumber_periode_pendaftaran = await SumberPeriodePendaftaran.findByPk(sumberPeriodePendaftaranId, {
      include: [{ model: Sumber }, { model: PeriodePendaftaran }]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!sumber_periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Sumber Periode Pendaftaran With ID ${sumberPeriodePendaftaranId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Sumber Periode Pendaftaran By ID ${sumberPeriodePendaftaranId} Success:`,
      data: sumber_periode_pendaftaran
    });
  } catch (error) {
    next(error);
  }
};

const getSumberPeriodePendaftaranByPeriodePendaftaranId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const periodePendaftaranId = req.params.id_periode_pendaftaran;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required"
      });
    }

    // Cari data sumber_periode_pendaftaran berdasarkan ID periode_pendaftaran di database
    const sumber_periode_pendaftaran = await SumberPeriodePendaftaran.findAll({
      where: {
        id_periode_pendaftaran: periodePendaftaranId
      },
      include: [{ model: Sumber }, { model: PeriodePendaftaran }]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!sumber_periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Sumber Periode Pendaftaran With ID Periode Pendaftaran ${periodePendaftaranId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Sumber Periode Pendaftaran By ID Periode Pendaftaran ${periodePendaftaranId} Success:`,
      data: sumber_periode_pendaftaran
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSumberPeriodePendaftaran,
  getSumberPeriodePendaftaranById,
  getSumberPeriodePendaftaranByPeriodePendaftaranId
};
