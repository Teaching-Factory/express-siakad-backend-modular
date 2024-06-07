const { updateUserById } = require("../../src/controllers/user");
const { User, Role } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  User: {
    findByPk: jest.fn(),
  },
  Role: {
    findByPk: jest.fn(),
  },
}));

describe("updateUserById", () => {
  // memastikan bahwa fungsi updateUserById berhasil memperbarui pengguna dengan ID yang sesuai
  it("should update user by ID successfully", async () => {
    const mockUser = { id: 1, nama: "User 1", username: "user1" };
    const userId = 1;
    const req = {
      params: { id: userId },
      body: { nama: "Updated User", username: "updated_user" },
    };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    User.findByPk.mockResolvedValue(mockUser);
    mockUser.save = jest.fn().mockResolvedValue(mockUser);

    await updateUserById(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "UPDATE User Success",
      dataUser: {
        id: mockUser.id,
        nama: req.body.nama, // Menggunakan req.body.nama
        username: req.body.username, // Menggunakan req.body.username
      },
    });
  });

  // memastikan bahwa jika pengguna tidak ditemukan, fungsi akan mengembalikan status 404
  it("should return 404 if user not found", async () => {
    const userId = 1;
    const req = { params: { id: userId }, body: {} }; // Memastikan req.body tidak kosong
    const res = httpMocks.createResponse();
    const next = jest.fn();

    User.findByPk.mockResolvedValue(null);

    await updateUserById(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== User Not Found:",
    });
  });

  // memastikan bahwa jika peran (role) yang ditentukan tidak ditemukan, fungsi akan mengembalikan status 404
  it("should return 404 if role not found", async () => {
    // Mock data request
    const req = {
      params: { id: 1 },
      body: { id_role: 100 }, // ID peran yang tidak ditemukan
    };

    // Mock respons
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock user yang ditemukan
    const mockUser = {
      id: 1,
      nama: "User 1",
      username: "user1",
      id_role: 1,
      save: jest.fn().mockResolvedValue(true),
      update: jest.fn().mockResolvedValue(true),
    };

    User.findByPk.mockResolvedValue(mockUser);

    // Mock role yang tidak ditemukan
    Role.findByPk.mockResolvedValue(null);

    // Menjalankan fungsi untuk mengupdate user
    await updateUserById(req, res, next);

    // Memastikan bahwa fungsi mengembalikan status 404
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Role Not Found:",
    });
  });

  // memastikan bahwa fungsi menangani kesalahan dengan benar jika terjadi kesalahan saat mencari pengguna di database
  it("should handle errors when user search fails", async () => {
    // Persiapan mock request, response, dan next function
    const userId = 1;
    const req = { params: { id: userId }, body: {} }; // Memastikan req.body ada
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Persiapan error yang akan dilemparkan ketika mencari pengguna di database
    const mockError = new Error("Test error");

    // Mock untuk User.findByPk yang akan melemparkan error
    User.findByPk.mockRejectedValue(mockError);

    // Menjalankan fungsi untuk mengupdate user
    await updateUserById(req, res, next);

    // Memastikan bahwa fungsi next dipanggil dengan error yang sesuai
    expect(next).toHaveBeenCalledWith(mockError);
  });
});
