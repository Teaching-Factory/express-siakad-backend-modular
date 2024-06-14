const httpMocks = require("node-mocks-http");
const { getAllRoles } = require("../../src/controllers/role");
const { Role } = require("../../models");

jest.mock("../../models");

describe("getAllRoles", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan semua roles
  it("should return all roles with status 200 if found", async () => {
    const mockRoles = [
      { id: 1, name: "Role 1" },
      { id: 2, name: "Role 2" },
    ];

    Role.findAll.mockResolvedValue(mockRoles);

    await getAllRoles(req, res, next);

    expect(Role.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Role Success",
      jumlahData: mockRoles.length,
      data: mockRoles,
    });
  });

  // Kode uji 2 - menangani kesalahan saat mengambil data roles
  it("should handle errors", async () => {
    const errorMessage = "Database error";

    Role.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllRoles(req, res, next);

    expect(Role.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
