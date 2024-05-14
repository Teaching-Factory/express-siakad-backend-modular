const { Angkatan } = require("../../models");

const getAllAngkatan = async (req, res, next) => {
  try {
    // Ambil semua data angkatans dari database
    const angkatans = await Angkatan.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Angkatan Success",
      jumlahData: angkatans.length,
      data: angkatans,
    });
  } catch (error) {
    next(error);
  }
};

const getAngkatanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const angkatanId = req.params.id;

    // Cari data angkatan berdasarkan ID di database
    const angkatan = await Angkatan.findByPk(angkatanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!angkatan) {
      return res.status(404).json({
        message: `<===== Angkatan With ID ${angkatanId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Angkatan By ID ${angkatanId} Success:`,
      data: angkatan,
    });
  } catch (error) {
    next(error);
  }
};

const createAngkatan = async (req, res, next) => {
  try {
    const { tahun } = req.body;
    // Gunakan metode create untuk membuat data angkatan baru
    const newAngkatan = await Angkatan.create({ tahun });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Angkatan Success",
      data: newAngkatan,
    });
  } catch (error) {
    next(error);
  }
};

const updateAngkatanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const angkatanId = req.params.id;

    // Dapatkan data yang akan diupdate dari body permintaan
    const { tahun } = req.body;

    // Cari data angkatan berdasarkan ID di database
    let angkatan = await Angkatan.findByPk(angkatanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!angkatan) {
      return res.status(404).json({
        message: `<===== Angkatan With ID ${angkatanId} Not Found:`,
      });
    }

    // Update data angkatan
    angkatan.tahun = tahun;

    // Simpan perubahan ke dalam database
    await angkatan.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Angkatan With ID ${angkatanId} Success:`,
      data: angkatan,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAngkatanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const angkatanId = req.params.id;

    // Cari data angkatan berdasarkan ID di database
    let angkatan = await Angkatan.findByPk(angkatanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!angkatan) {
      return res.status(404).json({
        message: `<===== Angkatan With ID ${angkatanId} Not Found:`,
      });
    }

    // Hapus data angkatan dari database
    await angkatan.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Angkatan With ID ${angkatanId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAngkatan,
  getAngkatanById,
  createAngkatan,
  updateAngkatanById,
  deleteAngkatanById,
};
