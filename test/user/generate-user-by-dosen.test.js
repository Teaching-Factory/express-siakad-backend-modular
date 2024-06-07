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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // memastikan bahwa pengguna dihasilkan untuk dosen yang valid dan responsnya memiliki status 200 dengan data yang benar
  it("should generate users for valid dosens", async () => {
    // Mock data request
    const req = {
      body: {
        dosens: [{ id_dosen: 1 }, { id_dosen: 2 }],
      },
    };

    // Mock respons
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock role yang ditemukan
    const mockRole = { id: 1, nama_role: "dosen" };
    Role.findOne.mockResolvedValue(mockRole);

    // Mock data dosen yang ditemukan
    const mockDosen1 = {
      id_dosen: 1,
      nama_dosen: "Dosen 1",
      nidn: "12345",
      tanggal_lahir: "1970-01-01",
    };
    const mockDosen2 = {
      id_dosen: 2,
      nama_dosen: "Dosen 2",
      nidn: "67890",
      tanggal_lahir: "1980-02-02",
    };
    Dosen.findOne.mockResolvedValueOnce(mockDosen1).mockResolvedValueOnce(mockDosen2);

    // Mock bcrypt hash
    const hashedPassword = "hashedpassword";
    bcrypt.hash.mockResolvedValue(hashedPassword);

    // Mock user creation
    const mockUser1 = { id: 1, ...mockDosen1, password: hashedPassword };
    const mockUser2 = { id: 2, ...mockDosen2, password: hashedPassword };
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

  // memastikan bahwa ketika data dosen tidak ditemukan, respons memiliki status 200 dengan pesan yang menunjukkan dosen tidak ditemukan
  it("should handle dosen not found", async () => {
    // Mock data request
    const req = {
      body: {
        dosens: [{ id_dosen: 1 }],
      },
    };

    // Mock respons
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock role yang ditemukan
    const mockRole = { id: 1, nama_role: "dosen" };
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
      data: [{ message: "Dosen with id 1 not found" }],
    });

    // Memastikan bahwa metode yang di-mock dipanggil dengan benar
    expect(Role.findOne).toHaveBeenCalledWith({ where: { nama_role: "dosen" } });
    expect(Dosen.findOne).toHaveBeenCalledWith({ where: { id_dosen: 1 } });
    expect(User.create).not.toHaveBeenCalled();
    expect(UserRole.create).not.toHaveBeenCalled();
  });

  // memastikan bahwa kesalahan yang terjadi selama proses penemuan role atau dosen ditangani dengan benar dan dipanggil dengan fungsi next
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
