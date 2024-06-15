const { Role } = require("../../models");

const getAllRoles = async (req, res, next) => {
  try {
    // Ambil semua data roles dari database
    const roles = await Role.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Role Success",
      jumlahData: roles.length,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

const getRoleById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const roleId = req.params.id;

    // Periksa apakah ID disediakan
    if (!roleId) {
      return res.status(400).json({
        message: "Role ID is required",
      });
    }

    // Cari data role berdasarkan ID di database
    const role = await Role.findByPk(roleId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!role) {
      return res.status(404).json({
        message: `<===== Role With ID ${roleId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Role By ID ${roleId} Success:`,
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

const createRole = async (req, res, next) => {
  const { nama_role } = req.body;

  // validasi required
  if (!nama_role) {
    return res.status(400).json({ message: "nama_role is required" });
  }
  // valiasi tipe data
  if (typeof nama_role !== "string") {
    return res.status(400).json({ message: "nama_role must be a string" });
  }

  try {
    // Gunakan metode create untuk membuat data role baru
    const newRole = await Role.create({ nama_role });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Role Success",
      data: newRole,
    });
  } catch (error) {
    next(error);
  }
};

const updateRoleById = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { nama_role } = req.body;

  // validasi required
  if (!nama_role) {
    return res.status(400).json({ message: "nama_role is required" });
  }
  // valiasi tipe data
  if (typeof nama_role !== "string") {
    return res.status(400).json({ message: "nama_role must be a string" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const roleId = req.params.id;

    // Cari data role berdasarkan ID di database
    let role = await Role.findByPk(roleId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!role) {
      return res.status(404).json({
        message: `<===== Role With ID ${roleId} Not Found:`,
      });
    }

    // Update data role
    role.nama_role = nama_role;

    // Simpan perubahan ke dalam database
    await role.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Role With ID ${roleId} Success:`,
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRoleById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const roleId = req.params.id;

    // Periksa apakah ID disediakan
    if (!roleId) {
      return res.status(400).json({
        message: "Role ID is required",
      });
    }

    // Cari data role berdasarkan ID di database
    let role = await Role.findByPk(roleId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!role) {
      return res.status(404).json({
        message: `<===== Role With ID ${roleId} Not Found:`,
      });
    }

    // Hapus data role dari database
    await role.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Role With ID ${roleId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRoles,
  createRole,
  getRoleById,
  updateRoleById,
  deleteRoleById,
};
