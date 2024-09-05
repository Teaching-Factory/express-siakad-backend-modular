const { JenisTes } = require("../../models");

const getAllJenisTes = async (req, res, next) => {
  try {
    // Ambil semua data jenis_tes dari database
    const jenis_tes = await JenisTes.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Jenis Tes Success",
      jumlahData: jenis_tes.length,
      data: jenis_tes
    });
  } catch (error) {
    next(error);
  }
};

const getJenisTesById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const jenisTesId = req.params.id;

    if (!jenisTesId) {
      return res.status(400).json({
        message: "Jenis Tes ID is required"
      });
    }

    // Cari data jenis_tes berdasarkan ID di database
    const jenis_tes = await JenisTes.findByPk(jenisTesId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenis_tes) {
      return res.status(404).json({
        message: `<===== Jenis Tes With ID ${jenisTesId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Jenis Tes By ID ${jenisTesId} Success:`,
      data: jenis_tes
    });
  } catch (error) {
    next(error);
  }
};

const createJenisTes = async (req, res, next) => {
  const { nama_tes, keterangan_singkat } = req.body;

  if (!nama_tes) {
    return res.status(400).json({ message: "nama_tes is required" });
  }

  try {
    // Gunakan metode create untuk membuat data jenis tes baru
    const newJenisTes = await JenisTes.create({ nama_tes, keterangan_singkat });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Jenis Tes Success",
      data: newJenisTes
    });
  } catch (error) {
    next(error);
  }
};

const updateJenisTesById = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { nama_tes, keterangan_singkat } = req.body;

  if (!nama_tes) {
    return res.status(400).json({ message: "nama_tes is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const jenisTesId = req.params.id;

    if (!jenisTesId) {
      return res.status(400).json({
        message: "Jenis Tes ID is required"
      });
    }

    // Cari data jenis_tes berdasarkan ID di database
    let jenis_tes = await JenisTes.findByPk(jenisTesId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenis_tes) {
      return res.status(404).json({
        message: `<===== Jenis Tes With ID ${jenisTesId} Not Found:`
      });
    }

    // Update data jenis_tes
    jenis_tes.nama_tes = nama_tes;
    jenis_tes.keterangan_singkat = keterangan_singkat;

    // Simpan perubahan ke dalam database
    await jenis_tes.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Jenis Tes With ID ${jenisTesId} Success:`,
      data: jenis_tes
    });
  } catch (error) {
    next(error);
  }
};

const deleteJenisTesById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const jenisTesId = req.params.id;

    if (!jenisTesId) {
      return res.status(400).json({
        message: "Jenis Tes ID is required"
      });
    }

    // Cari data jenis_tes berdasarkan ID di database
    let jenis_tes = await JenisTes.findByPk(jenisTesId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenis_tes) {
      return res.status(404).json({
        message: `<===== Jenis Tes With ID ${jenisTesId} Not Found:`
      });
    }

    // Hapus data jenis_tes dari database
    await jenis_tes.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Jenis Tes With ID ${jenisTesId} Success:`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJenisTes,
  getJenisTesById,
  createJenisTes,
  updateJenisTesById,
  deleteJenisTesById
};
