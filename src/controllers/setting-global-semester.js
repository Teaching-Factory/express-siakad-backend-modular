const { SettingGlobalSemester, Semester } = require("../../models");

const getAllSettingGlobalSemester = async (req, res, next) => {
  try {
    // Ambil semua data setting_global_semesters dari database
    const setting_global_semesters = await SettingGlobalSemester.findAll({
      include: [
        { model: Semester, as: "SemesterAktif" },
        { model: Semester, as: "SemesterNilai" },
        { model: Semester, as: "SemesterKrs" }
      ]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Setting Global Semester Success",
      jumlahData: setting_global_semesters.length,
      data: setting_global_semesters
    });
  } catch (error) {
    next(error);
  }
};

const getSettingGlobalSemesterById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const settingGlobalSemesterId = req.params.id;

    if (!settingGlobalSemesterId) {
      return res.status(400).json({
        message: "Setting Global Semester ID is required"
      });
    }

    // Cari data setting_global_semester berdasarkan ID di database
    const setting_global_semester = await SettingGlobalSemester.findByPk(settingGlobalSemesterId, {
      include: [
        { model: Semester, as: "SemesterAktif" },
        { model: Semester, as: "SemesterNilai" },
        { model: Semester, as: "SemesterKrs" }
      ]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!setting_global_semester) {
      return res.status(404).json({
        message: `<===== Setting Global Semester With ID ${settingGlobalSemesterId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Setting Global Semester By ID ${settingGlobalSemesterId} Success:`,
      data: setting_global_semester
    });
  } catch (error) {
    next(error);
  }
};

const getSettingGlobalSemesterAktif = async (req, res, next) => {
  try {
    // Cari data setting_global_semester_aktif berdasarkan ID di database
    const setting_global_semester_aktif = await SettingGlobalSemester.findOne({
      where: {
        status: true
      },
      include: [
        { model: Semester, as: "SemesterAktif" },
        { model: Semester, as: "SemesterNilai" },
        { model: Semester, as: "SemesterKrs" }
      ]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!setting_global_semester_aktif) {
      return res.status(404).json({
        message: `<===== Setting Global Semester Aktif Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Setting Global Semester Aktif Success:`,
      data: setting_global_semester_aktif
    });
  } catch (error) {
    next(error);
  }
};

const createSettingGlobalSemester = async (req, res, next) => {
  const {
    batas_sks_krs,
    wilayah_penandatanganan,
    label_dosen_wali,
    status,
    id_semester_aktif,
    id_semester_nilai,
    id_semester_krs
  } = req.body;

  if (!batas_sks_krs) {
    return res.status(400).json({ message: "batas_sks_krs is required" });
  }
  if (!wilayah_penandatanganan) {
    return res.status(400).json({ message: "wilayah_penandatanganan is required" });
  }
  if (!label_dosen_wali) {
    return res.status(400).json({ message: "label_dosen_wali is required" });
  }
  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }
  if (!id_semester_aktif) {
    return res.status(400).json({ message: "id_semester_aktif is required" });
  }
  if (!id_semester_nilai) {
    return res.status(400).json({ message: "id_semester_nilai is required" });
  }
  if (!id_semester_krs) {
    return res.status(400).json({ message: "id_semester_krs is required" });
  }

  try {
    // Gunakan metode create untuk membuat data setting global semester baru
    const newSettinGlobalSemester = await SettingGlobalSemester.create({
      batas_sks_krs,
      wilayah_penandatanganan,
      label_dosen_wali,
      status,
      id_semester_aktif,
      id_semester_nilai,
      id_semester_krs
    });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Setting Global Semester Success",
      data: newSettinGlobalSemester
    });
  } catch (error) {
    next(error);
  }
};

const updateSettingGlobalSemester = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const {
    batas_sks_krs,
    wilayah_penandatanganan,
    label_dosen_wali,
    id_semester_aktif,
    id_semester_nilai,
    id_semester_krs
  } = req.body;

  if (!batas_sks_krs) {
    return res.status(400).json({ message: "batas_sks_krs is required" });
  }
  if (!wilayah_penandatanganan) {
    return res.status(400).json({ message: "wilayah_penandatanganan is required" });
  }
  if (!label_dosen_wali) {
    return res.status(400).json({ message: "label_dosen_wali is required" });
  }
  if (!id_semester_aktif) {
    return res.status(400).json({ message: "id_semester_aktif is required" });
  }
  if (!id_semester_nilai) {
    return res.status(400).json({ message: "id_semester_nilai is required" });
  }
  if (!id_semester_krs) {
    return res.status(400).json({ message: "id_semester_krs is required" });
  }

  try {
    // get data setting global semester, dengan status bernilai true
    const setting_global_semester = await SettingGlobalSemester.findOne({
      where: {
        status: true
      }
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!setting_global_semester) {
      return res.status(404).json({
        message: `<===== Setting Global Semester Not Found:`
      });
    }

    // Update data setting_global_semester
    setting_global_semester.batas_sks_krs = batas_sks_krs;
    setting_global_semester.wilayah_penandatanganan = wilayah_penandatanganan;
    setting_global_semester.label_dosen_wali = label_dosen_wali;
    setting_global_semester.id_semester_aktif = id_semester_aktif;
    setting_global_semester.id_semester_nilai = id_semester_nilai;
    setting_global_semester.id_semester_krs = id_semester_krs;

    // Simpan perubahan ke dalam database
    await setting_global_semester.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Setting Global Semester Success:`,
      data: setting_global_semester
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSettingGlobalSemester,
  getSettingGlobalSemesterById,
  getSettingGlobalSemesterAktif,
  createSettingGlobalSemester,
  updateSettingGlobalSemester
};
