const { generateUserByDosen } = require("../../src/controllers/user");
const { User, UserRole, Role, Dosen } = require("../../models");
const bcrypt = require("bcrypt");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  User: {
    create: jest.fn(),
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
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Kode uji 1 - memastikan bahwa pengguna dihasilkan untuk dosen yang valid dan responsnya memiliki status 200 dengan data yang benar
  it("should generate users for valid dosens", async () => {
    // Mock data request
    const req = {
      body: {
        dosens: [{ id_dosen: "015ce092-86d7-4af4-bb5a-638b56478306" }, { id_dosen: "01f0d7e4-47b2-479b-8ff9-10a3bf99d611" }],
      },
    };

    // Mock respons
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock role yang ditemukan
    const mockRole = { id: 2, nama_role: "dosen" };
    Role.findOne.mockResolvedValue(mockRole);

    // Mock data dosen yang ditemukan
    const mockDosen1 = {
      id_dosen: "015ce092-86d7-4af4-bb5a-638b56478306",
      nama_dosen: "Dosen 1",
      nidn: "12345",
      tanggal_lahir: "1970-01-01",
    };
    const mockDosen2 = {
      id_dosen: "01f0d7e4-47b2-479b-8ff9-10a3bf99d611",
      nama_dosen: "Dosen 2",
      nidn: "67890",
      tanggal_lahir: "1980-02-02",
    };
    Dosen.findOne.mockResolvedValueOnce(mockDosen1).mockResolvedValueOnce(mockDosen2);

    // Mock bcrypt hash
    const hashedPassword = "hashedpassword";
    bcrypt.hash.mockResolvedValue(hashedPassword);

    // Mock user creation
    const mockUser1 = { id: "015ce092-86d7-4af4-bb5a-638b56478306", ...mockDosen1, password: hashedPassword };
    const mockUser2 = { id: "01f0d7e4-47b2-479b-8ff9-10a3bf99d611", ...mockDosen2, password: hashedPassword };
    User.create.mockResolvedValueOnce(mockUser1).mockResolvedValueOnce(mockUser2);

    // Mock UserRole creation
    UserRole.create.mockResolvedValueOnce(true).mockResolvedValueOnce(true);

    // Menjalankan fungsi generateUserByDosen
    await generateUserByDosen(req, res, next);

    // Memastikan bahwa fungsi mengembalikan status 200
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GENERATE All User Dosen Success",
      jumlahData: 2,
      data: [mockUser1, mockUser2],
    });

    // Memastikan bahwa metode yang di-mock dipanggil dengan benar
    expect(Role.findOne).toHaveBeenCalledWith({ where: { nama_role: "dosen" } });
    expect(Dosen.findOne).toHaveBeenCalledTimes(2);
    expect(User.create).toHaveBeenCalledTimes(2);
    expect(UserRole.create).toHaveBeenCalledTimes(2);
  });

  // Kode uji 2 - memastikan bahwa ketika data dosen tidak ditemukan, respons memiliki status 200 dengan pesan yang menunjukkan dosen tidak ditemukan
  it("should handle dosen not found", async () => {
    // Mock data request
    const req = {
      body: {
        dosens: [{ id_dosen: "015ce09" }],
      },
    };

    // Mock respons
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock role yang ditemukan
    const mockRole = { id: 2, nama_role: "dosen" };
    Role.findOne.mockResolvedValue(mockRole);

    // Mock data dosen yang tidak ditemukan
    Dosen.findOne.mockResolvedValue(null);

    // Menjalankan fungsi generateUserByDosen
    await generateUserByDosen(req, res, next);

    // Memastikan bahwa fungsi mengembalikan status 200
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GENERATE All User Dosen Success",
      jumlahData: 1,
      data: [{ message: "Dosen with id 015ce09 not found" }],
    });

    // Memastikan bahwa metode yang di-mock dipanggil dengan benar
    expect(Role.findOne).toHaveBeenCalledWith({ where: { nama_role: "dosen" } });
    expect(Dosen.findOne).toHaveBeenCalledWith({ where: { id_dosen: "015ce09" } });
    expect(User.create).not.toHaveBeenCalled();
    expect(UserRole.create).not.toHaveBeenCalled();
  });

  // Kode Uji 3 - mengecek ketika id dosen tidak ada
  it("should return error response when id_dosen is not provided", async () => {
    req.body = {
      dosens: [
        {
          // Tidak ada id_dosen
        },
      ],
    };

    const role = { id: 2, nama_role: "dosen" };
    Role.findOne = jest.fn().mockResolvedValue(role);
    Dosen.findOne = jest.fn().mockResolvedValue(null);

    await generateUserByDosen(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GENERATE All User Dosen Success",
      jumlahData: 1,
      data: [{ message: "Dosen with id undefined not found" }],
    });
  });

  // Kode uji 4 - mengecek ketika id registrasi Dosen null atau kosong
  it("should return error response when id_dosen is null or empty", async () => {
    req.body = {
      dosens: [
        {
          id_dosen: null,
        },
      ],
    };

    const role = { id: 2, nama_role: "dosen" };
    Role.findOne = jest.fn().mockResolvedValue(role);
    Dosen.findOne = jest.fn().mockResolvedValue(null);

    await generateUserByDosen(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GENERATE All User Dosen Success",
      jumlahData: 1,
      data: [{ message: "Dosen with id null not found" }],
    });
  });

  // Kode uji 5 - memastikan bahwa kesalahan yang terjadi selama proses penemuan role atau dosen ditangani dengan benar dan dipanggil dengan fungsi next
  it("should handle errors", async () => {
    // Mock data request
    const req = {
      body: {
        dosens: [{ id_dosen: 1 }],
      },
    };

    // Mock respons
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock error yang dilemparkan
    const mockError = new Error("Test error");
    Role.findOne.mockRejectedValue(mockError);

    // Menjalankan fungsi generateUserByDosen
    await generateUserByDosen(req, res, next);

    // Memastikan bahwa fungsi next dipanggil dengan error yang sesuai
    expect(next).toHaveBeenCalledWith(mockError);
  });
});
