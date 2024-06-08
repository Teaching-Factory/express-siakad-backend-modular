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
  // mengecek jika kolom nama tidak kosong
  it("should return 400 if nama is missing", async () => {
    const req = {
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

    await createUser(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama is required",
    });
  });

  // mengecek jika kolom username tidak kosong
  it("should return 400 if username is missing", async () => {
    const req = {
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

    await createUser(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "username is required",
    });
  });

  // mengecek jika kolom password tidak kosong
  it("should return 400 if password is missing", async () => {
    const req = {
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

    await createUser(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "password is required",
    });
  });

  // mengecek jika kolom status tidak kosong
  it("should return 400 if status is missing", async () => {
    const req = {
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

    await createUser(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "status is required",
    });
  });

  // mengecek jika kolom id_role tidak kosong
  it("should return 400 if id_role is missing", async () => {
    const req = {
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

    await createUser(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_role is required",
    });
  });

  // mengecek jika kolom nama bukan jenis string
  it("should return 400 if nama is not a string", async () => {
    const req = {
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

    await createUser(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama must be a string",
    });
  });

  // mengecek jika kolom username bukan jenis string
  it("should return 400 if username is not a string", async () => {
    const req = {
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

    await createUser(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "username must be a string",
    });
  });

  // mengecek jika kolom password bukan jenis string
  it("should return 400 if password is not a string", async () => {
    const req = {
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

    await createUser(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "password must be a string",
    });
  });

  // memastikan bahwa fungsi mengembalikan status 400 jika email bukan string
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

    await createUser(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "email must be a string",
    });
  });

  // memastikan bahwa fungsi mengembalikan status 400 jika email tidak valid
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

    await createUser(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "email is not valid",
    });
  });

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
