const { getDosenDontHaveUser } = require("../../src/controllers/user");
const { Dosen, User } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  Dosen: {
    findAll: jest.fn(),
  },
  User: {
    findAll: jest.fn(),
  },
}));

describe("getDosenDontHaveUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if no Dosen found without user", async () => {
    User.findAll.mockResolvedValue([{ username: "existing_user" }]); // Mock existing users

    Dosen.findAll.mockResolvedValue([]); // Mock empty Dosen

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getDosenDontHaveUser(req, res, next);

    expect(User.findAll).toHaveBeenCalledWith({
      attributes: ["username"],
    });
    expect(Dosen.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Tidak ada dosen yang belum memiliki user",
    });
  });

  it("should get Dosen without user successfully", async () => {
    User.findAll.mockResolvedValue([{ username: "existing_user" }]); // Mock existing users

    const mockDosen = [
      { nidn: "12345", nama: "Dosen 1", Agama: {}, StatusKeaktifanPegawai: {} },
      { nidn: "67890", nama: "Dosen 2", Agama: {}, StatusKeaktifanPegawai: {} },
    ];

    Dosen.findAll.mockResolvedValue(mockDosen); // Mock Dosen with some without users

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getDosenDontHaveUser(req, res, next);

    expect(User.findAll).toHaveBeenCalledWith({
      attributes: ["username"],
    });
    expect(Dosen.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Dosen Success",
      jumlahData: 2,
      data: mockDosen,
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Database error");
    User.findAll.mockRejectedValue(mockError);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getDosenDontHaveUser(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
