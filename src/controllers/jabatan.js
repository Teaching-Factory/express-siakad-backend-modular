const { Jabatan } = require("../../models");

const getAllJabatan = async (req, res, next) => {
  try {
    // Ambil semua data jabatans dari database
    const jabatans = await Jabatan.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Jabatan Success",
      jumlahData: jabatans.length,
      data: jabatans,
    });
  } catch (error) {
    next(error);
  }
};

const getJabatanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const jabatanId = req.params.id;

    // Cari data jabatan berdasarkan ID di database
    const jabatan = await Jabatan.findByPk(jabatanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jabatan) {
      return res.status(404).json({
        message: `<===== Jabatan With ID ${jabatanId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Jabatan By ID ${jabatanId} Success:`,
      data: jabatan,
    });
  } catch (error) {
    next(error);
  }
};

const createJabatan = async (req, res, next) => {
  try {
    const { nama_jabatan } = req.body;
    // Gunakan metode create untuk membuat data jabatan baru
    const newJabatan = await Jabatan.create({ nama_jabatan });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Jabatan Success",
      data: newJabatan,
    });
  } catch (error) {
    next(error);
  }
};

const updateJabatanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const jabatanId = req.params.id;

    // Dapatkan data yang akan diupdate dari body permintaan
    const { nama_jabatan } = req.body;

    // Cari data jabatan berdasarkan ID di database
    let jabatan = await Jabatan.findByPk(jabatanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jabatan) {
      return res.status(404).json({
        message: `<===== Jabatan With ID ${jabatanId} Not Found:`,
      });
    }

    // Update data jabatan
    jabatan.nama_jabatan = nama_jabatan;

    // Simpan perubahan ke dalam database
    await jabatan.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Jabatan With ID ${jabatanId} Success:`,
      data: jabatan,
    });
  } catch (error) {
    next(error);
  }
};

const deleteJabatanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const jabatanId = req.params.id;

    // Cari data jabatan berdasarkan ID di database
    let jabatan = await Jabatan.findByPk(jabatanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jabatan) {
      return res.status(404).json({
        message: `<===== Jabatan With ID ${jabatanId} Not Found:`,
      });
    }

    // Hapus data jabatan dari database
    await jabatan.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Jabatan With ID ${jabatanId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJabatan,
  getJabatanById,
  createJabatan,
  updateJabatanById,
  deleteJabatanById,
};
