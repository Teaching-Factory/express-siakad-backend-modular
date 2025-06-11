const { TahapTesCamaba, TahapTesPeriodePendaftaran, JenisTes, Role, UserRole, Camaba } = require("../../../models");

const getTahapTesCamabaByCamabaId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const camabaId = req.params.id_camaba;

    if (!camabaId) {
      return res.status(400).json({
        message: "Camaba ID is required",
      });
    }

    // Cari data tahap_tes_camabas berdasarkan ID di database
    const tahap_tes_camabas = await TahapTesCamaba.findAll({
      where: {
        id_camaba: camabaId,
      },
      include: [{ model: TahapTesPeriodePendaftaran, include: [{ model: JenisTes }] }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!tahap_tes_camabas) {
      return res.status(404).json({
        message: `<===== Tahap Tes Camaba With Camaba ID ${camabaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Tahap Tes Camaba By Camaba ID ${camabaId} Success:`,
      data: tahap_tes_camabas,
    });
  } catch (error) {
    next(error);
  }
};

const getTahapTesCamabaActiveByUser = async (req, res, next) => {
  try {
    const user = req.user;

    // get role user active
    const roleCamaba = await Role.findOne({
      where: { nama_role: "camaba" },
    });

    if (!roleCamaba) {
      return res.status(404).json({
        message: "Role Camaba not found",
      });
    }

    // mengecek apakah user saat ini memiliki role camaba
    const userRole = await UserRole.findOne({
      where: { id_user: user.id, id_role: roleCamaba.id },
    });

    if (!userRole) {
      return res.status(404).json({
        message: "User is not Camaba",
      });
    }

    const camaba = await Camaba.findOne({
      where: {
        nomor_daftar: user.username,
      },
    });

    if (!camaba) {
      return res.status(404).json({
        message: "Camaba not found",
      });
    }

    // get data Tahap Tes Camaba
    const tahapTesCamaba = await TahapTesCamaba.findAll({
      where: {
        id_camaba: camaba.id,
      },
      include: [{ model: TahapTesPeriodePendaftaran, include: [{ model: JenisTes }] }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!tahapTesCamaba) {
      return res.status(404).json({
        message: `<===== Tahap Tes Camaba Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Tahap Tes Camaba By Camaba Active Success:`,
      tahapTesCamaba: tahapTesCamaba,
    });
  } catch (error) {
    next(error);
  }
};

const updateTahapTesCamaba = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const camabaId = req.params.id_camaba;

    if (!camabaId) {
      return res.status(400).json({
        message: "Camaba ID is required",
      });
    }

    // Ambil data tahap_tes_camabas dari request body
    const { tahap_tes_camabas } = req.body;

    if (!tahap_tes_camabas || !Array.isArray(tahap_tes_camabas) || tahap_tes_camabas.length === 0) {
      return res.status(400).json({
        message: "Tahap Tes Camabas data is required and must be a non-empty array",
      });
    }

    for (const tahap_tes of tahap_tes_camabas) {
      const { id, status } = tahap_tes;

      // Ambil data tahap tes camaba berdasarkan id
      let data_tahap_tes_camaba = await TahapTesCamaba.findOne({
        where: { id, id_camaba: camabaId },
      });

      // Jika data tidak ditemukan, kirim respons 404
      if (!data_tahap_tes_camaba) {
        return res.status(404).json({
          message: `<===== Tahap Tes Camaba With Camaba ID ${camabaId} Not Found:`,
        });
      }

      // proses update data tahap tes camaba
      data_tahap_tes_camaba.status = status;

      // Simpan perubahan ke dalam database
      await data_tahap_tes_camaba.save();
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Tahap Tes Camaba by Camaba ID ${camabaId} Success`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTahapTesCamabaByCamabaId,
  getTahapTesCamabaActiveByUser,
  updateTahapTesCamaba,
};
