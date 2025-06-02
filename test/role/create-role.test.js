const httpMocks = require("node-mocks-http");
const { createRole } = require("../../src/modules/role/controller");
const { Role } = require("../../models");

jest.mock("../../models");

describe("createRole", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil membuat role baru
  it("should create a new role with status 201 if nama_role is provided", async () => {
    const mockRole = { id: 1, nama_role: "Role Baru" };

    req.body = { nama_role: "Role Baru" };
    Role.create.mockResolvedValue(mockRole);

    await createRole(req, res, next);

    expect(Role.create).toHaveBeenCalledWith({ nama_role: "Role Baru" });
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Role Success",
      data: mockRole,
    });
  });

  // Kode uji 2 - gagal membuat role baru karena nama_role tidak ada
  it("should return 400 if nama_role is not provided", async () => {
    req.body = {};

    await createRole(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "nama_role is required" });
  });

  // Kode uji 3 - menangani kesalahan saat menciptakan role baru
  it("should handle errors when creating a new role", async () => {
    const errorMessage = "Database error";

    req.body = { nama_role: "Role Baru" };
    Role.create.mockRejectedValue(new Error(errorMessage));

    await createRole(req, res, next);

    expect(Role.create).toHaveBeenCalledWith({ nama_role: "Role Baru" });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
