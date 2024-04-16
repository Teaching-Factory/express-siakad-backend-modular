// Import model Role tanpa kurung kurawal
const { Role } = require("../../models");
const { Permission } = require("../../models");

// role
const getAllRoles = async (req, res, next) => {
  try {
    // Ambil semua data roles dari database
    const roles = await Role.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Role Success",
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
  try {
    const { nama_role } = req.body;
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
  try {
    // Dapatkan ID dari parameter permintaan
    const roleId = req.params.id;

    // Dapatkan data yang akan diupdate dari body permintaan
    const { nama_role } = req.body;

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

// permission
const getAllPermissions = async (req, res, next) => {
  try {
    // Ambil semua data permissions dari database
    const permissions = await Permission.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Permission Success",
      data: permissions,
    });
  } catch (error) {
    next(error);
  }
};

const getPermissionById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const permisssionId = req.params.id;

    // Cari data permission berdasarkan ID di database
    const permission = await Permission.findByPk(permisssionId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!permission) {
      return res.status(404).json({
        message: `<===== Permission With ID ${permisssionId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Permission By ID ${permisssionId} Success:`,
      data: permission,
    });
  } catch (error) {
    next(error);
  }
};

const createPermission = async (req, res, next) => {
  try {
    const { nama_permission } = req.body;

    // Gunakan metode create untuk membuat data permission baru
    const newPermission = await Permission.create({ nama_permission });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Permission Success",
      data: newPermission,
    });
  } catch (error) {
    next(error);
  }
};

const updatePermissionById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const permissionId = req.params.id;

    // Dapatkan data yang akan diupdate dari body permintaan
    const { nama_permission } = req.body;

    // Cari data permission berdasarkan ID di database
    let permission = await Permission.findByPk(permissionId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!permission) {
      return res.status(404).json({
        message: `<===== Permission With ID ${permissionId} Not Found:`,
      });
    }

    // Update data permission
    permission.nama_permission = nama_permission;

    // Simpan perubahan ke dalam database
    await permission.validate();
    await permission.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Permission With ID ${permissionId} Success:`,
      data: permission,
    });
  } catch (error) {
    next(error);
  }
};

const deletePermissionById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const permissionId = req.params.id;

    // Cari data permission berdasarkan ID di database
    let permission = await Permission.findByPk(permissionId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!permission) {
      return res.status(404).json({
        message: `<===== Permission With ID ${permissionId} Not Found:`,
      });
    }

    // Hapus data permission dari database
    await permission.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Permission With ID ${permissionId} Success:`,
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
  getAllPermissions,
  createPermission,
  getPermissionById,
  updatePermissionById,
  deletePermissionById,
};
