const { UserGuidePMB } = require("../../../models");

const getUserGuidePMBGuestAktif = async (req, res, next) => {
  try {
    // Ambil data user_guide_pmb_aktif dari database
    const user_guide_pmb_aktif = await UserGuidePMB.findOne({
      where: {
        status: true,
      },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!user_guide_pmb_aktif) {
      return res.status(404).json({
        message: `<===== User Guide PMB Aktif Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET User Guide PMB Aktif Success",
      jumlahData: user_guide_pmb_aktif.length,
      data: user_guide_pmb_aktif,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserGuidePMBGuestAktif,
};
