const { ProfilPT } = require("../../models");

const getAllProfilPT = async (req, res) => {
  try {
    // Ambil semua data profil_pt dari database
    const profil_pt = await ProfilPT.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Profil PT Success",
      jumlahData: profil_pt.length,
      data: profil_pt,
    });
  } catch (error) {
    next(error);
  }
};

const getProfilPTById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const profilPTId = req.params.id;

    // Cari data profil_pt berdasarkan ID di database
    const profil_pt = await ProfilPT.findByPk(profilPTId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!profil_pt) {
      return res.status(404).json({
        message: `<===== Profil PT With ID ${profilPTId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Profil PT By ID ${profilPTId} Success:`,
      data: profil_pt,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProfilPT,
  getProfilPTById,
};
