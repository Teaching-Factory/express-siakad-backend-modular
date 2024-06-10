const { JenisSubstansi } = require("../../models");

const getAllJenisSubstansi = async (req, res, next) => {
  try {
    // Ambil semua data jenis_substansi dari database
    const jenis_substansi = await JenisSubstansi.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Jenis Substansi Success",
      jumlahData: jenis_substansi.length,
      data: jenis_substansi,
    });
  } catch (error) {
    next(error);
  }
};

const getJenisSubstansiById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const JenisSubstansiId = req.params.id;

    // Periksa apakah ID disediakan
    if (!JenisSubstansiId) {
      return res.status(400).json({
        message: "Jenis Substansi ID is required",
      });
    }

    // Cari data jenis_substansi berdasarkan ID di database
    const jenis_substansi = await JenisSubstansi.findByPk(JenisSubstansiId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenis_substansi) {
      return res.status(404).json({
        message: `<===== Jenis Substansi With ID ${JenisSubstansiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Jenis Substansi By ID ${JenisSubstansiId} Success:`,
      data: jenis_substansi,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJenisSubstansi,
  getJenisSubstansiById,
};
