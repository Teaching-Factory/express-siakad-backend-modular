const { Sumber } = require("../../../models");

const getAllSumber = async (req, res, next) => {
  try {
    // Ambil semua data sumbers dari database
    const sumbers = await Sumber.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Sumber Success",
      jumlahData: sumbers.length,
      data: sumbers
    });
  } catch (error) {
    next(error);
  }
};

const getAllSumberAktif = async (req, res, next) => {
  try {
    // Ambil semua data sumber aktif dari database
    const sumber_aktif = await Sumber.findAll({
      where: {
        status: true
      }
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Sumber Aktif Success",
      jumlahData: sumber_aktif.length,
      data: sumber_aktif
    });
  } catch (error) {
    next(error);
  }
};

const getSumberById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const sumberId = req.params.id;

    if (!sumberId) {
      return res.status(400).json({
        message: "Sumber ID is required"
      });
    }

    // Cari data sumber berdasarkan ID di database
    const sumber = await Sumber.findByPk(sumberId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!sumber) {
      return res.status(404).json({
        message: `<===== Sumber With ID ${sumberId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Sumber By ID ${sumberId} Success:`,
      data: sumber
    });
  } catch (error) {
    next(error);
  }
};

const createSumber = async (req, res, next) => {
  const { nama_sumber } = req.body;

  if (!nama_sumber) {
    return res.status(400).json({ message: "nama_sumber is required" });
  }

  try {
    // Gunakan metode create untuk membuat data sumber baru
    const newSumber = await Sumber.create({ nama_sumber });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Sumber Success",
      data: newSumber
    });
  } catch (error) {
    next(error);
  }
};

const updateSumberById = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { nama_sumber, status } = req.body;

  if (!nama_sumber) {
    return res.status(400).json({ message: "nama_sumber is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const sumberId = req.params.id;

    if (!sumberId) {
      return res.status(400).json({
        message: "Sumber ID is required"
      });
    }

    // Cari data sumber berdasarkan ID di database
    let sumber = await Sumber.findByPk(sumberId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!sumber) {
      return res.status(404).json({
        message: `<===== Sumber With ID ${sumberId} Not Found:`
      });
    }

    // Update data sumber
    sumber.nama_sumber = nama_sumber;
    sumber.status = status;

    // Simpan perubahan ke dalam database
    await sumber.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Sumber With ID ${sumberId} Success:`,
      data: sumber
    });
  } catch (error) {
    next(error);
  }
};

const deleteSumberById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const sumberId = req.params.id;

    if (!sumberId) {
      return res.status(400).json({
        message: "Sumber ID is required"
      });
    }

    // Cari data sumber berdasarkan ID di database
    let sumber = await Sumber.findByPk(sumberId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!sumber) {
      return res.status(404).json({
        message: `<===== Sumber With ID ${sumberId} Not Found:`
      });
    }

    // Hapus data sumber dari database
    await sumber.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Sumber With ID ${sumberId} Success:`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSumber,
  getAllSumberAktif,
  getSumberById,
  createSumber,
  updateSumberById,
  deleteSumberById
};
