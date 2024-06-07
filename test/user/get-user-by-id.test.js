const { getUserById } = require("../../src/controllers/user");
const { User } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  User: {
    findByPk: jest.fn(),
  },
}));

describe("getUserById", () => {
  /*
    menguji jika pengambilan pengguna berdasarkan ID berhasil,
    maka akan mengembalikan status 200 beserta data pengguna yang diharapkan
    */
  it("should return user by ID successfully", async () => {
    const mockUser = { id: 1, name: "User 1" };
    const userId = 1;
    const req = { params: { id: userId } };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    User.findByPk.mockResolvedValue(mockUser);

    await getUserById(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET User By ID ${userId} Success:`,
      data: mockUser,
    });
  });

  // menguji jika tidak ada pengguna yang ditemukan berdasarkan ID yang diberikan, maka akan mengembalikan status 404
  it("should return 404 if user not found", async () => {
    const userId = 1;
    const req = { params: { id: userId } };
    const res = httpMocks.createResponse();
    const next = jest.fn();

    User.findByPk.mockResolvedValue(null);

    await getUserById(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== User With ID ${userId} Not Found:`,
    });
  });

  // menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should handle errors", async () => {
    const userId = 1;
    const req = { params: { id: userId } };
    const res = httpMocks.createResponse();
    const next = jest.fn();
    const mockError = new Error("Test error");

    User.findByPk.mockRejectedValue(mockError);

    await getUserById(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
