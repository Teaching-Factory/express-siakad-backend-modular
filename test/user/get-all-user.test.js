const { getAllUser } = require("../../src/modules/user/controller");
const { User } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  User: {
    findAll: jest.fn(),
  },
}));

describe("getAllUser", () => {
  /* Kode uji 1 - menguji jika pengambilan semua pengguna berhasil,
   maka akan mengembalikan status 200 beserta data pengguna yang diharapkan
   */
  it("should return all users successfully", async () => {
    const mockUsers = [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
    ];
    const req = {};
    const res = httpMocks.createResponse();
    const next = jest.fn();

    User.findAll.mockResolvedValue(mockUsers);

    await getAllUser(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All User Success",
      jumlahData: mockUsers.length,
      data: mockUsers,
    });
  });

  // Kode uji 2 - menguji jika tidak ada pengguna yang ditemukan, maka akan mengembalikan status 404
  it("should return 404 if no users found", async () => {
    const req = {};
    const res = httpMocks.createResponse();
    const next = jest.fn();

    User.findAll.mockResolvedValue([]);

    await getAllUser(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: "<===== User Not Found:" });
  });

  // Kode uji 3 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should handle errors", async () => {
    const req = {};
    const res = httpMocks.createResponse();
    const next = jest.fn();
    const mockError = new Error("Test error");

    User.findAll.mockRejectedValue(mockError);

    await getAllUser(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
