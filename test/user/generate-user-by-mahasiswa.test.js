const { generateUserByMahasiswa } = require("../../src/controllers/user");
const { User, UserRole, Role, Mahasiswa } = require("../../models");
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
  Mahasiswa: {
    findOne: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

describe("generateUserByMahasiswa", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // memastikan bahwa pengguna dihasilkan untuk mahasiswa yang valid dan responsnya memiliki status 200 dengan data yang benar
  it("should generate users for valid mahasiswas", async () => {
    // Mock data request
    const req = {
      body: {
        mahasiswas: [{ id_registrasi_mahasiswa: 1 }, { id_registrasi_mahasiswa: 2 }],
      },
    };

    // Mock respons
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock role yang ditemukan
    const mockRole = { id: 1, nama_role: "mahasiswa" };
    Role.findOne.mockResolvedValue(mockRole);

    // Mock data mahasiswa yang ditemukan
    const mockMahasiswa1 = {
      id_registrasi_mahasiswa: 1,
      nama_mahasiswa: "Mahasiswa 1",
      nim: "12345",
      tanggal_lahir: "2000-01-01",
    };
    const mockMahasiswa2 = {
      id_registrasi_mahasiswa: 2,
      nama_mahasiswa: "Mahasiswa 2",
      nim: "67890",
      tanggal_lahir: "2000-02-02",
    };
    Mahasiswa.findOne.mockResolvedValueOnce(mockMahasiswa1).mockResolvedValueOnce(mockMahasiswa2);

    // Mock bcrypt hash
    const hashedPassword = "hashedpassword";
    bcrypt.hash.mockResolvedValue(hashedPassword);

    // Mock user creation
    const mockUser1 = { id: 1, ...mockMahasiswa1, password: hashedPassword };
    const mockUser2 = { id: 2, ...mockMahasiswa2, password: hashedPassword };
    User.create.mockResolvedValueOnce(mockUser1).mockResolvedValueOnce(mockUser2);

    // Mock UserRole creation
    UserRole.create.mockResolvedValueOnce(true).mockResolvedValueOnce(true);

    // Menjalankan fungsi generateUserByMahasiswa
    await generateUserByMahasiswa(req, res, next);

    // Memastikan bahwa fungsi mengembalikan status 200
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GENERATE All User Mahasiswa Success",
      jumlahData: 2,
      data: [mockUser1, mockUser2],
    });

    // Memastikan bahwa metode yang di-mock dipanggil dengan benar
    expect(Role.findOne).toHaveBeenCalledWith({ where: { nama_role: "mahasiswa" } });
    expect(Mahasiswa.findOne).toHaveBeenCalledTimes(2);
    expect(User.create).toHaveBeenCalledTimes(2);
    expect(UserRole.create).toHaveBeenCalledTimes(2);
  });

  // memastikan bahwa ketika data mahasiswa tidak ditemukan, respons memiliki status 200 dengan pesan yang menunjukkan mahasiswa tidak ditemukan
  it("should handle mahasiswa not found", async () => {
    // Mock data request
    const req = {
      body: {
        mahasiswas: [{ id_registrasi_mahasiswa: 1 }],
      },
    };

    // Mock respons
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock role yang ditemukan
    const mockRole = { id: 1, nama_role: "mahasiswa" };
    Role.findOne.mockResolvedValue(mockRole);

    // Mock data mahasiswa yang tidak ditemukan
    Mahasiswa.findOne.mockResolvedValue(null);

    // Menjalankan fungsi generateUserByMahasiswa
    await generateUserByMahasiswa(req, res, next);

    // Memastikan bahwa fungsi mengembalikan status 200
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GENERATE All User Mahasiswa Success",
      jumlahData: 1,
      data: [{ message: "Mahasiswa with id 1 not found" }],
    });

    // Memastikan bahwa metode yang di-mock dipanggil dengan benar
    expect(Role.findOne).toHaveBeenCalledWith({ where: { nama_role: "mahasiswa" } });
    expect(Mahasiswa.findOne).toHaveBeenCalledWith({ where: { id_registrasi_mahasiswa: 1 } });
    expect(User.create).not.toHaveBeenCalled();
    expect(UserRole.create).not.toHaveBeenCalled();
  });

  // memastikan bahwa kesalahan yang terjadi selama proses penemuan role atau mahasiswa ditangani dengan benar dan dipanggil dengan fungsi next
  it("should handle errors", async () => {
    // Mock data request
    const req = {
      body: {
        mahasiswas: [{ id_registrasi_mahasiswa: 1 }],
      },
    };

    // Mock respons
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock error yang dilemparkan
    const mockError = new Error("Test error");
    Role.findOne.mockRejectedValue(mockError);

    // Menjalankan fungsi generateUserByMahasiswa
    await generateUserByMahasiswa(req, res, next);

    // Memastikan bahwa fungsi next dipanggil dengan error yang sesuai
    expect(next).toHaveBeenCalledWith(mockError);
  });
});
