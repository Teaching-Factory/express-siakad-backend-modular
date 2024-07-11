const { SemesterAktif, Semester } = require("../../models");

const getAllSemesterAktif = async (req, res, next) => {
  try {
    // Ambil semua data semester_aktifs dari database
    const semester_aktifs = await SemesterAktif.findAll({
      include: [{ model: Semester }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Semester Aktif Success",
      jumlahData: semester_aktifs.length,
      data: semester_aktifs,
    });
  } catch (error) {
    next(error);
  }
};

const getSemesterAktifById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterAktifId = req.params.id;

    if (!semesterAktifId) {
      return res.status(400).json({
        message: "Semester Aktif ID is required",
      });
    }

    // Cari data semester_aktif berdasarkan ID di database
    const semester_aktif = await SemesterAktif.findByPk(semesterAktifId, {
      include: [{ model: Semester }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!semester_aktif) {
      return res.status(404).json({
        message: `<===== Semester Aktif With ID ${semesterAktifId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Semester Aktif By ID ${semesterAktifId} Success:`,
      data: semester_aktif,
    });
  } catch (error) {
    next(error);
  }
};

const getSemesterAktifNow = async (req, res, next) => {
  try {
    // Cari data semester_aktif berdasarkan ID di database
    const semester_aktif = await SemesterAktif.findOne({
      where: {
        status: true,
      },
      include: [{ model: Semester }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!semester_aktif) {
      return res.status(404).json({
        message: `<===== Semester Aktif Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Semester Aktif Success:`,
      data: semester_aktif,
    });
  } catch (error) {
    next(error);
  }
};

const createSemesterAktif = async (req, res, next) => {
  const { id_semester, status } = req.body;

  if (!id_semester) {
    return res.status(400).json({ message: "id_semester is required" });
  }
  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }

  try {
    // Gunakan metode create untuk membuat data semester aktif baru
    const newSemesterAktif = await SemesterAktif.create({ id_semester, status });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Semester Aktif Success",
      data: newSemesterAktif,
    });
  } catch (error) {
    next(error);
  }
};

const updateSemesterAktifNow = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { id_semester } = req.body;

  if (!id_semester) {
    return res.status(400).json({ message: "id_semester is required" });
  }

  try {
    // get data semester aktif, dengan status bernilai true
    const semester_aktif = await SemesterAktif.findOne({
      where: {
        status: true,
      },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!semester_aktif) {
      return res.status(404).json({
        message: `<===== Semester Aktif Not Found:`,
      });
    }

    // Update data semester_aktif
    semester_aktif.id_semester = id_semester;

    // Simpan perubahan ke dalam database
    await semester_aktif.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Semester Aktif Success:`,
      data: semester_aktif,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSemesterAktif,
  getSemesterAktifById,
  getSemesterAktifNow,
  createSemesterAktif,
  updateSemesterAktifNow,
};
