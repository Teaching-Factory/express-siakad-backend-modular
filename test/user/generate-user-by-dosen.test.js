const { generateUserByDosen } = require("../../src/modules/user/controller");
const { User, UserRole, Role, Dosen } = require("../../models");
const bcrypt = require("bcrypt");
const httpMocks = require("node-mocks-http");
const { Op } = require("sequelize");

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
  Dosen: {
    findOne: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

describe("generateUserByDosen", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should generate users for valid dosens", async () => {
    req.body = {
      dosens: [{ id_dosen: "015ce092-86d7-4af4-bb5a-638b56478306" }, { id_dosen: "01f0d7e4-47b2-479b-8ff9-10a3bf99d611" }],
    };

    const mockRole = { id: 2, nama_role: "dosen" };
    Role.findOne.mockResolvedValue(mockRole);

    User.findAll.mockResolvedValue([{ username: "12345" }]); // Simulasi username yang sudah ada

    const mockDosen1 = {
      id_dosen: "015ce092-86d7-4af4-bb5a-638b56478306",
      nama_dosen: "Dosen 1",
      nidn: "54321",
      tanggal_lahir: "1970-01-01",
    };
    const mockDosen2 = {
      id_dosen: "01f0d7e4-47b2-479b-8ff9-10a3bf99d611",
      nama_dosen: "Dosen 2",
      nidn: "67890",
      tanggal_lahir: "1980-02-02",
    };

    Dosen.findOne.mockResolvedValueOnce(mockDosen1).mockResolvedValueOnce(mockDosen2);

    bcrypt.hash.mockResolvedValue("hashedpassword");

    const mockUser1 = { id: "user1", ...mockDosen1, password: "hashedpassword" };
    const mockUser2 = { id: "user2", ...mockDosen2, password: "hashedpassword" };

    User.create.mockResolvedValueOnce(mockUser1).mockResolvedValueOnce(mockUser2);
    UserRole.create.mockResolvedValueOnce(true).mockResolvedValueOnce(true);

    await generateUserByDosen(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GENERATE All User Dosen Success",
      jumlahData: 2,
      data: [mockUser1, mockUser2],
    });

    expect(Role.findOne).toHaveBeenCalledWith({ where: { nama_role: "dosen" } });
    expect(Dosen.findOne).toHaveBeenCalledTimes(2);
    expect(User.create).toHaveBeenCalledTimes(2);
    expect(UserRole.create).toHaveBeenCalledTimes(2);
  });

  it("should handle dosen not found or invalid NIDN", async () => {
    req.body = {
      dosens: [{ id_dosen: "015ce092" }],
    };

    const mockRole = { id: 2, nama_role: "dosen" };
    Role.findOne.mockResolvedValue(mockRole);
    User.findAll.mockResolvedValue([]);

    Dosen.findOne.mockResolvedValue(null);

    await generateUserByDosen(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GENERATE All User Dosen Success",
      jumlahData: 1,
      data: [{ message: "Dosen with id 015ce092 not found or has invalid NIDN" }],
    });

    expect(Role.findOne).toHaveBeenCalledWith({ where: { nama_role: "dosen" } });
    expect(Dosen.findOne).toHaveBeenCalledWith({
      where: {
        id_dosen: "015ce092",
        nidn: { [Op.ne]: null, [Op.notIn]: expect.any(Array) },
      },
    });
    expect(User.create).not.toHaveBeenCalled();
    expect(UserRole.create).not.toHaveBeenCalled();
  });

  it("should return error response when id_dosen is not provided", async () => {
    req.body = {
      dosens: [{}], // Tidak ada id_dosen
    };

    const mockRole = { id: 2, nama_role: "dosen" };
    Role.findOne.mockResolvedValue(mockRole);
    User.findAll.mockResolvedValue([]);

    Dosen.findOne.mockResolvedValue(null);

    await generateUserByDosen(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GENERATE All User Dosen Success",
      jumlahData: 1,
      data: [{ message: "Dosen with id undefined not found or has invalid NIDN" }],
    });
  });

  it("should return error response when id_dosen is null or empty", async () => {
    req.body = {
      dosens: [{ id_dosen: null }],
    };

    const mockRole = { id: 2, nama_role: "dosen" };
    Role.findOne.mockResolvedValue(mockRole);
    User.findAll.mockResolvedValue([]);

    Dosen.findOne.mockResolvedValue(null);

    await generateUserByDosen(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GENERATE All User Dosen Success",
      jumlahData: 1,
      data: [{ message: "Dosen with id null not found or has invalid NIDN" }],
    });
  });

  it("should handle errors", async () => {
    req.body = {
      dosens: [{ id_dosen: "015ce092" }],
    };

    const mockError = new Error("Test error");
    Role.findOne.mockRejectedValue(mockError);

    await generateUserByDosen(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
