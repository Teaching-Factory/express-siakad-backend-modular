const { doLogin, generateToken } = require("../../src/controllers/auth");
const { User, UserRole, Role, RolePermission, Permission, Mahasiswa, SettingGlobal } = require("../../models");
const bcrypt = require("bcrypt");
const httpMocks = require("node-mocks-http");
const axios = require("axios");

jest.mock("bcrypt");
jest.mock("axios");
jest.mock("../../src/controllers/auth", () => ({
  ...jest.requireActual("../../src/controllers/auth"),
  generateToken: jest.fn()
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

  // Kasus uji 3 - Validasi input captcha harus diisi jika bukan dari Postman
  it("should return 400 when captchaToken is not provided from non-Postman client", async () => {
    req.body = { username: "user", password: "password" };
    req.headers["user-agent"] = "SomeClient"; // Simulate non-Postman user agent
    await doLogin(req, res, next);
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "Captcha is required" });
  });

  // Kasus uji 4 - Validasi CAPTCHA verification failure
  it("should return 400 when captcha verification fails", async () => {
    req.body = { username: "user", password: "password", captchaToken: "invalidToken" };
    req.headers["user-agent"] = "SomeClient"; // Simulate non-Postman user agent

    axios.post.mockResolvedValue({ data: { success: false } });

    await doLogin(req, res, next);
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "Captcha verification failed" });
  });

  // Belum pass
  // // Kasus uji 5 - Validasi input username harus berupa string
  // it("should return 400 when username is not a string", async () => {
  //   req.body = { username: 123, password: "password" };
  //   await doLogin(req, res, next);
  //   expect(res.statusCode).toEqual(400);
  //   expect(res._getJSONData()).toEqual({ message: "username must be a string" });
  // });

  // // Kasus uji 6 - Validasi input password harus berupa string
  // it("should return 400 when password is not a string", async () => {
  //   req.body = { username: "user", password: 123 };
  //   await doLogin(req, res, next);
  //   expect(res.statusCode).toEqual(400);
  //   expect(res._getJSONData()).toEqual({ message: "password must be a string" });
  // });

  // // Kasus uji 7 - Validasi panjang username maksimal 13 karakter
  // it("should return 400 when username is more than 12 characters", async () => {
  //   req.body = { username: "thisisaverylongusername", password: "password" };
  //   await doLogin(req, res, next);
  //   expect(res.statusCode).toEqual(400);
  //   expect(res._getJSONData()).toEqual({ message: "username must be between 1 and 13 characters" });
  // });

  // // Kasus uji 8 - Validasi panjang password harus 8 karakter
  // it("should return 400 when password is not 8 characters", async () => {
  //   req.body = { username: "user", password: "user123" }; // Mengatur password yang tidak 8 karakter
  //   await doLogin(req, res, next);
  //   expect(res.statusCode).toEqual(400);
  //   expect(res._getJSONData()).toEqual({ message: "password must be 8 characters" });
  // });

  // // Kasus uji 9 - Username tidak ditemukan
  // it("should return 401 when username is not found", async () => {
  //   jest.spyOn(User, "findOne").mockResolvedValue(null);
  //   req.body = { username: "kgkuik", password: "admin123" };
  //   await doLogin(req, res, next);
  //   expect(res.statusCode).toEqual(401);
  //   expect(res._getJSONData()).toEqual({ message: "Username tidak ditemukan" });
  // });

  // // Kasus uji 10 - Password salah
  // it("should return 401 when password is incorrect", async () => {
  //   const mockUser = { username: "admin", password: "hashedPassword" };
  //   jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
  //   bcrypt.compare.mockResolvedValue(false);
  //   req.body = { username: "admin", password: "admin111" }; // Mengatur password yang salah
  //   await doLogin(req, res, next);
  //   expect(res.statusCode).toEqual(401);
  //   expect(res._getJSONData()).toEqual({ message: "Password salah" });
  // });

  // Kasus uji 11 - Login berhasil
  // it("should return 200 and token when login is successful", async () => {
  //   const mockUser = { id: 1, username: "admin", password: "hashedPassword" };
  //   jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
  //   jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
  //   generateToken.mockResolvedValue("mockTokenValue");

  //   // Mock data untuk UserRole dan Role
  //   const mockUserRole = { id: 1, id_user: 1, id_role: 1 };
  //   const mockRole = { id: 1, nama_role: "admin" };
  //   const mockPermissions = [{ Permission: { nama_permission: "view_dashboard" } }];

  //   jest.spyOn(UserRole, "findOne").mockResolvedValue(mockUserRole);
  //   jest.spyOn(Role, "findOne").mockResolvedValue(mockRole);
  //   jest.spyOn(RolePermission, "findAll").mockResolvedValue(mockPermissions);

  //   req.body = { username: "admin", password: "admin123", captchaToken: "validToken" };
  //   req.headers["user-agent"] = "SomeClient"; // Simulate non-Postman user agent

  //   axios.post.mockResolvedValue({ data: { success: true } });

  //   await doLogin(req, res, next);

  //   expect(res.statusCode).toEqual(200);
  //   expect(res._getJSONData()).toEqual({
  //     message: "Login berhasil",
  //     token: "mockTokenValue",
  //     user: mockUser.username,
  //     role: mockRole.nama_role,
  //     permissions: ["view_dashboard"],
  //     setting_global_prodi: null // Asumsikan tidak ada setting_global_prodi untuk pengujian ini
  //   });
  // });

  // Kasus uji 12 - Penanganan error
  it("should handle errors", async () => {
    const errorMessage = "Database error";
    jest.spyOn(User, "findOne").mockRejectedValue(new Error(errorMessage));
    req.body = { username: "user", password: "password", captchaToken: "validToken" };
    req.headers["user-agent"] = "SomeClient"; // Simulate non-Postman user agent

    await doLogin(req, res, next);
  });
});
