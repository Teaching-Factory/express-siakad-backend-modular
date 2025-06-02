const httpMocks = require("node-mocks-http");
const { listPermissionsFromRole } = require("../../src/modules/role-permission/controller");
const { RolePermission, Role, Permission } = require("../../models");

jest.mock("../../models");

describe("listPermissionsFromRole", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan permissions berdasarkan role ID
  it("should return permissions by role ID with status 200 if found", async () => {
    const roleId = 1;
    const mockRolePermissions = [
      { id: 1, id_role: roleId, Role: { id: roleId, nama_role: "Role 1" }, Permission: { id: 1, nama_permission: "Permission 1" } },
      { id: 2, id_role: roleId, Role: { id: roleId, nama_role: "Role 1" }, Permission: { id: 2, nama_permission: "Permission 2" } },
    ];

    req.params.id_role = roleId;
    RolePermission.findAll.mockResolvedValue(mockRolePermissions);

    await listPermissionsFromRole(req, res, next);

    expect(RolePermission.findAll).toHaveBeenCalledWith({
      where: { id_role: roleId },
      include: [{ model: Role }, { model: Permission }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Permissions from Role Success",
      jumlahData: mockRolePermissions.length,
      data: mockRolePermissions,
    });
  });

  // Kode uji 2 - role ID tidak ditemukan (permissions kosong)
  it("should return 200 with empty data if no permissions found for role ID", async () => {
    const roleId = 1;
    req.params.id_role = roleId;
    RolePermission.findAll.mockResolvedValue([]);

    await listPermissionsFromRole(req, res, next);

    expect(RolePermission.findAll).toHaveBeenCalledWith({
      where: { id_role: roleId },
      include: [{ model: Role }, { model: Permission }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Permissions from Role Success",
      jumlahData: 0,
      data: [],
    });
  });

  // Kode uji 3 - menangani kesalahan saat mencari permissions
  it("should handle errors", async () => {
    const roleId = 1;
    const errorMessage = "Database error";

    req.params.id_role = roleId;
    RolePermission.findAll.mockRejectedValue(new Error(errorMessage));

    await listPermissionsFromRole(req, res, next);

    expect(RolePermission.findAll).toHaveBeenCalledWith({
      where: { id_role: roleId },
      include: [{ model: Role }, { model: Permission }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });

  // Kode uji 4 - tidak ada ID yang diberikan
  it("should return 400 if role ID is not provided", async () => {
    req.params.id_role = null;

    await listPermissionsFromRole(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Role ID is required",
    });
  });
});
