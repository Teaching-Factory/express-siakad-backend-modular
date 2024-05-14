const { Dosen } = require("../../models");

const getAllDosen = async (req, res) => {
  try {
    // Ambil semua data dosen dari database
    const dosen = await Dosen.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Dosen Success",
      jumlahData: dosen.length,
      data: dosen,
    });
  } catch (error) {
    next(error);
  }
};

const getDosenById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const DosenId = req.params.id;

    // Cari data dosen berdasarkan ID di database
    const dosen = await Dosen.findByPk(DosenId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!dosen) {
      return res.status(404).json({
        message: `<===== Dosen With ID ${DosenId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Dosen By ID ${DosenId} Success:`,
      data: dosen,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDosen,
  getDosenById,
};
