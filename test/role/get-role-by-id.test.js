const httpMocks = require("node-mocks-http");
const { getRoleById } = require("../../src/modules/role/controller");
const { Role } = require("../../models");

jest.mock("../../models");

describe("getRoleById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan role berdasarkan ID
  it("should return role by ID with status 200 if found", async () => {
    const roleId = 1;
    const mockRole = { id: roleId, name: "Role 1" };

    req.params.id = roleId;
    Role.findByPk.mockResolvedValue(mockRole);

    await getRoleById(req, res, next);

    expect(Role.findByPk).toHaveBeenCalledWith(roleId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Role By ID ${roleId} Success:`,
      data: mockRole,
    });
  });

  // Kode uji 2 - role tidak ditemukan (ID tidak valid)
  it("should return 404 if role ID is not found", async () => {
    const roleId = 999; // ID yang tidak ada dalam mock data
    req.params.id = roleId;
    Role.findByPk.mockResolvedValue(null);

    await getRoleById(req, res, next);

    expect(Role.findByPk).toHaveBeenCalledWith(roleId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Role With ID ${roleId} Not Found:`,
    });
  });

  // Kode uji 3 - menangani kesalahan saat mencari role
  it("should handle errors", async () => {
    const roleId = 1;
    const errorMessage = "Database error";

    req.params.id = roleId;
    Role.findByPk.mockRejectedValue(new Error(errorMessage));

    await getRoleById(req, res, next);

    expect(Role.findByPk).toHaveBeenCalledWith(roleId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });

  // Kode uji 4 - tidak ada ID yang diberikan
  it("should return 400 if role ID is not provided", async () => {
    req.params.id = null;

    await getRoleById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Role ID is required",
    });
  });
});
