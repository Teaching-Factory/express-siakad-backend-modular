const { Camaba, Prodi, ProdiCamaba, JenjangPendidikan, Role, UserRole } = require("../../models");

const getAllProdiCamaba = async (req, res, next) => {
  try {
    // Ambil semua data prodi_camabas dari database
    const prodi_camabas = await ProdiCamaba.findAll({
      include: [{ model: Camaba }, { model: Prodi, include: [{ model: JenjangPendidikan }] }]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Prodi Camaba Success",
      jumlahData: prodi_camabas.length,
      data: prodi_camabas
    });
  } catch (error) {
    next(error);
  }
};

const getProdiCamabaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiCamabaId = req.params.id;

    if (!prodiCamabaId) {
      return res.status(400).json({
        message: "Prodi Camaba ID is required"
      });
    }

    // get data Prodi Camaba
    const prodiCamaba = await ProdiCamaba.findByPk(prodiCamabaId, {
      include: [{ model: Camaba }, { model: Prodi, include: [{ model: JenjangPendidikan }] }]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!prodiCamaba) {
      return res.status(404).json({
        message: `<===== Prodi Camaba With ID ${prodiCamabaId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Prodi Camaba By ID ${prodiCamabaId} Success:`,
      data: prodiCamaba
    });
  } catch (error) {
    next(error);
  }
};

const getAllProdiCamabaActive = async (req, res, next) => {
  try {
    const user = req.user;

    // get role user active
    const roleCamaba = await Role.findOne({
      where: { nama_role: "camaba" }
    });

    if (!roleCamaba) {
      return res.status(404).json({
        message: "Role Camaba not found"
      });
    }

    // mengecek apakah user saat ini memiliki role camaba
    const userRole = await UserRole.findOne({
      where: { id_user: user.id, id_role: roleCamaba.id }
    });

    if (!userRole) {
      return res.status(404).json({
        message: "User is not Camaba"
      });
    }

    const camaba = await Camaba.findOne({
      where: {
        nomor_daftar: user.username
      }
    });

    if (!camaba) {
      return res.status(404).json({
        message: "Camaba not found"
      });
    }

    // get all prodi periode by camaba
    const prodiPeriodePendaftaran = await ProdiCamaba.findAll({
      where: {
        id_camaba: camaba.id
      },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Prodi Periode Pendaftaran By Camaba Active Success",
      jumlahData: prodiPeriodePendaftaran.length,
      data: prodiPeriodePendaftaran
    });
  } catch (error) {
    next(error);
  }
};

const updateProdiCamabaActive = async (req, res, next) => {
  const { prodi = [] } = req.body;

  try {
    // validasi array prodi camaba (wajib)
    if (prodi.length === 0) {
      return res.status(400).json({ message: "Prodi is required" });
    }

    const user = req.user;

    // get role user active
    const roleCamaba = await Role.findOne({
      where: { nama_role: "camaba" }
    });

    if (!roleCamaba) {
      return res.status(404).json({
        message: "Role Camaba not found"
      });
    }

    // mengecek apakah user saat ini memiliki role camaba
    const userRole = await UserRole.findOne({
      where: { id_user: user.id, id_role: roleCamaba.id }
    });

    if (!userRole) {
      return res.status(403).json({
        message: "User is not Camaba"
      });
    }

    const camaba = await Camaba.findOne({
      where: { nomor_daftar: user.username }
    });

    if (!camaba) {
      return res.status(404).json({
        message: "Camaba not found"
      });
    }

    // Loop melalui array prodi untuk melakukan update
    const updatedProdiCamaba = await Promise.all(
      prodi.map(async (prodiItem) => {
        try {
          // Dapatkan data ProdiCamaba berdasarkan id_prodi_camaba dan id_camaba
          const prodiCamaba = await ProdiCamaba.findOne({
            where: {
              id: prodiItem.id_prodi_camaba,
              id_camaba: camaba.id
            }
          });

          if (!prodiCamaba) {
            return {
              id_prodi_camaba: prodiItem.id_prodi_camaba,
              status: `Prodi Camaba with ID ${prodiItem.id_prodi_camaba} not found`
            };
          }

          // Update prodi camaba
          prodiCamaba.id_prodi = prodiItem.id_prodi;

          // Simpan perubahan
          await prodiCamaba.save();

          return {
            id_prodi_camaba: prodiItem.id_prodi_camaba,
            id_prodi: prodiItem.id_prodi,
            status: "Updated successfully"
          };
        } catch (error) {
          return {
            id_prodi_camaba: prodiItem.id_prodi_camaba,
            id_prodi: prodiItem.id_prodi,
            status: `Error: ${error.message}`
          };
        }
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== UPDATE All Prodi Camaba Active Success",
      jumlahData: updatedProdiCamaba.length,
      dataProdiCamaba: updatedProdiCamaba
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProdiCamaba,
  getProdiCamabaById,
  getAllProdiCamabaActive,
  updateProdiCamabaActive
};
