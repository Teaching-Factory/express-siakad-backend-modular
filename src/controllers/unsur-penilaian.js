const { UnsurPenilaian } = require("../../models");

const getAllUnsurPenilaian = async (req, res) => {
  try {
    // Ambil semua data unsur_penilaian dari database
    const unsur_penilaian = await UnsurPenilaian.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Unsur Penilaian Success",
      jumlahData: unsur_penilaian.length,
      data: unsur_penilaian,
    });
  } catch (error) {
    next(error);
  }
};

const getUnsurPenilaianById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const UnsurPenilaianId = req.params.id;

    // Cari data unsur_penilaian berdasarkan ID di database
    const unsur_penilaian = await UnsurPenilaian.findByPk(UnsurPenilaianId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!unsur_penilaian) {
      return res.status(404).json({
        message: `<===== Unsur Penilaian With ID ${UnsurPenilaianId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Unsur Penilaian By ID ${UnsurPenilaianId} Success:`,
      data: unsur_penilaian,
    });
  } catch (error) {
    next(error);
  }
};

const createUnsurPenilaian = async (req, res, next) => {
  try {
    const { id_unsur, nama_unsur_penilaian } = req.body;
    // Gunakan metode create untuk membuat data unsur_penilaian baru
    const newUnsurPenilaian = await UnsurPenilaian.create({
      id_unsur,
      nama_unsur_penilaian,
      nama_lembaga: "Universitas Bakti Indonesia",
    });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Unsur Penilaian Success",
      data: newUnsurPenilaian,
    });
  } catch (error) {
    next(error);
  }
};

const updateUnsurPenilaianById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const unsurPenilaianId = req.params.id;

    // Dapatkan data yang akan diupdate dari body permintaan
    const { id_unsur, nama_unsur_penilaian } = req.body;

    // Cari data unsur_penilaian berdasarkan ID di database
    let unsur_penilaian = await UnsurPenilaian.findByPk(unsurPenilaianId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!unsur_penilaian) {
      return res.status(404).json({
        message: `<===== Unsur Penilaian With ID ${unsurPenilaianId} Not Found:`,
      });
    }

    // Update data unsur_penilaian
    unsur_penilaian.id_unsur = id_unsur;
    unsur_penilaian.nama_unsur_penilaian = nama_unsur_penilaian;

    // Simpan perubahan ke dalam database
    await unsur_penilaian.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Unsur Penilaian With ID ${unsurPenilaianId} Success:`,
      data: unsur_penilaian,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUnsurPenilaianById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const unsurPenilaianId = req.params.id;

    // Cari data unsur_penilaian berdasarkan ID di database
    let unsur_penilaian = await UnsurPenilaian.findByPk(unsurPenilaianId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!unsur_penilaian) {
      return res.status(404).json({
        message: `<===== Unsur Penilaian With ID ${unsurPenilaianId} Not Found:`,
      });
    }

    // Hapus data unsur_penilaian dari database
    await unsur_penilaian.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Unsur Penilaian With ID ${unsurPenilaianId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUnsurPenilaian,
  getUnsurPenilaianById,
  createUnsurPenilaian,
  updateUnsurPenilaianById,
  deleteUnsurPenilaianById,
};
