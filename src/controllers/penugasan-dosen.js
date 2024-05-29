const { PenugasanDosen, Dosen, TahunAjaran, PerguruanTinggi, Prodi } = require("../../models");

const getAllPenugasanDosen = async (req, res) => {
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

const getPenugasanDosenById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const PenugasanDosenId = req.params.id;

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

module.exports = {
  getAllPenugasanDosen,
  getPenugasanDosenById,
};
