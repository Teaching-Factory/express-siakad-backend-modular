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

const getMataKuliahByProdiId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;

    // Periksa apakah ID disediakan
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }

    // Cari data mata_kuliahs berdasarkan ID di database
    const mata_kuliahs = await MataKuliah.findAll({
      where: {
        id_prodi: prodiId,
      },
      include: [{ model: Prodi }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!mata_kuliahs) {
      return res.status(404).json({
        message: `<===== Mata Kuliah By Prodi ID ${prodiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Mata Kuliah By Prodi ID ${prodiId} Success:`,
      jumlahData: mata_kuliahs.length,
      data: mata_kuliahs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMataKuliah,
  getMataKuliahById,
  getMataKuliahByProdiId,
};
