const { ProfilPT, PerguruanTinggi } = require("../../models");

const getProfilPTActive = async (req, res, next) => {
  try {
    console.log("fungsi diakses");
    // Ambil data profil pt dengan id 1
    const profil_pt = await ProfilPT.findOne({
      where: {
        id_profil_pt: 1,
      },
      include: [{ model: PerguruanTinggi }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET Profil PT Active Success",
      data: profil_pt,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfilPTActive,
};
