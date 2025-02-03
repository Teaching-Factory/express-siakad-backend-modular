const { ProfilPenilaian } = require("../../models");

const getAllProfilPenilaian = async (req, res, next) => {
  try {
    // Ambil semua data profil_penilaians dari database
    const profil_penilaians = await ProfilPenilaian.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Profil Penilaian Success",
      jumlahData: profil_penilaians.length,
      data: profil_penilaians,
    });
  } catch (error) {
    next(error);
  }
};

const getProfilPenilaianById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const profilPenilaianId = req.params.id;

    if (!profilPenilaianId) {
      return res.status(400).json({
        message: "Profil Penilaian ID is required",
      });
    }

    // Cari data profil_penilaian berdasarkan ID di database
    const profil_penilaian = await ProfilPenilaian.findByPk(profilPenilaianId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!profil_penilaian) {
      return res.status(404).json({
        message: `<===== Profil Penilaian With ID ${profilPenilaianId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Profil Penilaian By ID ${profilPenilaianId} Success:`,
      data: profil_penilaian,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfilPenilaianById = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { nilai_min, nilai_max, nilai_indeks, nilai_huruf } = req.body;

  // Validasi input
  if (nilai_min === null || nilai_min === undefined) {
    return res.status(400).json({ message: "nilai_min is required" });
  }
  if (nilai_max === null || nilai_max === undefined) {
    return res.status(400).json({ message: "nilai_max is required" });
  }
  if (nilai_indeks === null || nilai_indeks === undefined) {
    return res.status(400).json({ message: "nilai_indeks is required" });
  }
  if (nilai_huruf === null || nilai_huruf === undefined) {
    return res.status(400).json({ message: "nilai_huruf is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const profilPenilaianId = req.params.id;

    if (!profilPenilaianId) {
      return res.status(400).json({
        message: "Profil Penilaian ID is required",
      });
    }

    // Cari data profil_penilaian berdasarkan ID di database
    let profil_penilaian = await ProfilPenilaian.findByPk(profilPenilaianId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!profil_penilaian) {
      return res.status(404).json({
        message: `<===== Profil Penilaian With ID ${profilPenilaianId} Not Found:`,
      });
    }

    // Update data profil_penilaian
    profil_penilaian.nilai_min = nilai_min;
    profil_penilaian.nilai_max = nilai_max;
    profil_penilaian.nilai_indeks = nilai_indeks;
    profil_penilaian.nilai_huruf = nilai_huruf;

    // Simpan perubahan ke dalam database
    await profil_penilaian.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Profil Penilaian With ID ${profilPenilaianId} Success:`,
      data: profil_penilaian,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProfilPenilaian,
  getProfilPenilaianById,
  updateProfilPenilaianById,
};
