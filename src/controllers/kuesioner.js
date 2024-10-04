const { Kuesioner, SettingGlobalSemester, SettingGlobal, Mahasiswa, KelasKuliah, Semester, MataKuliah, Dosen, Prodi, JenjangPendidikan, AspekPenilaianDosen, SkalaPenilaianDosen } = require("../../models");

const getAllKuesioner = async (req, res, next) => {
  try {
    // Ambil semua data kuesioners dari database
    const kuesioners = await Kuesioner.findAll({
      include: [{ model: AspekPenilaianDosen }, { model: SkalaPenilaianDosen }, { model: KelasKuliah }, { model: Mahasiswa }]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Kuesioner Success",
      jumlahData: kuesioners.length,
      data: kuesioners
    });
  } catch (error) {
    next(error);
  }
};

const getKuesionerById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const kuesionerId = req.params.id;

    if (!kuesionerId) {
      return res.status(400).json({
        message: "Kuesioner ID is required"
      });
    }

    // Cari data kuesioner berdasarkan ID di database
    const kuesioner = await Kuesioner.findByPk(kuesionerId, {
      include: [{ model: AspekPenilaianDosen }, { model: SkalaPenilaianDosen }, { model: KelasKuliah }, { model: Mahasiswa }]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!kuesioner) {
      return res.status(404).json({
        message: `<===== Kuesioner With ID ${kuesionerId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Kuesioner By ID ${kuesionerId} Success:`,
      data: kuesioner
    });
  } catch (error) {
    next(error);
  }
};

const getKuesionerByKelasKuliahIdAndSemesterMahasiswaActive = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    if (!kelasKuliahId) {
      return res.status(400).json({
        message: "Kelas Kuliah ID is required"
      });
    }

    // get data kelas kuliah
    const kelas_kuliah = await KelasKuliah.findByPk(kelasKuliahId, {
      include: [{ model: Semester }, { model: Dosen }, { model: MataKuliah }]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!kelas_kuliah) {
      return res.status(404).json({
        message: `Kelas Kuliah With ID ${kelasKuliahId} Not Found:`
      });
    }

    // get data setting global semester
    const setting_global_semester = await SettingGlobalSemester.findOne({
      where: {
        status: true
      },
      include: [{ model: Semester, as: "SemesterAktif" }]
    });

    if (!setting_global_semester) {
      return res.status(404).json({
        message: "Setting Global Semester Aktif not found"
      });
    }

    // get data user active
    const user = req.user;

    // get data mahasiswa
    const mahasiswa = await Mahasiswa.findOne({
      where: {
        nim: user.username
      },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }]
    });

    if (!mahasiswa) {
      return res.status(404).json({
        message: "Mahasiswa not found"
      });
    }

    // get data setting global berdasarkan prodi
    const setting_global_prodi_active = await SettingGlobal.findOne({
      where: {
        id_prodi: mahasiswa.id_prodi
      }
    });

    if (!setting_global_prodi_active) {
      return res.status(404).json({
        message: `Setting Global With Prodi ID ${mahasiswa.id_prodi} not found`
      });
    }

    // cek apakah fitur kuesioner pada prodi (setting global semester aktif, jika tidak maka dibatalkan)
    if (setting_global_prodi_active.open_questionnaire === true) {
      return res.status(404).json({
        message: "Fitur Kusioner pada Prodi tidak dizinkan"
      });
    }

    // Cari data kuesioner berdasarkan ID di database
    const all_aspek_penilaian_dosen = await AspekPenilaianDosen.findAll({
      where: {
        id_semester: setting_global_semester.SemesterAktif.id_semester
      }
    });

    // get data skala penilaian dosen
    const all_skala_penilaian_dosen = await SkalaPenilaianDosen.findAll({
      where: {
        id_semester: setting_global_semester.SemesterAktif.id_semester
      }
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Pertanyaan Kuesioner By Kelas Kuliah ID ${kelasKuliahId} Success:`,
      dataMahasiswa: mahasiswa,
      dataKelasKuliah: kelas_kuliah,
      dataAspekPenilaian: all_aspek_penilaian_dosen,
      dataSkalaPenilaian: all_skala_penilaian_dosen
    });
  } catch (error) {
    next(error);
  }
};

const createKuesionerByMahasiswaActive = async (req, res, next) => {
  const { kuesioner_answers } = req.body;

  if (!Array.isArray(kuesioner_answers) || kuesioner_answers.length === 0) {
    return res.status(400).json({ message: "kuesioner_answers is required and should be a non-empty array" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    if (!kelasKuliahId) {
      return res.status(400).json({
        message: "Kelas Kuliah ID is required"
      });
    }

    // get data user active
    const user = req.user;

    const mahasiswa = await Mahasiswa.findOne({
      where: {
        nim: user.username
      },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }]
    });

    if (!mahasiswa) {
      return res.status(404).json({
        message: "Mahasiswa not found"
      });
    }

    // get data setting global berdasarkan prodi
    const setting_global_prodi_active = await SettingGlobal.findOne({
      where: {
        id_prodi: mahasiswa.id_prodi
      }
    });

    if (!setting_global_prodi_active) {
      return res.status(404).json({
        message: `Setting Global With Prodi ID ${mahasiswa.id_prodi} not found`
      });
    }

    // cek apakah fitur kuesioner pada prodi (setting global semester aktif, jika tidak maka dibatalkan)
    if (setting_global_prodi_active.open_questionnaire === true) {
      return res.status(404).json({
        message: "Fitur Kusioner pada Prodi tidak dizinkan"
      });
    }

    // Looping untuk create data kuesioner
    const kuesioners = await Promise.all(
      kuesioner_answers.map(async (answer) => {
        return await Kuesioner.create({
          id_kelas_kuliah: kelasKuliahId,
          id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
          id_aspek_penilaian_dosen: answer.id_aspek_penilaian_dosen,
          id_skala_penilaian_dosen: answer.id_skala_penilaian_dosen
        });
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Kuesioner By Mahasiswa Active Success",
      data: kuesioners
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKuesioner,
  getKuesionerById,
  getKuesionerByKelasKuliahIdAndSemesterMahasiswaActive,
  createKuesionerByMahasiswaActive
};
