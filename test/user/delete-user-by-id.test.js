const { deleteUserById } = require("../../src/controllers/user");
const { User } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  User: {
    findByPk: jest.fn(),
  },
}));

describe("deleteUserById", () => {
  // memastikan bahwa pengguna dihapus dengan sukses dan respons yang dihasilkan memiliki status 200 dengan pesan yang benar
  it("should delete user by ID successfully", async () => {
    // Mock data request
    const req = {
      params: { id: 1 },
    };

    // Mock respons
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock user yang ditemukan
    const mockUser = {
      id: 1,
      destroy: jest.fn().mockResolvedValue(true),
    };
    User.findByPk.mockResolvedValue(mockUser);

    // Menjalankan fungsi untuk menghapus user
    await deleteUserById(req, res, next);

    // Memastikan bahwa fungsi mengembalikan status 200
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== DELETE User With ID 1 Success:",
    });

    // Memastikan bahwa metode destroy dipanggil pada user
    expect(mockUser.destroy).toHaveBeenCalled();
  });

  // memastikan bahwa ketika pengguna tidak ditemukan, respons memiliki status 404 dengan pesan yang benar
  it("should return 404 if user not found", async () => {
    // Mock data request
    const req = {
      params: { id: 1 },
    };

    // Mock respons
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock user yang tidak ditemukan
    User.findByPk.mockResolvedValue(null);

    // Menjalankan fungsi untuk menghapus user
    await deleteUserById(req, res, next);

    // Memastikan bahwa fungsi mengembalikan status 404
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== User With ID 1 Not Found:",
    });
  });

  // memastikan bahwa kesalahan yang terjadi selama pencarian pengguna ditangani dengan benar dan dipanggil dengan fungsi next
  it("should handle errors", async () => {
    // Mock data request
    const req = {
      params: { id: 1 },
    };

    // Mock respons
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock error yang dilemparkan
    const mockError = new Error("Test error");
    User.findByPk.mockRejectedValue(mockError);

    // Menjalankan fungsi untuk menghapus user
    await deleteUserById(req, res, next);

    // Memastikan bahwa fungsi next dipanggil dengan error yang sesuai
    expect(next).toHaveBeenCalledWith(mockError);
  });
});
