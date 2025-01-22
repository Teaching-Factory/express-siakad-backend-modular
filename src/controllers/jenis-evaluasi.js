const { JenisEvaluasi } = require("../../models");

const getAllJenisEvaluasi = async (req, res, next) => {
  try {
    // Ambil semua data jenis_evaluasis dari database
    const jenis_evaluasis = await JenisEvaluasi.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Jenis Evaluasi Success",
      jumlahData: jenis_evaluasis.length,
      data: jenis_evaluasis,
    });
  } catch (error) {
    next(error);
  }
};

const getJenisEvaluasiById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const jenisEvaluasiId = req.params.id;

    if (!jenisEvaluasiId) {
      return res.status(400).json({
        message: "Jenis Evaluasi ID is required",
      });
    }

    // Cari data jabatan berdasarkan ID di database
    const jabatan = await JenisEvaluasi.findByPk(jenisEvaluasiId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jabatan) {
      return res.status(404).json({
        message: `<===== Jenis Evaluasi With ID ${jenisEvaluasiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Jenis Evaluasi By ID ${jenisEvaluasiId} Success:`,
      data: jabatan,
    });
  } catch (error) {
    next(error);
  }
};

const getJenisEvaluasiForRencanaEvaluasi = async (req, res, next) => {
  try {
    // Ambil data jenis_evaluasis untuk kebutuhan penilaian rencana evaluasi matakuliah
    const jenis_evaluasis = await JenisEvaluasi.findAll({
      where: {
        id_jenis_evaluasi: [2, 3, 4],
      },
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET Jenis Evaluasi For Rencana Evaluasi Success",
      jumlahData: jenis_evaluasis.length,
      data: jenis_evaluasis,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJenisEvaluasi,
  getJenisEvaluasiById,
  getJenisEvaluasiForRencanaEvaluasi,
};
