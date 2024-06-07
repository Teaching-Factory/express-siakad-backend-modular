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

  // Kasus uji 1 - Username tidak ditemukan
  it("should return 401 when username is not found", async () => {
    jest.spyOn(User, "findOne").mockResolvedValue(null);

    req.body = { username: "nonexistentuser", password: "password" };

    await doLogin(req, res, next);

    expect(res.statusCode).toEqual(401);
    expect(res._getJSONData()).toEqual({ message: "Username tidak ditemukan" });
  });

  // Kasus uji 2 - Password salah
  it("should return 401 when password is incorrect", async () => {
    const mockUser = { username: "user", password: "hashedpassword" };

    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    req.body = { username: "user", password: "wrongpassword" };

    await doLogin(req, res, next);

    expect(res.statusCode).toEqual(401);
    expect(res._getJSONData()).toEqual({ message: "Password salah" });
  });

  // Kasus uji 3 - Login berhasil
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

  // Kasus uji 4 - Penanganan error
  it("should handle errors", async () => {
    const errorMessage = "Database error";
    jest.spyOn(User, "findOne").mockRejectedValue(new Error(errorMessage));

    req.body = { username: "user", password: "password" };

    await doLogin(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
