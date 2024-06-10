const { MataKuliah, Prodi } = require("../../models");

const getAllMataKuliah = async (req, res, next) => {
  try {
    // Ambil semua data mata_kuliah dari database
    const mata_kuliah = await MataKuliah.findAll({ include: [{ model: Prodi }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Mata Kuliah Success",
      jumlahData: mata_kuliah.length,
      data: mata_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getMataKuliahById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const MataKuliahId = req.params.id;

    // Periksa apakah ID disediakan
    if (!MataKuliahId) {
      return res.status(400).json({
        message: "Mata Kuliah ID is required",
      });
    }

    // Cari data mata_kuliah berdasarkan ID di database
    const mata_kuliah = await MataKuliah.findByPk(MataKuliahId, {
      include: [{ model: Prodi }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!mata_kuliah) {
      return res.status(404).json({
        message: `<===== Mata Kuliah With ID ${MataKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Mata Kuliah By ID ${MataKuliahId} Success:`,
      data: mata_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMataKuliah,
  getMataKuliahById,
};
