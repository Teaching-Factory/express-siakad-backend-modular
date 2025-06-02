const { doLogout } = require("../../src/modules/auth/controller");
const { BlacklistedToken } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  BlacklistedToken: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe("doLogout", () => {
  // menguji jika logout berhasil tanpa ada token yang terblacklist
  it("should logout successfully", async () => {
    const token = "mockToken";
    const req = { headers: { authorization: token } };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    BlacklistedToken.findOne.mockResolvedValue(null);
    BlacklistedToken.create.mockResolvedValue({});

    await doLogout(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({ message: "Anda baru saja logout" });
  });

  // menguji jika token tidak disertakan, maka akan mengembalikan status 400
  it("should return 400 if token is not provided", async () => {
    const req = { headers: {} };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await doLogout(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "Token tidak ditemukan" });
  });

  // menguji jika token sudah terblacklist, maka akan mengembalikan status 400
  it("should return 400 if token is blacklisted", async () => {
    const token = "mockToken";
    const req = { headers: { authorization: token } };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    BlacklistedToken.findOne.mockResolvedValue({});

    await doLogout(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "Token Sudah Expired" });
  });

  // menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should handle errors", async () => {
    const token = "mockToken";
    const req = { headers: { authorization: token } };
    const res = httpMocks.createResponse();
    const next = jest.fn();
    const mockError = new Error("Test error");

    BlacklistedToken.findOne.mockRejectedValue(mockError);

    await doLogout(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
