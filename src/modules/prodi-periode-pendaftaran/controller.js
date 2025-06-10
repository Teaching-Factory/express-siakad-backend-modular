const { ProdiPeriodePendaftaran, Prodi, PeriodePendaftaran } = require("../../../models");

const getAllProdiPeriodePendaftaran = async (req, res, next) => {
  try {
    // Ambil semua data prodi_periode_pendaftarans dari database
    const prodi_periode_pendaftarans = await ProdiPeriodePendaftaran.findAll({
      include: [{ model: Prodi }, { model: PeriodePendaftaran }]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Prodi Periode Pendaftaran Success",
      jumlahData: prodi_periode_pendaftarans.length,
      data: prodi_periode_pendaftarans
    });
  } catch (error) {
    next(error);
  }
};

const getProdiPeriodePendaftaranById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiPeriodePendaftaranId = req.params.id;

    if (!prodiPeriodePendaftaranId) {
      return res.status(400).json({
        message: "Prodi Periode Pendaftaran ID is required"
      });
    }

    // Cari data prodi_periode_pendaftaran berdasarkan ID di database
    const prodi_periode_pendaftaran = await ProdiPeriodePendaftaran.findByPk(prodiPeriodePendaftaranId, {
      include: [{ model: Prodi }, { model: PeriodePendaftaran }]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!prodi_periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Prodi Periode Pendaftaran With ID ${prodiPeriodePendaftaranId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Prodi Periode Pendaftaran By ID ${prodiPeriodePendaftaranId} Success:`,
      data: prodi_periode_pendaftaran
    });
  } catch (error) {
    next(error);
  }
};

const getProdiPeriodePendaftaranByPeriodePendaftaranId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const periodePendaftaranId = req.params.id_periode_pendaftaran;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required"
      });
    }

    // Cari data prodi_periode_pendaftaran berdasarkan ID periode_pendaftaran di database
    const prodi_periode_pendaftaran = await ProdiPeriodePendaftaran.findAll({
      where: {
        id_periode_pendaftaran: periodePendaftaranId
      },
      include: [{ model: Prodi }, { model: PeriodePendaftaran }]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!prodi_periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Prodi Periode Pendaftaran With ID Periode Pendaftaran ${periodePendaftaranId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Prodi Periode Pendaftaran By ID Periode Pendaftaran ${periodePendaftaranId} Success:`,
      data: prodi_periode_pendaftaran
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProdiPeriodePendaftaran,
  getProdiPeriodePendaftaranById,
  getProdiPeriodePendaftaranByPeriodePendaftaranId
};
