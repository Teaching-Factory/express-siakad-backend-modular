const { updateUserById } = require("../../src/modules/user/controller");
const { User, Role, UserRole } = require("../../models");
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
  UserRole: {
    findOne: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

jest.mock("validator", () => ({
  isEmail: jest.fn(),
}));

describe("updateUserById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    expect(res._getJSONData()).toEqual({ message: "nama is required" });
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
    expect(res._getJSONData()).toEqual({ message: "username is required" });
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
    expect(res._getJSONData()).toEqual({ message: "password is required" });
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
    expect(res._getJSONData()).toEqual({ message: "status is required" });
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
    expect(res._getJSONData()).toEqual({ message: "id_role is required" });
  });

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
    expect(res._getJSONData()).toEqual({ message: "nama must be a string" });
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
    expect(res._getJSONData()).toEqual({ message: "username must be a string" });
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
    expect(res._getJSONData()).toEqual({ message: "password must be a string" });
  });

  it("should return 400 if email is not a string", async () => {
    const req = {
      params: { id: 1 },
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
    expect(res._getJSONData()).toEqual({ message: "email must be a string" });
  });

  it("should return 400 if email is not valid", async () => {
    const req = {
      params: { id: 1 },
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

    validator.isEmail.mockReturnValue(false);

    await updateUserById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "email is not valid" });
  });

  it("should update user by ID successfully", async () => {
    const mockUser = {
      id: 1,
      nama: "Super Admin",
      username: "admin",
      password: "admin123",
      email: "user1@example.com",
      status: true,
      save: jest.fn(),
    };

    const mockUserRole = {
      id_user: 1,
      id_role: 1,
      save: jest.fn(),
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
    UserRole.findOne.mockResolvedValue(mockUserRole);
    bcrypt.hash.mockResolvedValue("hashedpassword");
    validator.isEmail.mockReturnValue(true);

    await updateUserById(req, res, next);

    // Update mockUserRole id_role for assertion
    mockUserRole.id_role = req.body.id_role;

    expect(mockUser.save).toHaveBeenCalled();
    expect(mockUserRole.save).toHaveBeenCalled();

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "UPDATE User Success",
      dataUser: {
        id: mockUser.id,
        nama: req.body.nama,
        username: req.body.username,
        password: "hashedpassword",
        email: req.body.email,
        status: req.body.status,
        hints: req.body.password,
      },
    });
  });

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
        id_role: 2,
      },
    };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    User.findByPk.mockResolvedValue(null);

    await updateUserById(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: `<===== User Not Found:` });
  });
});
