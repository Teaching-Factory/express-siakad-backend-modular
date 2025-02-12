const { Kurikulum, Prodi, Semester } = require("../../models");

const getAllKurikulum = async (req, res, next) => {
  try {
    // Ambil semua data kurikulum dari database
    const kurikulum = await Kurikulum.findAll({ include: [{ model: Prodi }, { model: Semester }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Kurikulum Success",
      jumlahData: kurikulum.length,
      data: kurikulum,
    });
  } catch (error) {
    next(error);
  }
};

const getKurikulumById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const KurikulumId = req.params.id;

    // Periksa apakah ID disediakan
    if (!KurikulumId) {
      return res.status(400).json({
        message: "Kurikulum ID is required",
      });
    }

    // Cari data kurikulum berdasarkan ID di database
    const kurikulum = await Kurikulum.findByPk(KurikulumId, {
      include: [{ model: Prodi }, { model: Semester }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!kurikulum) {
      return res.status(404).json({
        message: `<===== Kurikulum With ID ${KurikulumId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Kurikulum By ID ${KurikulumId} Success:`,
      data: kurikulum,
    });
  } catch (error) {
    next(error);
  }
};

const getKurikulumByProdiId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;

    // Periksa apakah ID disediakan
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }

    // Cari data kurikulum berdasarkan Prodi ID di database
    const kurikulum = await Kurikulum.findAll({
      where: {
        id_prodi: prodiId,
      },
      include: [{ model: Prodi }, { model: Semester }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!kurikulum) {
      return res.status(404).json({
        message: `<===== Kurikulum ${prodiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Kurikulum By Prodi ID ${prodiId} Success:`,
      jumlahData: kurikulum.length,
      data: kurikulum,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKurikulum,
  getKurikulumById,
  getKurikulumByProdiId,
};
