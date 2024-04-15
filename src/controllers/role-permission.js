// role
const getAllRoles = (req, res) => {
  const roles = {
    id: "1",
    nama: "Admin Prodi",
  };

  res.json({
    message: "Berhasil mengakses get all roles",
    data: roles,
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
  console.log(req.body);

  res.json({
    message: "Berhasil mengakses create role",
    data: req.body,
  });
};

const updateRoleById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const roleId = req.params.id;

  const { id } = req.params;
  console.log("id_role: ", id);

  res.json({
    message: "Berhasil mengakses update role by id",
    roleId: roleId,
    data: req.body,
  });
};

const deleteRoleById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const roleId = req.params.id;

  const { id } = req.params;
  console.log("id_role: ", id);

  res.json({
    message: "Berhasil mengakses delete role by id",
    roleId: roleId,
    data: { id: 1, nama_role: "Admin Prodi" },
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
