const { SkalaPenilaianDosen, Semester } = require("../../models");

const getAllSkalaPenilaianDosen = async (req, res, next) => {
  try {
    // Ambil semua data skala_penilaian_dosens dari database
    const skala_penilaian_dosens = await SkalaPenilaianDosen.findAll({
      include: [{ model: Semester }]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Skala Penilaian Dosen Success",
      jumlahData: skala_penilaian_dosens.length,
      data: skala_penilaian_dosens
    });
  } catch (error) {
    next(error);
  }
};

const getAllSkalaPenilaianDosenBySemesterId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required"
      });
    }

    // Ambil semua data skala_penilaian_dosens dari database
    const skala_penilaian_dosens = await SkalaPenilaianDosen.findAll({
      where: {
        id_semester: semesterId
      },
      include: [{ model: Semester }]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Skala Penilaian Dosen By Semester ID ${semesterId} Success`,
      jumlahData: skala_penilaian_dosens.length,
      data: skala_penilaian_dosens
    });
  } catch (error) {
    next(error);
  }
};

const getSkalaPenilaianDosenById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const skalaPenilaianDosenId = req.params.id;

    if (!skalaPenilaianDosenId) {
      return res.status(400).json({
        message: "Skala Penilaian Dosen ID is required"
      });
    }

    // Cari data skala_penilaian_dosen berdasarkan ID di database
    const skala_penilaian_dosen = await SkalaPenilaianDosen.findByPk(skalaPenilaianDosenId, {
      include: [{ model: Semester }]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!skala_penilaian_dosen) {
      return res.status(404).json({
        message: `<===== Skala Penilaian Dosen With ID ${skalaPenilaianDosenId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Skala Penilaian Dosen By ID ${skalaPenilaianDosenId} Success:`,
      data: skala_penilaian_dosen
    });
  } catch (error) {
    next(error);
  }
};

const createSkalaPenilaianDosen = async (req, res, next) => {
  const { poin_skala_penilaian, keterangan_skala_penilaian, id_semester } = req.body;

  // if (!poin_skala_penilaian) {
  //   return res.status(400).json({ message: "poin_skala_penilaian is required" });
  // }
  if (!keterangan_skala_penilaian) {
    return res.status(400).json({ message: "keterangan_skala_penilaian is required" });
  }
  if (!id_semester) {
    return res.status(400).json({ message: "id_semester is required" });
  }

  try {
    // Gunakan metode create untuk membuat data skala penilaian dosen baru
    const newSkalaPenilaianDosen = await SkalaPenilaianDosen.create({
      poin_skala_penilaian: poin_skala_penilaian,
      keterangan_skala_penilaian: keterangan_skala_penilaian,
      id_semester: id_semester
    });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Skala Penilaian Dosen Success",
      data: newSkalaPenilaianDosen
    });
  } catch (error) {
    next(error);
  }
};

const updateSkalaPenilaianDosenById = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { poin_skala_penilaian, keterangan_skala_penilaian, id_semester } = req.body;

  if (!poin_skala_penilaian) {
    return res.status(400).json({ message: "poin_skala_penilaian is required" });
  }
  if (!keterangan_skala_penilaian) {
    return res.status(400).json({ message: "keterangan_skala_penilaian is required" });
  }
  if (!id_semester) {
    return res.status(400).json({ message: "id_semester is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const skalaPenilaianDosenId = req.params.id;

    if (!skalaPenilaianDosenId) {
      return res.status(400).json({
        message: "Skala Penilaian Dosen ID is required"
      });
    }

    // Cari data skala_penilaian_dosen berdasarkan ID di database
    let skala_penilaian_dosen = await SkalaPenilaianDosen.findByPk(skalaPenilaianDosenId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!skala_penilaian_dosen) {
      return res.status(404).json({
        message: `<===== Skala Penilaian Dosen With ID ${skalaPenilaianDosenId} Not Found:`
      });
    }

    // Update data skala_penilaian_dosen
    skala_penilaian_dosen.poin_skala_penilaian = poin_skala_penilaian;
    skala_penilaian_dosen.keterangan_skala_penilaian = keterangan_skala_penilaian;
    skala_penilaian_dosen.id_semester = id_semester;

    // Simpan perubahan ke dalam database
    await skala_penilaian_dosen.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Skala Penilaian Dosen With ID ${skalaPenilaianDosenId} Success:`,
      data: skala_penilaian_dosen
    });
  } catch (error) {
    next(error);
  }
};

const deleteSkalaPenilaianDosenById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const skalaPenilaianDosenId = req.params.id;

    if (!skalaPenilaianDosenId) {
      return res.status(400).json({
        message: "Skala Penilaian Dosen ID is required"
      });
    }

    // Cari data skala_penilaian_dosen berdasarkan ID di database
    let skala_penilaian_dosen = await SkalaPenilaianDosen.findByPk(skalaPenilaianDosenId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!skala_penilaian_dosen) {
      return res.status(404).json({
        message: `<===== Skala Penilaian Dosen With ID ${skalaPenilaianDosenId} Not Found:`
      });
    }

    // Hapus data skala_penilaian_dosen dari database
    await skala_penilaian_dosen.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Skala Penilaian Dosen With ID ${skalaPenilaianDosenId} Success:`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSkalaPenilaianDosen,
  getAllSkalaPenilaianDosenBySemesterId,
  getSkalaPenilaianDosenById,
  createSkalaPenilaianDosen,
  updateSkalaPenilaianDosenById,
  deleteSkalaPenilaianDosenById
};
