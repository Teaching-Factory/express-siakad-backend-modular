const { AdminProdi, User, Prodi, UserRole, Role } = require("../../models");

const getAllAdminProdi = async (req, res, next) => {
  try {
    // Ambil semua data admin_prodis dari database
    const admin_prodis = await AdminProdi.findAll({
      include: [
        { model: User, attributes: ["nama", "email", "hints"] },
        { model: Prodi, attributes: ["nama_program_studi", "kode_program_studi"] },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Admin Prodi Success",
      jumlahData: admin_prodis.length,
      data: admin_prodis,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminProdiById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const adminProdiId = req.params.id;

    if (!adminProdiId) {
      return res.status(400).json({
        message: "Admin Prodi ID is required",
      });
    }

    // Cari data admin_prodi berdasarkan ID di database
    const admin_prodi = await AdminProdi.findByPk(adminProdiId, {
      include: [
        { model: User, attributes: ["nama", "email", "hints"] },
        { model: Prodi, attributes: ["nama_program_studi", "kode_program_studi"] },
      ],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!admin_prodi) {
      return res.status(404).json({
        message: `<===== Admin Prodi With ID ${adminProdiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Admin Prodi By ID ${adminProdiId} Success:`,
      data: admin_prodi,
    });
  } catch (error) {
    next(error);
  }
};

const createAdminProdi = async (req, res, next) => {
  const { id_user, id_prodi } = req.body;

  if (!id_user) {
    return res.status(400).json({ message: "id_user is required" });
  }

  if (!id_prodi) {
    return res.status(400).json({ message: "id_prodi is required" });
  }

  try {
    // get data admin prodi
    const adminProdi = await AdminProdi.findOne({
      where: {
        id_user: id_user,
        id_prodi: id_prodi,
      },
    });

    if (adminProdi) {
      return res.status(400).json({
        message: "Data User Admin Prodi telah dibuat",
      });
    }

    // get data user role
    const userRole = await UserRole.findOne({
      where: {
        id_user: id_user,
      },
      include: [
        {
          model: Role,
          where: {
            nama_role: "admin-prodi",
          },
        },
      ],
    });

    if (!userRole) {
      return res.status(400).json({
        message: "Data User tidak valid, proses penambahan Admin Prodi Gagal",
      });
    }

    // Gunakan metode create untuk membuat data admin prodi baru
    const newAdminProdi = await AdminProdi.create({ id_user, id_prodi });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Admin Prodi Success",
      data: newAdminProdi,
    });
  } catch (error) {
    next(error);
  }
};

const updateAdminProdiById = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { id_user, id_prodi } = req.body;

  if (!id_user) {
    return res.status(400).json({ message: "id_user is required" });
  }

  if (!id_prodi) {
    return res.status(400).json({ message: "id_prodi is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const adminProdiId = req.params.id;

    if (!adminProdiId) {
      return res.status(400).json({
        message: "Admin Prodi ID is required",
      });
    }

    // Cari data admin_prodi berdasarkan ID di database
    let admin_prodi = await AdminProdi.findByPk(adminProdiId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!admin_prodi) {
      return res.status(404).json({
        message: `<===== Admin Prodi With ID ${adminProdiId} Not Found:`,
      });
    }

    // Update data admin_prodi
    admin_prodi.id_user = id_user;
    admin_prodi.id_prodi = id_prodi;

    // Simpan perubahan ke dalam database
    await admin_prodi.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Admin Prodi With ID ${adminProdiId} Success:`,
      data: admin_prodi,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdminProdiById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const adminProdiId = req.params.id;

    if (!adminProdiId) {
      return res.status(400).json({
        message: "Admin Prodi ID is required",
      });
    }

    // Cari data admin_prodi berdasarkan ID di database
    let admin_prodi = await AdminProdi.findByPk(adminProdiId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!admin_prodi) {
      return res.status(404).json({
        message: `<===== Admin Prodi With ID ${adminProdiId} Not Found:`,
      });
    }

    // Hapus data admin_prodi dari database
    await admin_prodi.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Admin Prodi With ID ${adminProdiId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAdminProdi,
  getAdminProdiById,
  createAdminProdi,
  updateAdminProdiById,
  deleteAdminProdiById,
};
