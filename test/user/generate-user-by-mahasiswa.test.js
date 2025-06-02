const { generateUserByMahasiswa } = require("../../src/modules/user/controller");
const { User, UserRole, Role, Mahasiswa } = require("../../models");
const bcrypt = require("bcrypt");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  User: {
    create: jest.fn(),
    findAll: jest.fn(),
  },
  UserRole: {
    create: jest.fn(),
  },
  Role: {
    findOne: jest.fn(),
  },
  Mahasiswa: {
    findOne: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

describe("generateUserByMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should generate users for valid mahasiswas", async () => {
    req.body = {
      mahasiswas: [{ id_registrasi_mahasiswa: "000019b8-eab3-4f98-9969-4442071fff74" }, { id_registrasi_mahasiswa: "fe682cab-00aa-4b53-afd2-87b5d010ef9f" }],
    };

    const mockRole = { id: 3, nama_role: "mahasiswa" };
    Role.findOne.mockResolvedValue(mockRole);

    const mockMahasiswa1 = {
      id_registrasi_mahasiswa: "000019b8-eab3-4f98-9969-4442071fff74",
      nama_mahasiswa: "Mahasiswa 1",
      nim: "12345",
      tanggal_lahir: "2000-01-01",
    };

    const mockMahasiswa2 = {
      id_registrasi_mahasiswa: "fe682cab-00aa-4b53-afd2-87b5d010ef9f",
      nama_mahasiswa: "Mahasiswa 2",
      nim: "67890",
      tanggal_lahir: "2000-02-02",
    };

    Mahasiswa.findOne.mockResolvedValueOnce(mockMahasiswa1).mockResolvedValueOnce(mockMahasiswa2);

    User.findAll.mockResolvedValue([]); // Tidak ada user mahasiswa yang sudah ada

    bcrypt.hash.mockResolvedValue("hashedpassword");

    User.create.mockResolvedValueOnce({ ...mockMahasiswa1, password: "hashedpassword" });
    User.create.mockResolvedValueOnce({ ...mockMahasiswa2, password: "hashedpassword" });

    UserRole.create.mockResolvedValueOnce(true);
    UserRole.create.mockResolvedValueOnce(true);

    await generateUserByMahasiswa(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GENERATE All User Mahasiswa Success",
      jumlahData: 2,
      data: expect.any(Array),
    });

    expect(Role.findOne).toHaveBeenCalledWith({ where: { nama_role: "mahasiswa" } });
    expect(Mahasiswa.findOne).toHaveBeenCalledTimes(2);
    expect(User.create).toHaveBeenCalledTimes(2);
    expect(UserRole.create).toHaveBeenCalledTimes(2);
  });

  it("should return error when id_registrasi_mahasiswa is missing", async () => {
    req.body = { mahasiswas: [{}] };

    Role.findOne.mockResolvedValue({ id: 3, nama_role: "mahasiswa" });
    Mahasiswa.findOne.mockResolvedValue(null);
    User.findAll.mockResolvedValue([]);

    await generateUserByMahasiswa(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GENERATE All User Mahasiswa Success",
      jumlahData: 1,
      data: [{ message: "Mahasiswa with id undefined not found" }],
    });
  });

  it("should return error when id_registrasi_mahasiswa is null or empty", async () => {
    req.body = {
      mahasiswas: [{ id_registrasi_mahasiswa: null }],
    };

    Role.findOne.mockResolvedValue({ id: 3, nama_role: "mahasiswa" });
    Mahasiswa.findOne.mockResolvedValue(null);
    User.findAll.mockResolvedValue([]);

    await generateUserByMahasiswa(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GENERATE All User Mahasiswa Success",
      jumlahData: 1,
      data: [{ message: "Mahasiswa with id null not found" }],
    });
  });

  it("should handle errors and call next function", async () => {
    req.body = {
      mahasiswas: [{ id_registrasi_mahasiswa: 1 }],
    };

    const mockError = new Error("Test error");
    Role.findOne.mockRejectedValue(mockError);

    await generateUserByMahasiswa(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
