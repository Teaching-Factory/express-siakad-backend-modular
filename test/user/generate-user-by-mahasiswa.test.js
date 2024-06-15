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
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Kode uji 1 - memastikan bahwa pengguna dihasilkan untuk mahasiswa yang valid dan responsnya memiliki status 200 dengan data yang benar
  it("should generate users for valid mahasiswas", async () => {
    // Mock data request
    const req = {
      body: {
        mahasiswas: [{ id_registrasi_mahasiswa: "000019b8-eab3-4f98-9969-4442071fff74" }, { id_registrasi_mahasiswa: "fe682cab-00aa-4b53-afd2-87b5d010ef9f" }],
      },
    };

    // Mock respons
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock role yang ditemukan
    const mockRole = { id: 3, nama_role: "mahasiswa" };
    Role.findOne.mockResolvedValue(mockRole);

    // Mock data mahasiswa yang ditemukan
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

    // Mock bcrypt hash
    const hashedPassword = "hashedpassword";
    bcrypt.hash.mockResolvedValue(hashedPassword);

    // Mock user creation
    const mockUser1 = { id: "000019b8-eab3-4f98-9969-4442071fff74", ...mockMahasiswa1, password: hashedPassword };
    const mockUser2 = { id: "fe682cab-00aa-4b53-afd2-87b5d010ef9f", ...mockMahasiswa2, password: hashedPassword };
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

  // Kode uji 2 - memastikan bahwa ketika data mahasiswa tidak ditemukan, respons memiliki status 200 dengan pesan yang menunjukkan mahasiswa tidak ditemukan
  it("should handle mahasiswa not found", async () => {
    // Mock data request
    const req = {
      body: {
        mahasiswas: [{ id_registrasi_mahasiswa: "000019b8-" }],
      },
    };

    // Mock respons
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock role yang ditemukan
    const mockRole = { id: 3, nama_role: "mahasiswa" };
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
      data: [{ message: "Mahasiswa with id 000019b8- not found" }],
    });

    // Memastikan bahwa metode yang di-mock dipanggil dengan benar
    expect(Role.findOne).toHaveBeenCalledWith({ where: { nama_role: "mahasiswa" } });
    expect(Mahasiswa.findOne).toHaveBeenCalledWith({ where: { id_registrasi_mahasiswa: "000019b8-" } });
    expect(User.create).not.toHaveBeenCalled();
    expect(UserRole.create).not.toHaveBeenCalled();
  });

  // Kode Uji 3 - mengecek ketika id registrasi mahasiswa tidak ada
  it("should return error response when id_registrasi_mahasiswa is not provided", async () => {
    req.body = {
      mahasiswas: [
        {
          // Tidak ada id_registrasi_mahasiswa
        },
      ],
    };

    const role = { id: 3, nama_role: "mahasiswa" };
    Role.findOne = jest.fn().mockResolvedValue(role);
    Mahasiswa.findOne = jest.fn().mockResolvedValue(null);

    await generateUserByMahasiswa(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GENERATE All User Mahasiswa Success",
      jumlahData: 1,
      data: [{ message: "Mahasiswa with id undefined not found" }],
    });
  });

  // Kode uji 4 - mengecek ketika id registrasi mahasiswa null atau kosong
  it("should return error response when id_registrasi_mahasiswa is null or empty", async () => {
    req.body = {
      mahasiswas: [
        {
          id_registrasi_mahasiswa: null,
        },
      ],
    };

    const role = { id: 3, nama_role: "mahasiswa" };
    Role.findOne = jest.fn().mockResolvedValue(role);
    Mahasiswa.findOne = jest.fn().mockResolvedValue(null);

    await generateUserByMahasiswa(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GENERATE All User Mahasiswa Success",
      jumlahData: 1,
      data: [{ message: "Mahasiswa with id null not found" }],
    });
  });

  // Kode uji 5 - memastikan bahwa kesalahan yang terjadi selama proses penemuan role atau mahasiswa ditangani dengan benar dan dipanggil dengan fungsi next
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
