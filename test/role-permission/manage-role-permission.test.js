const httpMocks = require("node-mocks-http");
const { manageRolePermission } = require("../../src/controllers/role-permission");
const { Role, RolePermission } = require("../../models");

jest.mock("../../models");

describe("manageRolePermission", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mengelola permissions role
  it("should manage role permissions and return status 201 if successful", async () => {
    const roleId = 1; // ID role yang valid
    const permissions = [{ id: 101 }, { id: 102 }];
    const mockRole = { id: roleId };

    req.params.id_role = roleId;
    req.body.permissions = permissions;
    Role.findByPk.mockResolvedValue(mockRole);

    await manageRolePermission(req, res, next);

    expect(Role.findByPk).toHaveBeenCalledWith(roleId);
    expect(RolePermission.destroy).toHaveBeenCalledWith({
      where: { id_role: roleId },
    });
    expect(RolePermission.create).toHaveBeenCalledTimes(permissions.length);
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: `<===== Manage Role Permission Success:`,
      data: { role_id: roleId, permissions },
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - role tidak ditemukan
  it("should return 404 if role ID is not found", async () => {
    const roleId = 999; // ID role yang tidak ada dalam mock data
    req.params.id_role = roleId;
    Role.findByPk.mockResolvedValue(null);

    await manageRolePermission(req, res, next);

    expect(Role.findByPk).toHaveBeenCalledWith(roleId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `Role with ID ${roleId} Not Found`,
    });
  });

  // Kode uji 3 - ID role tidak diberikan
  it("should return 400 if role ID is not provided", async () => {
    req.params.id_role = null;

    await manageRolePermission(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Role ID is required",
    });
  });

  // Kode uji 4 - menangani kesalahan saat mengelola permissions role
  it("should handle errors when managing role permissions", async () => {
    const roleId = 1;
    const errorMessage = "Database error";
    const permissions = [{ id: 101 }, { id: 102 }];

    req.params.id_role = roleId;
    req.body.permissions = permissions;
    Role.findByPk.mockResolvedValue({ id: roleId });
    RolePermission.create.mockRejectedValue(new Error(errorMessage));

    await manageRolePermission(req, res, next);

    expect(Role.findByPk).toHaveBeenCalledWith(roleId);
    expect(RolePermission.destroy).toHaveBeenCalledWith({
      where: { id_role: roleId },
    });
  });
});
