const httpMocks = require("node-mocks-http");
const { createRole } = require("../../src/controllers/role");
const { Role } = require("../../models");

jest.mock("../../models");

describe("createRole", () => {
  // mendefinisikan parameter fungsi
  let req, res, next;

  // membuat fungsi yang dipalsukan
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kasus uji 1 - ketika nama_role tidak disediakan
  it("should return 400 if nama_role is missing", async () => {
    req.body = {}; // Tidak menyediakan nama_role
    await createRole(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "nama_role is required" });
  });

  // Kasus uji 2 - ketika nama_role bukan string
  it("should return 400 if nama_role is not a string", async () => {
    req.body = { nama_role: 123 }; // Menggunakan nilai non-string
    await createRole(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "nama_role must be a string" });
  });

  // Kasus uji 3 - ketika pembuatan role berhasil
  it("should create a new role and return 201", async () => {
    const mockRole = { id: 1, nama_role: "Admin" };
    Role.create.mockResolvedValue(mockRole);
    req.body = { nama_role: "Admin" };

    await createRole(req, res, next);

    expect(Role.create).toHaveBeenCalledWith({ nama_role: "Admin" });
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Role Success",
      data: mockRole,
    });
  });

  // Kasus uji 4 - menangani error selama pembuatan role
  it("should handle errors during role creation", async () => {
    const errorMessage = "Test error";
    Role.create.mockRejectedValue(new Error(errorMessage));
    req.body = { nama_role: "Admin" };

    await createRole(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
