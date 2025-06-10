const { PeriodeYudisium, Semester } = require("../../../models");

const getAllPeriodeYudisium = async (req, res, next) => {
  try {
    // Ambil semua data periode_yudisiums dari database
    const periode_yudisiums = await PeriodeYudisium.findAll({
      include: [{ model: Semester }]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Periode Yudisium Success",
      jumlahData: periode_yudisiums.length,
      data: periode_yudisiums
    });
  } catch (error) {
    next(error);
  }
};

const getPeriodeYudisiumById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const periodeYudisiumId = req.params.id;

    if (!periodeYudisiumId) {
      return res.status(400).json({
        message: "Periode Yudisium ID is required"
      });
    }

    // Cari data periode_yudisium berdasarkan ID di database
    const periode_yudisium = await PeriodeYudisium.findByPk(periodeYudisiumId, {
      include: [{ model: Semester }]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode_yudisium) {
      return res.status(404).json({
        message: `<===== Periode Yudisium With ID ${periodeYudisiumId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Periode Yudisium By ID ${periodeYudisiumId} Success:`,
      data: periode_yudisium
    });
  } catch (error) {
    next(error);
  }
};

const createPeriodeYudisium = async (req, res, next) => {
  const { nama_periode_yudisium, id_semester } = req.body;

  if (!nama_periode_yudisium) {
    return res.status(400).json({ message: "nama_periode_yudisium is required" });
  }
  if (!id_semester) {
    return res.status(400).json({ message: "id_semester is required" });
  }

  try {
    // Gunakan metode create untuk membuat data periode yudisium baru
    const newPeriodeYudisium = await PeriodeYudisium.create({ nama_periode_yudisium, id_semester });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Periode Yudisium Success",
      data: newPeriodeYudisium
    });
  } catch (error) {
    next(error);
  }
};

const updatePeriodeYudisiumById = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { nama_periode_yudisium, id_semester } = req.body;

  if (!nama_periode_yudisium) {
    return res.status(400).json({ message: "nama_periode_yudisium is required" });
  }
  if (!id_semester) {
    return res.status(400).json({ message: "id_semester is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const periodeYudisiumId = req.params.id;

    if (!periodeYudisiumId) {
      return res.status(400).json({
        message: "Periode Yudisium ID is required"
      });
    }

    // Cari data periode_yudisium berdasarkan ID di database
    let periode_yudisium = await PeriodeYudisium.findByPk(periodeYudisiumId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode_yudisium) {
      return res.status(404).json({
        message: `<===== Periode Yudisium With ID ${periodeYudisiumId} Not Found:`
      });
    }

    // Update data periode_yudisium
    periode_yudisium.nama_periode_yudisium = nama_periode_yudisium;
    periode_yudisium.id_semester = id_semester;

    // Simpan perubahan ke dalam database
    await periode_yudisium.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Periode Yudisium With ID ${periodeYudisiumId} Success:`,
      data: periode_yudisium
    });
  } catch (error) {
    next(error);
  }
};

const deletePeriodeYudisiumById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const periodeYudisiumId = req.params.id;

    if (!periodeYudisiumId) {
      return res.status(400).json({
        message: "Periode Yudisium ID is required"
      });
    }

    // Cari data periode_yudisium berdasarkan ID di database
    let periode_yudisium = await PeriodeYudisium.findByPk(periodeYudisiumId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode_yudisium) {
      return res.status(404).json({
        message: `<===== Periode Yudisium With ID ${periodeYudisiumId} Not Found:`
      });
    }

    // Hapus data periode_yudisium dari database
    await periode_yudisium.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Periode Yudisium With ID ${periodeYudisiumId} Success:`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPeriodeYudisium,
  getPeriodeYudisiumById,
  createPeriodeYudisium,
  updatePeriodeYudisiumById,
  deletePeriodeYudisiumById
};
