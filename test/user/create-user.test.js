const { createUser } = require("../../src/controllers/user");
const { User, Role, UserRole } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  User: {
    create: jest.fn(),
  },
  Role: {
    findByPk: jest.fn(),
  },
  UserRole: {
    create: jest.fn(),
  },
}));

describe("createUser", () => {
  // memastikan bahwa fungsi createUser berhasil membuat pengguna baru jika data peran ditemukan
  it("should create user successfully", async () => {
    const mockUser = { id: 1, name: "User 1", username: "user1" };
    const mockRole = { id: 1, name: "Admin" };
    const req = {
      body: {
        nama: "User 1",
        username: "user1",
        password: "password",
        hints: "hint",
        email: "user1@example.com",
        status: "active",
        id_role: 1,
      },
    };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    Role.findByPk.mockResolvedValue(mockRole);
    User.create.mockResolvedValue(mockUser);
    UserRole.create.mockResolvedValue({});

    await createUser(req, res, next);

    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== GENERATE User Success",
      user: mockUser,
      role: {},
    });
  });

  // memeriksa apakah fungsi mengembalikan status 404 jika data peran tidak ditemukan
  it("should return 404 if role not found", async () => {
    const req = {
      body: {
        nama: "User 1",
        username: "user1",
        password: "password",
        hints: "hint",
        email: "user1@example.com",
        status: "active",
        id_role: 1,
      },
    };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    Role.findByPk.mockResolvedValue(null);

    await createUser(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Role Not Found:",
    });
  });

  // memastikan bahwa fungsi menangani kesalahan dengan benar jika terjadi kesalahan saat mencari data peran
  it("should handle errors", async () => {
    const req = {
      body: {
        nama: "User 1",
        username: "user1",
        password: "password",
        hints: "hint",
        email: "user1@example.com",
        status: "active",
        id_role: 1,
      },
    };
    const res = httpMocks.createResponse();
    const next = jest.fn();
    const mockError = new Error("Test error");

    Role.findByPk.mockRejectedValue(mockError);

    await createUser(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
