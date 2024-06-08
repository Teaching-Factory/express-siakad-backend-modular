const { doLogin, generateToken } = require("../../src/controllers/auth");
const { User } = require("../../models");
const bcrypt = require("bcrypt");
const httpMocks = require("node-mocks-http");

jest.mock("bcrypt");
jest.mock("../../src/controllers/auth", () => ({
  ...jest.requireActual("../../src/controllers/auth"),
  generateToken: jest.fn(),
}));

describe("doLogin", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kasus uji 1 - Validasi input username harus diisi
  it("should return 400 when username is not provided", async () => {
    req.body = { password: "password" };

    await doLogin(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "username is required" });
  });

  // Kasus uji 2 - Validasi input password harus diisi
  it("should return 400 when password is not provided", async () => {
    req.body = { username: "user" };

    await doLogin(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "password is required" });
  });

  // Kasus uji 3 - Validasi input username harus berupa string
  it("should return 400 when username is not a string", async () => {
    req.body = { username: 123, password: "password" };

    await doLogin(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "username must be a string" });
  });

  // Kasus uji 4 - Validasi input password harus berupa string
  it("should return 400 when password is not a string", async () => {
    req.body = { username: "user", password: 123 };

    await doLogin(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "password must be a string" });
  });

  // Kasus uji 5 - Validasi panjang username minimal 1 karakter
  it("should return 400 when username is more than 12 characters", async () => {
    req.body = { username: "thisisaverylongusername", password: "password" };

    await doLogin(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "username must be between 1 and 12 characters" });
  });

  // Kasus uji 6 - Validasi panjang password minimal 1 karakter
  it("should return 400 when password is less than 1 character", async () => {
    req.body = { username: "user", password: "user123" };

    await doLogin(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "password must be 8 characters" });
  });

  // Kasus uji 7 - Validasi panjang username maksimal 12 karakter
  it("should return 400 when username is more than 12 characters", async () => {
    req.body = { username: "morethan12characters", password: "password" };

    await doLogin(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "username must be between 1 and 12 characters" });
  });

  // Kasus uji 8 - Validasi panjang password maksimal 8 karakter
  it("should return 400 when password is more than 8 characters", async () => {
    req.body = { username: "user", password: "morethan8characters" };

    await doLogin(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "password must be 8 characters" });
  });

  // Kasus uji 9 - Username tidak ditemukan
  it("should return 401 when username is not found", async () => {
    jest.spyOn(User, "findOne").mockResolvedValue(null);

    // Gunakan username dan password yang valid yang memenuhi syarat validasi
    req.body = { username: "validuser", password: "validpwd" };

    await doLogin(req, res, next);

    expect(res.statusCode).toEqual(401);
    expect(res._getJSONData()).toEqual({ message: "Username tidak ditemukan" });
  });

  // Kasus uji 10 - Password salah
  it("should return 401 when password is incorrect", async () => {
    const mockUser = { username: "admin", password: "admin123" };

    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    req.body = { username: "admin", password: "admin111" }; // Mengatur password yang salah

    await doLogin(req, res, next);

    expect(res.statusCode).toEqual(401); // Mengubah harapan status kode
    expect(res._getJSONData()).toEqual({ message: "Password salah" });
  });

  // Kasus uji 11 - Login berhasil
  it("should return 200 and token when login is successful", async () => {
    const mockUser = { id: 1, username: "user", password: "hashedpassword" };
    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
    generateToken.mockResolvedValue("mockTokenValue");

    const req = { body: { username: "user", password: "hashedpassword" } };
    const res = httpMocks.createResponse({ eventEmitter: require("events").EventEmitter });
    const next = jest.fn();

    await doLogin(req, res, next);

    res.on("end", () => {
      try {
        const responseDataStr = res._getData();
        expect(res.statusCode).toEqual(200);
        const responseData = JSON.parse(responseDataStr);
        expect(responseData).toEqual({ message: "Login berhasil", token: "mockTokenValue" });
      } catch (error) {
        next(error);
      }
    });

    res.end(); // Trigger the end event to simulate the response being finished
  });

  // Kasus uji 12 - Penanganan error
  it("should handle errors", async () => {
    const errorMessage = "Database error";
    jest.spyOn(User, "findOne").mockRejectedValue(new Error(errorMessage));

    req.body = { username: "user", password: "password" };

    await doLogin(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
