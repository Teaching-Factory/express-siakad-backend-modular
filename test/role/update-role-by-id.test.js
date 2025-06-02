const httpMocks = require("node-mocks-http");
const { updateRoleById } = require("../../src/modules/role/controller");
const { Role } = require("../../models");

jest.mock("../../models");

describe("updateRoleById", () => {
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
    req.params.id = 1; // Menyediakan ID role
    req.body = {}; // Tidak menyediakan nama_role
    await updateRoleById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "nama_role is required" });
  });

  // Kasus uji 2 - ketika nama_role bukan string
  it("should return 400 if nama_role is not a string", async () => {
    req.params.id = 1; // Menyediakan ID role
    req.body = { nama_role: 123 }; // Menggunakan nilai non-string
    await updateRoleById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "nama_role must be a string" });
  });

  // Kasus uji 3 - ketika role berhasil diperbarui
  it("should update an existing role and return 200", async () => {
    const mockRole = { id: 1, nama_role: "Admin" };
    Role.findByPk.mockResolvedValue(mockRole);
    req.params.id = 1; // Menyediakan ID role
    req.body = { nama_role: "Mahasiswa" };

    // Simulasi Role.save untuk memperbarui role
    mockRole.save = jest.fn().mockResolvedValue({ id: 1, nama_role: "Mahasiswa" });

    await updateRoleById(req, res, next);

    expect(Role.findByPk).toHaveBeenCalledWith(1);
    expect(mockRole.nama_role).toBe("Mahasiswa");

    // Memastikan bahwa res.json dipanggil dengan data yang benar
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== UPDATE Role With ID 1 Success:",
      data: { id: 1, nama_role: "Mahasiswa" },
    });
  });

  // Kasus uji 4 - menangani error selama pembaruan role
  it("should handle errors during role update", async () => {
    const errorMessage = "Test error";
    Role.findByPk.mockRejectedValue(new Error(errorMessage));
    req.params.id = 1; // Menyediakan ID role
    req.body = { nama_role: "New Role Name" };

    await updateRoleById(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });

  // Kasus uji 5 - menangani ketika role tidak ditemukan
  it("should return 404 when role not found", async () => {
    Role.findByPk.mockResolvedValue(null);
    req.params.id = 1; // Menyediakan ID role
    req.body = { nama_role: "New Role Name" };

    await updateRoleById(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Role With ID 1 Not Found:",
    });
  });
});
