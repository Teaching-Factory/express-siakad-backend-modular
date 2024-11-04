const { ProdiPeriodePendaftaran, Prodi, JenjangPendidikan } = require("../../models");

const getProdiPeriodePendaftaranByPeriodePendaftaranIdGuest = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const periodePendaftaranId = req.params.id_periode_pendaftaran;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required",
      });
    }

    // Cari data prodi_periode_pendaftaran berdasarkan ID periode_pendaftaran di database
    const prodi_periode_pendaftaran = await ProdiPeriodePendaftaran.findAll({
      where: {
        id_periode_pendaftaran: periodePendaftaranId,
      },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!prodi_periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Prodi Periode Pendaftaran With ID Periode Pendaftaran ${periodePendaftaranId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Prodi Periode Pendaftaran By ID Periode Pendaftaran ${periodePendaftaranId} Success:`,
      data: prodi_periode_pendaftaran,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProdiPeriodePendaftaranByPeriodePendaftaranIdGuest,
};
