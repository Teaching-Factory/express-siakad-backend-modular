const { BerkasPeriodePendaftaran, JenisBerkas, PeriodePendaftaran } = require("../../../models");

const getAllBerkasPeriodePendaftaran = async (req, res, next) => {
  try {
    // Ambil semua data berkas_periode_pendaftarans dari database
    const berkas_periode_pendaftarans = await BerkasPeriodePendaftaran.findAll({
      include: [{ model: JenisBerkas }, { model: PeriodePendaftaran }]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Berkas Periode Pendaftaran Success",
      jumlahData: berkas_periode_pendaftarans.length,
      data: berkas_periode_pendaftarans
    });
  } catch (error) {
    next(error);
  }
};

const getBerkasPeriodePendaftaranById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const berkasPeriodePendaftaranId = req.params.id;

    if (!berkasPeriodePendaftaranId) {
      return res.status(400).json({
        message: "Berkas Periode Pendaftaran ID is required"
      });
    }

    // Cari data berkas_periode_pendaftaran berdasarkan ID di database
    const berkas_periode_pendaftaran = await BerkasPeriodePendaftaran.findByPk(berkasPeriodePendaftaranId, {
      include: [{ model: JenisBerkas }, { model: PeriodePendaftaran }]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!berkas_periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Berkas Periode Pendaftaran With ID ${berkasPeriodePendaftaranId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Berkas Periode Pendaftaran By ID ${berkasPeriodePendaftaranId} Success:`,
      data: berkas_periode_pendaftaran
    });
  } catch (error) {
    next(error);
  }
};

const getBerkasPeriodePendaftaranByPeriodePendaftaranId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const periodePendaftaranId = req.params.id_periode_pendaftaran;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required"
      });
    }

    // Cari data berkas_periode_pendaftaran berdasarkan ID periode_pendaftaran di database
    const berkas_periode_pendaftaran = await BerkasPeriodePendaftaran.findAll({
      where: {
        id_periode_pendaftaran: periodePendaftaranId
      },
      include: [{ model: JenisBerkas }, { model: PeriodePendaftaran }]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!berkas_periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Berkas Periode Pendaftaran With ID Periode Pendaftaran ${periodePendaftaranId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Berkas Periode Pendaftaran By ID Periode Pendaftaran ${periodePendaftaranId} Success:`,
      data: berkas_periode_pendaftaran
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBerkasPeriodePendaftaran,
  getBerkasPeriodePendaftaranById,
  getBerkasPeriodePendaftaranByPeriodePendaftaranId
};
