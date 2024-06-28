const httpMocks = require("node-mocks-http");
const { listPermissionsFromRole } = require("../../src/controllers/role-permission");
const { Role, RolePermission } = require("../../models");

jest.mock("../../models");

describe("listPermissionsFromRole", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan daftar permissions dari role
  it("should return list of permissions from role with status 200 if successful", async () => {
    const roleId = 1; // ID role yang valid
    const mockRolePermissions = [
      { id: 1, id_role: roleId, id_permission: 101 },
      { id: 2, id_role: roleId, id_permission: 102 },
    ];
    const mockRole = { id: roleId, RolePermissions: mockRolePermissions };

    req.params.id_role = roleId;
    Role.findByPk.mockResolvedValue(mockRole);

    await listPermissionsFromRole(req, res, next);

    expect(Role.findByPk).toHaveBeenCalledWith(roleId, {
      include: { model: RolePermission, as: "RolePermissions" },
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Permissions from Role Success",
      data: mockRolePermissions.map(({ id, id_role, id_permission }) => ({
        id,
        id_role,
        id_permission,
      })),
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - role tidak ditemukan
  it("should return 404 if role ID is not found", async () => {
    const roleId = 999; // ID role yang tidak ada dalam mock data
    req.params.id_role = roleId;
    Role.findByPk.mockResolvedValue(null);

    await listPermissionsFromRole(req, res, next);

    expect(Role.findByPk).toHaveBeenCalledWith(roleId, {
      include: { model: RolePermission, as: "RolePermissions" },
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `Role with ID ${roleId} Not Found`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - ID role tidak diberikan
  it("should return 400 if role ID is not provided", async () => {
    req.params.id_role = null;

    await listPermissionsFromRole(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Role ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 4 - menangani kesalahan saat mencari role permissions
  it("should handle errors when fetching role permissions", async () => {
    const roleId = 1;
    const errorMessage = "Database error";

    req.params.id_role = roleId;
    Role.findByPk.mockRejectedValue(new Error(errorMessage));

    await listPermissionsFromRole(req, res, next);

    expect(Role.findByPk).toHaveBeenCalledWith(roleId, {
      include: { model: RolePermission, as: "RolePermissions" },
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    // Memastikan bahwa respons tidak dikirim jika terjadi kesalahan
    expect(res._isEndCalled()).toBeFalsy();
  });
});
