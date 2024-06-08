const { updateUserById } = require("../../src/controllers/user");
const { User, Role } = require("../../models");
const httpMocks = require("node-mocks-http");
const bcrypt = require("bcrypt");
const validator = require("validator");

jest.mock("../../models", () => ({
  User: {
    findByPk: jest.fn(),
  },
  Role: {
    findByPk: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

jest.mock("validator", () => ({
  isEmail: jest.fn(),
}));

describe("updateUserById", () => {
  // validasi required
  it("should return 400 if nama is missing", async () => {
    const req = {
      params: { id: 1 },
      body: {
        username: "user1",
        password: "password",
        email: "user1@example.com",
        status: "active",
        id_role: 1,
      },
    };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await updateUserById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama is required",
    });
  });

  it("should return 400 if username is missing", async () => {
    const req = {
      params: { id: 1 },
      body: {
        nama: "User 1",
        password: "password",
        email: "user1@example.com",
        status: "active",
        id_role: 1,
      },
    };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await updateUserById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "username is required",
    });
  });

  it("should return 400 if password is missing", async () => {
    const req = {
      params: { id: 1 },
      body: {
        nama: "User 1",
        username: "user1",
        email: "user1@example.com",
        status: "active",
        id_role: 1,
      },
    };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await updateUserById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "password is required",
    });
  });

  it("should return 400 if status is missing", async () => {
    const req = {
      params: { id: 1 },
      body: {
        nama: "User 1",
        username: "user1",
        password: "password",
        email: "user1@example.com",
        id_role: 1,
      },
    };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await updateUserById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "status is required",
    });
  });

  it("should return 400 if id_role is missing", async () => {
    const req = {
      params: { id: 1 },
      body: {
        nama: "User 1",
        username: "user1",
        password: "password",
        email: "user1@example.com",
        status: "active",
      },
    };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await updateUserById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_role is required",
    });
  });

  // validasi tipe data
  it("should return 400 if nama is not a string", async () => {
    const req = {
      params: { id: 1 },
      body: {
        nama: 123,
        username: "user1",
        password: "password",
        email: "user1@example.com",
        status: "active",
        id_role: 1,
      },
    };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await updateUserById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama must be a string",
    });
  });

  it("should return 400 if username is not a string", async () => {
    const req = {
      params: { id: 1 },
      body: {
        nama: "User 1",
        username: 123,
        password: "password",
        email: "user1@example.com",
        status: "active",
        id_role: 1,
      },
    };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await updateUserById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "username must be a string",
    });
  });

  it("should return 400 if password is not a string", async () => {
    const req = {
      params: { id: 1 },
      body: {
        nama: "User 1",
        username: "user1",
        password: 123456,
        email: "user1@example.com",
        status: "active",
        id_role: 1,
      },
    };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await updateUserById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "password must be a string",
    });
  });

  it("should return 400 if email is not a string", async () => {
    const req = {
      body: {
        nama: "User 1",
        username: "user1",
        password: "password",
        email: 123,
        status: "active",
        id_role: 1,
      },
    };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await updateUserById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "email must be a string",
    });
  });

  it("should return 400 if email is not valid", async () => {
    const req = {
      body: {
        nama: "User 1",
        username: "user1",
        password: "password",
        email: "invalidemail",
        status: "active",
        id_role: 1,
      },
    };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await updateUserById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "email is not valid",
    });
  });

  // memastikan bahwa fungsi updateUserById berhasil memperbarui pengguna dengan ID yang sesuai
  it("should update user by ID successfully", async () => {
    const mockUser = {
      id: 1,
      nama: "Super Admin",
      username: "admin",
      password: "admin123",
      email: "user1@example.com",
      status: true,
      id_role: 1,
      save: jest.fn(),
      update: jest.fn(function (updatedFields) {
        Object.assign(this, updatedFields);
      }),
    };

    const userId = 1;
    const req = {
      params: { id: userId },
      body: {
        nama: "New Super User",
        username: "admin1",
        password: "admin456",
        email: "admin@gmail.com",
        status: true,
        id_role: 2,
      },
    };

    const res = httpMocks.createResponse();
    const next = jest.fn();

    User.findByPk.mockResolvedValue(mockUser);
    Role.findByPk.mockResolvedValue({ id: 2, name: "Role" });
    bcrypt.hash.mockResolvedValue(req.body.password);
    validator.isEmail.mockReturnValue(true);

    await updateUserById(req, res, next);

    // Ensure save method is called correctly
    expect(mockUser.save).toHaveBeenCalled();

    // Assertions for successful update
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "UPDATE User Success",
      dataUser: {
        id: mockUser.id,
        nama: req.body.nama,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        status: req.body.status,
        id_role: mockUser.id_role,
      },
    });
  });

  // memastikan bahwa jika pengguna tidak ditemukan, fungsi akan mengembalikan status 404
  it("should return 404 if user not found", async () => {
    const userId = 1;
    const req = {
      params: { id: userId },
      body: {
        nama: "New Super User",
        username: "admin1",
        password: "admin456",
        email: "admin@gmail.com",
        status: true,
        id_role: 1,
      },
    };
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
      params: { id: 1 }, // Pastikan ID user disertakan
      body: {
        nama: "New Super User",
        username: "admin1",
        password: "admin456",
        email: "admin@gmail.com",
        status: true,
        id_role: 2, // Pastikan id_role berbeda dari yang ada di mockUser
      },
    };

    // Mock respons
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock user yang ditemukan
    const mockUser = {
      id: 1,
      nama: "Super Admin",
      username: "admin",
      password: "admin123",
      email: "user1@example.com",
      status: true,
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
    const req = {
      params: { id: userId },
      body: {
        nama: "New Super User",
        username: "admin1",
        password: "admin456",
        email: "admin@gmail.com",
        status: true,
        id_role: 2,
      },
    }; // Memastikan req.body ada
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
