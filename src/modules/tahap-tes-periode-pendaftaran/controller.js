const { TahapTesPeriodePendaftaran, JenisTes, PeriodePendaftaran, Camaba } = require("../../../models");

const getAllTahapTesPeriodePendaftaran = async (req, res, next) => {
  try {
    // Ambil semua data tahap_tes_periode_pendaftarans dari database
    const tahap_tes_periode_pendaftarans = await TahapTesPeriodePendaftaran.findAll({
      include: [{ model: JenisTes }, { model: PeriodePendaftaran }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Tahap Tes Periode Pendaftaran Success",
      jumlahData: tahap_tes_periode_pendaftarans.length,
      data: tahap_tes_periode_pendaftarans,
    });
  } catch (error) {
    next(error);
  }
};

const getTahapTesPeriodePendaftaranById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const tahapTesPeriodePendaftaranId = req.params.id;

    if (!tahapTesPeriodePendaftaranId) {
      return res.status(400).json({
        message: "Tahap Tes Periode Pendaftaran ID is required",
      });
    }

    // Cari data tahap_tes_periode_pendaftaran berdasarkan ID di database
    const tahap_tes_periode_pendaftaran = await TahapTesPeriodePendaftaran.findByPk(tahapTesPeriodePendaftaranId, {
      include: [{ model: JenisTes }, { model: PeriodePendaftaran }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!tahap_tes_periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Tahap Tes Periode Pendaftaran With ID ${tahapTesPeriodePendaftaranId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Tahap Tes Periode Pendaftaran By ID ${tahapTesPeriodePendaftaranId} Success:`,
      data: tahap_tes_periode_pendaftaran,
    });
  } catch (error) {
    next(error);
  }
};

const getTahapTesPeriodePendaftaranByPeriodePendaftaranId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const periodePendaftaranId = req.params.id_periode_pendaftaran;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required",
      });
    }

    // Cari data tahap_periode_pendaftaran berdasarkan ID periode_pendaftaran di database
    const tahap_periode_pendaftaran = await TahapTesPeriodePendaftaran.findAll({
      where: {
        id_periode_pendaftaran: periodePendaftaranId,
      },
      include: [{ model: JenisTes }, { model: PeriodePendaftaran }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!tahap_periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Tahap Tes Periode Pendaftaran With ID Periode Pendaftaran ${periodePendaftaranId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Tahap Tes Periode Pendaftaran By ID Periode Pendaftaran ${periodePendaftaranId} Success:`,
      data: tahap_periode_pendaftaran,
    });
  } catch (error) {
    next(error);
  }
};

const getTahapTesPeriodePendaftaranByCamabaId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const camabaId = req.params.id_camaba;

    if (!camabaId) {
      return res.status(400).json({
        message: "Camaba ID is required",
      });
    }

    // get data camaba
    const camaba = await Camaba.findByPk(camabaId);

    // Cari data tahap_tes_periode_pendaftaran berdasarkan ID di database
    const tahap_tes_periode_pendaftaran = await TahapTesPeriodePendaftaran.findAll({
      where: {
        id_periode_pendaftaran: camaba.id_periode_pendaftaran,
      },
      include: [{ model: JenisTes }, { model: PeriodePendaftaran }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!tahap_tes_periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Tahap Tes Periode Pendaftaran With Camaba ID ${camabaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Tahap Tes Periode Pendaftaran By Camaba ID ${camabaId} Success:`,
      data: tahap_tes_periode_pendaftaran,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTahapTesPeriodePendaftaran,
  getTahapTesPeriodePendaftaranById,
  getTahapTesPeriodePendaftaranByPeriodePendaftaranId,
  getTahapTesPeriodePendaftaranByCamabaId,
};
