const httpMocks = require("node-mocks-http");
const { deleteRoleById } = require("../../src/controllers/role");
const { Role } = require("../../models");

jest.mock("../../models");

describe("deleteRoleById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil menghapus role berdasarkan ID
  it("should delete role by ID with status 200 if found", async () => {
    const roleId = 1;
    const mockRole = { id: roleId, name: "Role 1" };

    req.params.id = roleId;
    Role.findByPk.mockResolvedValue(mockRole);
    mockRole.destroy = jest.fn().mockResolvedValue();

    await deleteRoleById(req, res, next);

    expect(Role.findByPk).toHaveBeenCalledWith(roleId);
    expect(mockRole.destroy).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Role With ID ${roleId} Success:`,
    });
  });

  // Kode uji 2 - role tidak ditemukan (ID tidak valid)
  it("should return 404 if role ID is not found", async () => {
    const roleId = 999; // ID yang tidak ada dalam mock data
    req.params.id = roleId;
    Role.findByPk.mockResolvedValue(null);

    await deleteRoleById(req, res, next);

    expect(Role.findByPk).toHaveBeenCalledWith(roleId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Role With ID ${roleId} Not Found:`,
    });
  });

  // Kode uji 3 - menangani kesalahan saat menghapus role
  it("should handle errors", async () => {
    const roleId = 1;
    const errorMessage = "Database error";
    req.params.id = roleId;

    Role.findByPk.mockResolvedValue({ id: roleId, name: "Role 1" });
    Role.findByPk.mockRejectedValue(new Error(errorMessage));

    await deleteRoleById(req, res, next);

    expect(Role.findByPk).toHaveBeenCalledWith(roleId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });

  // Kode uji 4 - tidak ada ID yang diberikan
  it("should return 400 if role ID is not provided", async () => {
    req.params.id = null;

    await deleteRoleById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Role ID is required",
    });
  });
});
