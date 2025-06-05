const { PenugasanDosen, Dosen, TahunAjaran, PerguruanTinggi, Prodi } = require("../../../models");

const getAllPenugasanDosen = async (req, res, next) => {
  try {
    // Ambil semua data penugasan_dosen dari database
    const penugasan_dosen = await PenugasanDosen.findAll({ include: [{ model: Dosen }, { model: TahunAjaran }, { model: PerguruanTinggi }, { model: Prodi }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Penugasan Dosen Success",
      jumlahData: penugasan_dosen.length,
      data: penugasan_dosen,
    });
  } catch (error) {
    next(error);
  }
};

const getPenugasanDosenById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const PenugasanDosenId = req.params.id;

    // Periksa apakah ID disediakan
    if (!PenugasanDosenId) {
      return res.status(400).json({
        message: "Penugasan Dosen ID is required",
      });
    }

    // Cari data penugasan_dosen berdasarkan ID di database
    const penugasan_dosen = await PenugasanDosen.findByPk(PenugasanDosenId, {
      include: [{ model: Dosen }, { model: TahunAjaran }, { model: PerguruanTinggi }, { model: Prodi }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!penugasan_dosen) {
      return res.status(404).json({
        message: `<===== Penugasan Dosen With ID ${PenugasanDosenId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Penugasan Dosen By ID ${PenugasanDosenId} Success:`,
      data: penugasan_dosen,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPenugasanDosenByProdiId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;

    // Periksa apakah ID disediakan
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }

    // Ambil semua data penugasan_dosen dari database
    const penugasan_dosen = await PenugasanDosen.findAll({
      where: {
        id_prodi: prodiId,
      },
      include: [{ model: Dosen }, { model: TahunAjaran }, { model: PerguruanTinggi }, { model: Prodi }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Penugasan Dosen By Prodi Id ${prodiId} Success`,
      jumlahData: penugasan_dosen.length,
      data: penugasan_dosen,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPenugasanDosen,
  getPenugasanDosenById,
  getAllPenugasanDosenByProdiId,
};
