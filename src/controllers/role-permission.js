// role
const getAllRoles = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all roles",
  });
};

const getRoleById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const roleId = req.params.id;

  // Kirim respons JSON dengan pesan berhasil dan ID
  res.json({
    message: "Berhasil mengakses role berdasarkan ID",
    roleId: roleId,
  });
};

const createRole = (req, res) => {
  res.json({
    message: "Berhasil mengakses create role",
  });
};

const updateRoleById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const roleId = req.params.id;

  res.json({
    message: "Berhasil mengakses update role by id",
    roleId: roleId,
  });
};

const deleteRoleById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const roleId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete role by id",
    roleId: roleId,
  });
};

// permission
const getAllPermissions = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all permissions",
  });
};

const getPermissionById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const permissionId = req.params.id;

  res.json({
    message: "Berhasil mengakses get permission by id",
    permissionId: permissionId,
  });
};

const createPermission = (req, res) => {
  res.json({
    message: "Berhasil mengakses create permission",
  });
};

const updatePermissionById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const permissionId = req.params.id;

  res.json({
    message: "Berhasil mengakses update permission by id",
    permissionId: permissionId,
  });
};

const deletePermissionById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const permissionId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete permission by id",
    permissionId: permissionId,
  });
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
