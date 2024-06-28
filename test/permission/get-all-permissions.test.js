const { getAllPermissions } = require("../../src/controllers/role-permission");
const { Permission } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  Permission: {
    findAll: jest.fn(),
  },
}));

describe("getAllPermissions", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kasus uji 1 - Berhasil mengambil semua permissions
  it("should return 200 and all permissions", async () => {
    const mockPermissions = [
      { id: 1, nama_permission: "dashboard" },
      { id: 2, nama_permission: "importMahasiswa" },
    ];

    Permission.findAll.mockResolvedValue(mockPermissions);

    await getAllPermissions(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Permission Success",
      jumlahData: mockPermissions.length,
      data: mockPermissions,
    });
    expect(Permission.findAll).toHaveBeenCalledTimes(1);
  });

  // Kasus uji 2 - Penanganan error
  it("should handle errors", async () => {
    const errorMessage = "Database error";
    Permission.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllPermissions(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
